import { ChangeDetectionStrategy, Component, computed, input, isDevMode } from '@angular/core';

/**
 * Unified icon renderer supporting Material Symbols Outlined (`ms-`) and
 * PrimeIcons (`pi-`) prefixes.
 *
 * Usage:
 *   <app-icon icon="ms-flight_takeoff" />
 *   <app-icon icon="pi-heart" color="red" size="1.25rem" />
 *
 * Unknown prefixes render a globe + "?" overlay (mundito-?) as the fallback,
 * and emit a console.warn in dev mode.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  styles: [`
    .app-icon-unknown {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    .app-icon-unknown::after {
      content: '?';
      position: absolute;
      bottom: -0.15em;
      right: -0.25em;
      font-size: 0.5em;
      font-weight: 700;
      font-family: sans-serif;
      color: #f59e0b;
      line-height: 1;
      pointer-events: none;
    }
  `],
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
        class="app-icon-unknown material-symbols-outlined shrink-0"
        [style.font-size]="size()"
        [style.color]="unknownColor()"
        style="line-height: 1"
      >public</span>
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

  /** Color for the unknown/fallback globe: caller color if provided, else surface-500. */
  protected readonly unknownColor = computed((): string => {
    if (isDevMode()) {
      console.warn(`[app-icon] Unrecognized icon prefix: "${this.icon()}". Rendering mundito-? fallback.`);
    }
    return this.color() ?? 'var(--p-surface-500)';
  });
}
