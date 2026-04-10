import { ChangeDetectionStrategy, Component } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { PhotoGrid } from './photo-grid/photo-grid';
import { Photo } from '../shared/models';

@Component({
  selector: 'app-fotos',
  imports: [PhotoGrid, Message, Skeleton],
  template: `
    <div class="max-w-5xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-surface-800">Fotos del viaje</h1>
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
        <app-photo-grid [photos]="photosResource.value()!" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FotosPage {
  readonly photosResource = httpResource<Photo[]>(() => '/api/photos');
}
