import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Fixes vertical page scroll being "captured" by a PrimeNG `p-carousel`.
 *
 * @remarks
 * PrimeNG's carousel binds `(touchmove)` on its viewport and calls
 * `event.preventDefault()` on EVERY cancelable touchmove, with no axis
 * detection (see primeng-carousel `onTouchMove`). On touch devices this makes
 * a vertical scroll gesture that begins over a carousel cling to the photos:
 * the page won't scroll past them.
 *
 * This directive attaches CAPTURE-phase touch listeners on the carousel host.
 * When a gesture is vertically dominant it calls `stopPropagation()` in the
 * capture phase, so the carousel's bubbling `onTouchMove` never runs and never
 * blocks the native scroll. Horizontal swipes still reach the carousel, so
 * lateral navigation keeps working.
 *
 * Apply via attribute on the `p-carousel` element: `appCarouselScrollFix`.
 */
@Directive({
  selector: '[appCarouselScrollFix]',
})
export class CarouselScrollFix implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);

  private startX = 0;
  private startY = 0;
  /** Locked axis for the current gesture: undefined until decided. */
  private axis: 'x' | 'y' | undefined;

  private readonly onTouchStart = (e: TouchEvent): void => {
    if (e.touches.length !== 1) {
      // Multi-touch (pinch) — never our concern; let the carousel ignore it.
      this.axis = 'x';
      return;
    }
    const t = e.touches[0];
    this.startX = t.clientX;
    this.startY = t.clientY;
    this.axis = undefined;
  };

  private readonly onTouchMove = (e: TouchEvent): void => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - this.startX);
    const dy = Math.abs(t.clientY - this.startY);

    // Decide the dominant axis once, after a small movement threshold.
    if (this.axis === undefined) {
      if (dx < 6 && dy < 6) return;
      this.axis = dy > dx ? 'y' : 'x';
    }

    if (this.axis === 'y') {
      // Vertical-dominant: keep the event away from the carousel's
      // bubbling touchmove (which would preventDefault and block scroll).
      e.stopPropagation();
    }
  };

  ngOnInit(): void {
    const el = this.host.nativeElement;
    // Capture phase + passive: runs before the carousel's bubbling listener,
    // never itself calls preventDefault, so native scrolling stays smooth.
    el.addEventListener('touchstart', this.onTouchStart, { capture: true, passive: true });
    el.addEventListener('touchmove', this.onTouchMove, { capture: true, passive: true });
  }

  ngOnDestroy(): void {
    const el = this.host.nativeElement;
    el.removeEventListener('touchstart', this.onTouchStart, { capture: true });
    el.removeEventListener('touchmove', this.onTouchMove, { capture: true });
  }
}
