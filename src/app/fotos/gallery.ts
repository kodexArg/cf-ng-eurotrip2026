import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { Carousel } from 'primeng/carousel';
import { Image } from 'primeng/image';
import { UploadForm } from './upload-form/upload-form';
import { City, Photo } from '../shared/models';
import { AuthService } from '../shared/services/auth.service';
import { environment } from '../../environments/environment';

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
    <div class="max-w-5xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-surface-800 select-none">Fotos del viaje</h1>

      @if (auth.isOwner() && citiesResource.value()?.length) {
        <app-upload-form [cities]="citiesResource.value()!" (uploaded)="reload()" />
      }

      @if (photosResource.isLoading()) {
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          @for (i of [1,2,3,4,5,6]; track i) {
            <p-skeleton height="220px" />
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
          <section class="mb-8 rounded-lg overflow-hidden border border-surface-200">
            <div class="p-4 text-white select-none" [style.background-color]="g.color">
              <h2 class="text-xl font-bold m-0">{{ g.cityName }}</h2>
            </div>
            <div class="p-4 bg-surface-0 flex flex-col gap-5">
              @for (dg of g.dateGroups; track dg.date) {
                <div class="flex flex-col gap-2">
                  @if (dg.label) {
                    <h3 class="text-sm font-semibold text-surface-700 m-0 select-none">{{ dg.label }}</h3>
                  }
                  <p-carousel
                    [value]="dg.photos"
                    [numVisible]="3"
                    [numScroll]="1"
                    [circular]="dg.photos.length > 3"
                    [responsiveOptions]="responsive"
                  >
                    <ng-template #item let-photo>
                      <div class="p-2 flex flex-col items-center">
                        <p-image
                          [src]="mediaUrl(photo)"
                          [preview]="true"
                          styleClass="block w-full"
                          imageClass="w-full rounded-md"
                          [imageStyle]="{ height: '13rem', width: '100%', 'object-fit': 'cover' }"
                          [alt]="photo.caption ?? ''"
                        />
                        @if (photo.caption) {
                          <p class="text-sm text-surface-700 font-medium mt-2 m-0 text-center leading-snug">
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
  readonly auth = inject(AuthService);
  private readonly refresh = signal(0);

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

  reload(): void {
    this.refresh.update((n) => n + 1);
  }

  mediaUrl(p: Photo): string {
    return environment.r2BaseUrl + '/' + p.r2Key;
  }
}
