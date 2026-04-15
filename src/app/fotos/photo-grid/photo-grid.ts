import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { PhotoItem } from '../photo-item/photo-item';
import { LightboxOverlay } from '../lightbox-overlay/lightbox-overlay';
import { Photo } from '../../shared/models';

/**
 * Responsive grid of photo thumbnails with integrated lightbox.
 *
 * @remarks
 * Renders PhotoItem tiles in a 2-column (mobile) / 3-column (desktop) grid.
 * Selecting a tile opens LightboxOverlay at the corresponding index.
 */
@Component({
  selector: 'app-photo-grid',
  imports: [PhotoItem, LightboxOverlay],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      @for (photo of photos(); track photo.id; let i = $index) {
        <app-photo-item [photo]="photo" (select)="openLightbox(i)" />
      }
    </div>
    <app-lightbox-overlay [photos]="photos()" [activeIndex]="activeIndex()" [visible]="lightboxVisible()" (close)="lightboxVisible.set(false)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGrid {
  readonly photos = input.required<Photo[]>();

  readonly lightboxVisible = signal(false);
  readonly activeIndex = signal(0);

  openLightbox(index: number): void {
    this.activeIndex.set(index);
    this.lightboxVisible.set(true);
  }
}
