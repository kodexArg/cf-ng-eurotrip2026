import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { PhotoItem } from '../photo-item/photo-item';
import { Photo } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-photo-grid',
  imports: [PhotoItem],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      @for (photo of photos(); track photo.id; let i = $index) {
        <app-photo-item [photo]="photo" (select)="openLightbox(i)" />
      }
    </div>
    @if (lightboxVisible()) {
      <div
        class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        (click)="lightboxVisible.set(false)"
      >
        <img
          [src]="currentPhotoUrl()"
          [alt]="currentPhoto().caption ?? ''"
          class="max-h-[90vh] max-w-[90vw] object-contain"
        />
        @if (currentPhoto().caption) {
          <div class="absolute bottom-4 left-0 right-0 text-center text-white p-2">
            {{ currentPhoto().caption }}
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGrid {
  readonly photos = input.required<Photo[]>();

  readonly lightboxVisible = signal(false);
  readonly activeIndex = signal(0);

  readonly currentPhoto = computed(() => this.photos()[this.activeIndex()]);
  readonly currentPhotoUrl = computed(() => environment.r2BaseUrl + '/' + this.currentPhoto().r2Key);

  openLightbox(index: number): void {
    this.activeIndex.set(index);
    this.lightboxVisible.set(true);
  }
}
