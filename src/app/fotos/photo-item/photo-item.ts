import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CityChip } from '../../shared/city-chip/city-chip';
import { Photo } from '../../shared/models';
import { environment } from '../../../environments/environment';

/**
 * Single media thumbnail card (photo or video) with caption, city badge, and date.
 *
 * @remarks
 * Emits `select` when the card is clicked so the parent can open the lightbox.
 * The media URL is resolved from `environment.r2BaseUrl` + `photo.r2Key`.
 * Videos render a muted, metadata-only preview with a play badge overlay.
 */
@Component({
  selector: 'app-photo-item',
  imports: [CityChip],
  template: `
    <div
      class="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-surface-100"
      (click)="select.emit()"
    >
      <div class="relative">
        @if (photo().mediaType === 'video') {
          <video
            [src]="mediaUrl()"
            class="w-full h-48 object-cover"
            muted
            playsinline
            preload="metadata"
          ></video>
          <span class="absolute inset-0 flex items-center justify-center text-white/90 pointer-events-none">
            <i class="pi pi-play-circle text-5xl drop-shadow-lg"></i>
          </span>
        } @else {
          <img
            [src]="mediaUrl()"
            [alt]="photo().caption ?? ''"
            loading="lazy"
            class="w-full h-48 object-cover"
          />
        }
      </div>
      <div class="p-2 flex flex-col gap-1 select-none">
        @if (photo().caption) {
          <p class="text-xs text-surface-700 m-0">{{ photo().caption }}</p>
        }
        <div class="flex items-center gap-2">
          <app-city-chip [slug]="photo().cityId" />
          @if (photo().dateTaken) {
            <span class="text-xs text-surface-400">{{ photo().dateTaken }}</span>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoItem {
  readonly photo = input.required<Photo>();
  readonly select = output<void>();
  readonly mediaUrl = computed(() => environment.r2BaseUrl + '/' + this.photo().r2Key);
}
