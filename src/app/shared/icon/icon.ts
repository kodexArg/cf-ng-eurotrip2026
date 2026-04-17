import { ChangeDetectionStrategy, Component, computed, input, isDevMode } from '@angular/core';
import { TRANSPORT_ICON_DEFAULT } from '../transport-icon';

/**
 * Unified icon renderer supporting Material Symbols Outlined (`ms-`) and
 * PrimeIcons (`pi-`) prefixes.
 *
 * Usage:
 *   <app-icon icon="ms-flight_takeoff" />
 *   <app-icon icon="pi-heart" color="red" size="1.25rem" />
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    @if (isMaterial()) {
      <span
        [class]="materialClass()"
        [style.font-size]="size()"
        [style.color]="color()"
        style="line-height: 1"
      >{{ materialName() }}</span>
    } @else if (isPrime()) {
      <i
        [class]="primeClass()"
        [style.font-size]="size()"
        [style.color]="color()"
      ></i>
    } @else {
      <span
        class="material-symbols-outlined shrink-0"
        [style.font-size]="size()"
        [style.color]="color()"
        style="line-height: 1"
      >{{ fallbackName() }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIcon {
  readonly icon = input.required<string>();
  readonly color = input<string | undefined>(undefined);
  readonly size = input<string>('1rem');
  readonly extraClass = input<string | undefined>(undefined);

  protected readonly isMaterial = computed(() => this.icon().startsWith('ms-'));
  protected readonly isPrime = computed(() => this.icon().startsWith('pi-'));
  protected readonly materialName = computed(() => this.icon().slice(3));

  protected readonly materialClass = computed(() => {
    const base = 'material-symbols-outlined shrink-0';
    const extra = this.extraClass();
    return extra ? `${base} ${extra}` : base;
  });

  protected readonly primeClass = computed(() => {
    const base = `pi ${this.icon()} shrink-0`;
    const extra = this.extraClass();
    return extra ? `${base} ${extra}` : base;
  });

  protected readonly fallbackName = computed((): string => {
    if (isDevMode()) {
      console.warn(`[app-icon] Unrecognized icon prefix: "${this.icon()}". Falling back to default.`);
    }
    return TRANSPORT_ICON_DEFAULT.slice(3); // strip 'ms-' prefix
  });
}
