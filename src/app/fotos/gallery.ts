import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { PhotoGrid } from './photo-grid/photo-grid';
import { UploadForm } from './upload-form/upload-form';
import { City, Photo } from '../shared/models';
import { AuthService } from '../shared/services/auth.service';

/**
 * Trip media gallery page (photos + videos), grouped by place in trip order.
 *
 * @remarks
 * Fetches /api/photos and /api/cities (cities are returned arrival-ordered, i.e.
 * trip order). Media is grouped per city; empty cities are skipped. Owners get
 * an upload form; a successful upload refreshes the media list.
 */
@Component({
  selector: 'app-gallery',
  imports: [PhotoGrid, UploadForm, Message, Skeleton],
  template: `
    <div class="max-w-5xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-surface-800 select-none">Fotos del viaje</h1>

      @if (auth.isOwner() && citiesResource.value()?.length) {
        <app-upload-form [cities]="citiesResource.value()!" (uploaded)="reload()" />
      }

      @if (photosResource.isLoading()) {
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          @for (i of [1,2,3,4,5,6]; track i) {
            <p-skeleton height="200px" />
          }
        </div>
      } @else if (photosResource.error()) {
        <p-message severity="error" text="No se pudieron cargar las fotos." />
      } @else if (!photosResource.value()?.length) {
        <div class="flex flex-col items-center justify-center py-16 gap-3">
          <p-message severity="info" text="Aún no hay fotos. ¡Pronto!" />
        </div>
      } @else {
        @for (group of groups(); track group.city.id) {
          <section class="mb-8">
            <h2 class="text-lg font-semibold text-surface-700 mb-3 select-none">
              {{ group.city.name }}
            </h2>
            <app-photo-grid [photos]="group.photos" />
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

  /** Media grouped by city, in trip (arrival) order; empty cities omitted. */
  readonly groups = computed(() => {
    const photos = this.photosResource.value() ?? [];
    const cities = this.citiesResource.value() ?? [];
    return cities
      .map((city) => ({ city, photos: photos.filter((p) => p.cityId === city.id) }))
      .filter((g) => g.photos.length > 0);
  });

  constructor() {
    if (this.auth.role() === null) void this.auth.checkAuth();
  }

  reload(): void {
    this.refresh.update((n) => n + 1);
  }
}
