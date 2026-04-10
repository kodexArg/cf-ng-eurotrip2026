import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CityChip } from '../../shared/city-chip/city-chip';
import { Photo } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-photo-item',
  imports: [CityChip],
  template: `
    <div
      class="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-surface-100"
      (click)="select.emit()"
    >
      <img
        [src]="photoUrl()"
        [alt]="photo().caption ?? ''"
        loading="lazy"
        class="w-full h-48 object-cover"
      />
      <div class="p-2 flex flex-col gap-1">
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
  readonly photoUrl = computed(() => environment.r2BaseUrl + '/' + this.photo().r2Key);
}
