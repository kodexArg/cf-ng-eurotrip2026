import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Photo } from '../../shared/models';
import { environment } from '../../../environments/environment';

/**
 * Full-screen lightbox overlay that displays one photo at a time.
 *
 * @remarks
 * Visibility and the active index are controlled by the parent via inputs.
 * Clicking anywhere on the backdrop emits `close`.
 * The photo URL is constructed from the R2 base URL and the photo's r2Key.
 */
@Component({
  selector: 'app-lightbox-overlay',
  imports: [],
  template: `
    @if (visible()) {
      <div
        class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        (click)="close.emit()"
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
export class LightboxOverlay {
  readonly photos = input.required<Photo[]>();
  readonly activeIndex = input.required<number>();
  readonly visible = input.required<boolean>();

  readonly close = output<void>();

  readonly currentPhoto = computed(() => this.photos()[this.activeIndex()]);
  readonly currentPhotoUrl = computed(() => environment.r2BaseUrl + '/' + this.currentPhoto().r2Key);
}
