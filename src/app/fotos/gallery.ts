import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { Carousel } from 'primeng/carousel';
import { Image } from 'primeng/image';
import { UploadForm } from './upload-form/upload-form';
import { City, Photo } from '../shared/models';
import { environment } from '../../environments/environment';

interface WhoAmI {
  accessActive: boolean;
  email: string | null;
  editor: boolean;
}

interface DateGroup {
  /** ISO date string, or null for generic (no-date) photos. */
  date: string | null;
  /** Pretty label: '' for generic, localized date otherwise. */
  label: string;
  photos: Photo[];
}

interface CityGroup {
  cityId: string;
  cityName: string;
  color: string;
  dateGroups: DateGroup[];
}

/**
 * Trip media gallery — grouped by CITY, ordered by itinerary arrival:
 * a colored header (city color + name) and the city's photos in a PrimeNG
 * carousel. Clicking a photo opens PrimeNG's image preview (zoom).
 */
@Component({
  selector: 'app-gallery',
  imports: [Message, Skeleton, Carousel, Image, UploadForm],
  template: `
    <div class="max-w-5xl mx-auto px-3 py-4 sm:px-4">
      <!-- Page title — mirrors calendar's day-detail header weight/size -->
      <div class="mb-4 flex items-center gap-2">
        <h1
          class="text-base font-bold leading-tight m-0 select-none"
          style="color: var(--p-surface-800)"
        >Fotos del viaje</h1>
      </div>

      @if (canEdit() && citiesResource.value()?.length) {
        <app-upload-form [cities]="citiesResource.value()!" (uploaded)="reload()" />
      }

      @if (photosResource.isLoading()) {
        <!-- Skeleton grid: 1 col mobile, 2 col sm, 3 col md -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          @for (i of [1,2,3,4,5,6]; track i) {
            <p-skeleton height="200px" styleClass="rounded-lg" />
          }
        </div>
      } @else if (photosResource.error()) {
        <p-message severity="error" text="No se pudieron cargar las fotos." />
      } @else if (!groups().length) {
        <div class="flex flex-col items-center justify-center py-16 gap-3">
          <p-message severity="info" text="Aún no hay fotos. ¡Pronto!" />
        </div>
      } @else {
        @for (g of groups(); track g.cityId) {
          <!--
            City section — same surface/card pattern as day-detail-dialog rows:
            rounded-lg border border-surface-200, colored left border + tinted header.
          -->
          <section
            class="mb-6 rounded-lg overflow-hidden"
            style="border: 1px solid var(--p-surface-200)"
          >
            <!-- City header: 4px left border accent, tinted bg, matches dialog header -->
            <div
              class="px-4 pt-4 pb-3 select-none"
              [style.borderLeft]="'4px solid ' + g.color"
              [style.background]="headerBg(g.color)"
            >
              <div
                class="text-base font-bold leading-tight"
                [style.color]="g.color"
              >{{ g.cityName }}</div>
            </div>

            <!-- Date groups inside the city card -->
            <div class="px-3 py-3 sm:px-4 flex flex-col gap-4" style="background: var(--p-surface-0)">
              @for (dg of g.dateGroups; track dg.date) {
                <div class="flex flex-col gap-2">
                  @if (dg.label) {
                    <!--
                      Date sub-header — mirrors "text-xs mt-1 flex items-center"
                      subtitle style from day-detail-dialog.
                    -->
                    <div
                      class="text-xs flex items-center gap-1.5"
                      style="color: var(--p-surface-600)"
                    >
                      <i class="pi pi-calendar" style="font-size: 0.625rem"></i>
                      <span class="font-semibold">{{ dg.label }}</span>
                    </div>
                  }
                  <p-carousel
                    [value]="dg.photos"
                    [numVisible]="3"
                    [numScroll]="1"
                    [circular]="dg.photos.length > 3"
                    [responsiveOptions]="responsive"
                  >
                    <ng-template #item let-photo>
                      <div class="px-1 pb-1 flex flex-col items-center">
                        @if (photo.mediaType === 'video') {
                          <video
                            [src]="mediaUrl(photo)"
                            controls
                            preload="metadata"
                            playsinline
                            class="w-full rounded-lg block"
                            style="height: 11rem; width: 100%; object-fit: cover; background: #000"
                          ></video>
                        } @else {
                          <p-image
                            [src]="mediaUrl(photo)"
                            [preview]="true"
                            styleClass="block w-full"
                            imageClass="w-full rounded-lg"
                            [imageStyle]="{ height: '11rem', width: '100%', 'object-fit': 'cover' }"
                            [alt]="photo.caption ?? ''"
                          />
                        }
                        @if (photo.caption) {
                          <!--
                            Caption: mirrors event description style —
                            text-xs leading-snug surface-600
                          -->
                          <p
                            class="text-xs leading-snug mt-1.5 m-0 text-center w-full"
                            style="color: var(--p-surface-600)"
                          >
                            {{ photo.caption }}
                          </p>
                        }
                      </div>
                    </ng-template>
                  </p-carousel>
                </div>
              }
            </div>
          </section>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPage {
  private readonly refresh = signal(0);

  /** Cloudflare Access identity; editor flag drives the upload surface. */
  private readonly who = httpResource<WhoAmI>(() => '/api/auth/whoami');
  readonly canEdit = computed(() => this.who.value()?.editor === true);

  readonly photosResource = httpResource<Photo[]>(() => `/api/photos?r=${this.refresh()}`);
  readonly citiesResource = httpResource<City[]>(() => '/api/cities');

  readonly responsive = [
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '640px', numVisible: 1, numScroll: 1 },
  ];

  /** Photos grouped by city, ordered by itinerary arrival (ASC). */
  readonly groups = computed((): CityGroup[] => {
    const photos = this.photosResource.value() ?? [];
    const cities = this.citiesResource.value() ?? [];
    // Cities arrive already sorted by arrival ASC from the API; preserve that order.
    const cityById = new Map(cities.map((c) => [c.id, c]));
    const byCity = new Map<string, Photo[]>();
    for (const p of photos) {
      (byCity.get(p.cityId) ?? byCity.set(p.cityId, []).get(p.cityId)!).push(p);
    }
    // Build groups in itinerary order (cities list order); append unknown cities last.
    const knownOrder: CityGroup[] = cities
      .filter((c) => byCity.has(c.id))
      .map((c) => ({
        cityId: c.id,
        cityName: c.name,
        color: c.color,
        dateGroups: this.buildDateGroups(byCity.get(c.id) ?? []),
      }));
    const unknownGroups: CityGroup[] = [...byCity.entries()]
      .filter(([id]) => !cityById.has(id))
      .map(([id, ps]) => ({
        cityId: id,
        cityName: 'Sin ubicación',
        color: '#64748b',
        dateGroups: this.buildDateGroups(ps),
      }));
    return [...knownOrder, ...unknownGroups];
  });

  /**
   * Sub-group a city's photos by `dateTaken`. Generic (no-date) photos form
   * a single labelless group rendered FIRST; dated groups follow ascending.
   */
  private buildDateGroups(photos: Photo[]): DateGroup[] {
    const byDate = new Map<string, Photo[]>();
    const generic: Photo[] = [];
    for (const p of photos) {
      const d = p.dateTaken?.trim();
      if (!d) {
        generic.push(p);
      } else {
        (byDate.get(d) ?? byDate.set(d, []).get(d)!).push(p);
      }
    }
    const dated: DateGroup[] = [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, ps]) => ({ date, label: this.formatDate(date), photos: ps }));
    const result: DateGroup[] = [];
    if (generic.length) result.push({ date: null, label: '', photos: generic });
    return [...result, ...dated];
  }

  private formatDate(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    const dt = new Date(y, m - 1, d);
    const s = dt.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /** Tint a city's hex color to a subtle header background (mirrors day-detail-dialog). */
  headerBg(color: string): string {
    const m = /^#?([0-9a-f]{6})$/i.exec(color.trim());
    if (!m) return 'rgba(0,0,0,0.03)';
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 0xff;
    const g = (n >> 8) & 0xff;
    const b = n & 0xff;
    return `rgba(${r},${g},${b},0.08)`;
  }

  reload(): void {
    this.refresh.update((n) => n + 1);
  }

  mediaUrl(p: Photo): string {
    return environment.r2BaseUrl + '/' + p.r2Key;
  }
}
