import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { Carousel } from 'primeng/carousel';
import { Image } from 'primeng/image';
import { UploadForm } from './upload-form/upload-form';
import { City, Photo } from '../shared/models';
import { AuthService } from '../shared/services/auth.service';
import { environment } from '../../environments/environment';

interface DayGroup {
  date: string;
  cityName: string;
  color: string;
  photos: Photo[];
}

/**
 * Trip media gallery — grouped by DAY, styled like an itinerary day:
 * a colored header (city color + date) and the day's photos in a PrimeNG
 * carousel. Clicking a photo opens PrimeNG's image preview (zoom).
 */
@Component({
  selector: 'app-gallery',
  imports: [DatePipe, Message, Skeleton, Carousel, Image, UploadForm],
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
        @for (g of groups(); track g.date) {
          <section class="mb-8 rounded-lg overflow-hidden border border-surface-200">
            <div class="p-4 text-white select-none" [style.background-color]="g.color">
              <h2 class="text-xl font-bold m-0 capitalize">{{ g.date | date: 'EEEE d MMM' }}</h2>
              <p class="text-sm m-0" style="opacity: 0.9">{{ g.cityName }}</p>
            </div>
            <div class="p-4 bg-surface-0">
              <p-carousel
                [value]="g.photos"
                [numVisible]="3"
                [numScroll]="1"
                [circular]="g.photos.length > 3"
                [responsiveOptions]="responsive"
              >
                <ng-template let-photo pTemplate="item">
                  <div class="p-2">
                    <p-image
                      [src]="mediaUrl(photo)"
                      [preview]="true"
                      imageClass="w-full h-52 object-cover rounded-md"
                      [alt]="photo.caption ?? ''"
                    />
                    @if (photo.caption) {
                      <p class="text-xs text-surface-600 mt-2 m-0 text-center">{{ photo.caption }}</p>
                    }
                  </div>
                </ng-template>
              </p-carousel>
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

  /** Photos grouped by day (dateTaken), ordered chronologically. */
  readonly groups = computed((): DayGroup[] => {
    const photos = this.photosResource.value() ?? [];
    const cities = this.citiesResource.value() ?? [];
    const cityById = new Map(cities.map((c) => [c.id, c]));
    const byDay = new Map<string, Photo[]>();
    for (const p of photos) {
      const key = p.dateTaken ?? 'Sin fecha';
      (byDay.get(key) ?? byDay.set(key, []).get(key)!).push(p);
    }
    return [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, ps]) => {
        const c = cityById.get(ps[0].cityId);
        return {
          date,
          cityName: c?.name ?? '',
          color: c?.color ?? '#64748b',
          photos: ps,
        };
      });
  });

  reload(): void {
    this.refresh.update((n) => n + 1);
  }

  mediaUrl(p: Photo): string {
    return environment.r2BaseUrl + '/' + p.r2Key;
  }
}
