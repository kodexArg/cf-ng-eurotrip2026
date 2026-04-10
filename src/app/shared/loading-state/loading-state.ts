import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [Skeleton],
  template: `
    <div class="flex flex-col gap-2">
      @for (i of [1, 2, 3, 4, 5]; track i) {
        <p-skeleton height="4rem" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingState {}
