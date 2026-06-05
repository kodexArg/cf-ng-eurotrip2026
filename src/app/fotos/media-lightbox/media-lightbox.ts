import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

/**
 * Full-screen media viewer with real mobile zoom and swipe navigation.
 *
 * @remarks
 * PrimeNG's `p-image` preview only offers tiny toolbar zoom buttons (scale
 * capped at 1.5×) with no pinch, double-tap or panning — unusable on touch.
 * This overlay reproduces PrimeNG's dark-mask visual chrome (same `pi` action
 * buttons, dark backdrop) but implements gesture zoom via Pointer Events and a
 * single CSS transform (`translate → scale → rotate`):
 *
 * - Pinch (two pointers) to zoom, anchored at the gesture midpoint.
 * - Double-tap to toggle between fit (1×) and 2.5×, anchored at the tap point.
 * - Swipe left/right when fit (1x scale) to navigate between images.
 * - One-finger pan while zoomed in.
 * - Rotate left/right buttons (90° steps) with automatic scale correction to fit the screen.
 * - Floating action button on mobile for easy one-hand rotation.
 * - Desktop arrow buttons and keyboard navigation (Left/Right) for prev/next.
 * - Tap the backdrop (when not zoomed) or the close button to dismiss.
 *
 * Videos render with native controls and no transform (zoom is photo-only).
 */
@Component({
  selector: 'app-media-lightbox',
  imports: [],
  template: `
    @if (visible()) {
      <div
        class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center overflow-hidden select-none"
        style="touch-action: none"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerUp($event)"
      >
        <!-- Toolbar: mirrors PrimeNG p-image preview actions -->
        <div
          class="absolute top-0 right-0 z-10 flex items-center gap-1 p-3 text-white"
          (pointerdown)="$event.stopPropagation()"
        >
          @if (!isVideo()) {
            <button
              type="button"
              class="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
              aria-label="Girar a la izquierda"
              (click)="rotateLeft()"
            >
              <i class="pi pi-replay text-lg"></i>
            </button>
            <button
              type="button"
              class="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
              aria-label="Girar a la derecha"
              (click)="rotateRight()"
            >
              <i class="pi pi-refresh text-lg"></i>
            </button>
            <button
              type="button"
              class="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors disabled:opacity-40"
              aria-label="Alejar"
              [disabled]="scale() <= MIN_SCALE"
              (click)="zoomBy(-0.5)"
            >
              <i class="pi pi-search-minus text-lg"></i>
            </button>
            <button
              type="button"
              class="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors disabled:opacity-40"
              aria-label="Acercar"
              [disabled]="scale() >= MAX_SCALE"
              (click)="zoomBy(0.5)"
            >
              <i class="pi pi-search-plus text-lg"></i>
            </button>
          }
          <button
            type="button"
            class="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
            aria-label="Cerrar"
            (click)="closed.emit()"
          >
            <i class="pi pi-times text-lg"></i>
          </button>
        </div>

        <!-- Left Arrow (Desktop Only) -->
        <button
          type="button"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 active:bg-black/80 text-white transition-colors border border-white/10 hidden md:flex"
          aria-label="Anterior"
          (pointerdown)="$event.stopPropagation()"
          (click)="prev.emit(); $event.stopPropagation()"
        >
          <i class="pi pi-chevron-left text-xl"></i>
        </button>

        <!-- Right Arrow (Desktop Only) -->
        <button
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 active:bg-black/80 text-white transition-colors border border-white/10 hidden md:flex"
          aria-label="Siguiente"
          (pointerdown)="$event.stopPropagation()"
          (click)="next.emit(); $event.stopPropagation()"
        >
          <i class="pi pi-chevron-right text-xl"></i>
        </button>

        @if (isVideo()) {
          <video
            [src]="src()"
            class="max-h-[90vh] max-w-[95vw] object-contain"
            controls
            autoplay
            playsinline
            (pointerdown)="$event.stopPropagation()"
          ></video>
        } @else {
          <img
            #img
            [src]="src()"
            [alt]="alt()"
            class="max-h-[90vh] max-w-[95vw] object-contain will-change-transform"
            [style.transform]="transform()"
            [style.cursor]="scale() > 1 ? 'grab' : 'default'"
            draggable="false"
            (load)="onImageLoad()"
          />

          <!-- Mobile-friendly floating rotate button (lower right for easy thumb access) -->
          <button
            type="button"
            class="absolute bottom-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 active:bg-black/90 text-white transition-colors border border-white/20 shadow-lg md:hidden"
            aria-label="Rotar imagen"
            (pointerdown)="$event.stopPropagation()"
            (click)="rotateRight(); $event.stopPropagation()"
          >
            <i class="pi pi-refresh text-lg"></i>
          </button>
        }

        @if (caption()) {
          <div
            class="absolute bottom-4 left-0 right-0 text-center text-white px-4 text-sm pointer-events-none"
          >
            {{ caption() }}
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaLightbox {
  readonly visible = input.required<boolean>();
  readonly src = input.required<string>();
  readonly isVideo = input(false);
  readonly caption = input<string | null>(null);
  readonly alt = input('');

  readonly closed = output<void>();
  readonly prev = output<void>();
  readonly next = output<void>();

  protected readonly MIN_SCALE = 1;
  protected readonly MAX_SCALE = 6;
  private readonly DOUBLE_TAP_SCALE = 2.5;

  protected readonly scale = signal(1);
  protected readonly rotate = signal(0);
  protected readonly tx = signal(0);
  protected readonly ty = signal(0);
  protected readonly rotationScaleCorrection = signal(1);

  protected readonly transform = computed(
    () =>
      `translate(${this.tx()}px, ${this.ty()}px) scale(${this.scale() * this.rotationScaleCorrection()}) rotate(${this.rotate()}deg)`,
  );

  private readonly imgRef = viewChild<ElementRef<HTMLImageElement>>('img');

  /** Active pointers for pinch/pan tracking. */
  private readonly pointers = new Map<number, { x: number; y: number }>();
  /** Pinch baseline. */
  private pinchStartDist = 0;
  private pinchStartScale = 1;
  /** Pan baseline. */
  private panStartX = 0;
  private panStartY = 0;
  private panStartTx = 0;
  private panStartTy = 0;
  /** Swipe baseline. */
  private swipeStartX = 0;
  private swipeStartY = 0;
  private isSwipeCandidate = false;
  /** Double-tap detection. */
  private lastTapTime = 0;
  private lastTapX = 0;
  private lastTapY = 0;

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.visible()) this.closed.emit();
  }

  @HostListener('document:keydown.arrowleft')
  protected onArrowLeft(): void {
    if (this.visible()) this.prev.emit();
  }

  @HostListener('document:keydown.arrowright')
  protected onArrowRight(): void {
    if (this.visible()) this.next.emit();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.updateRotationScale();
  }

  constructor() {
    // Reset transform every time the viewer opens or the media changes.
    effect(() => {
      this.visible();
      this.src();
      this.resetTransform();
    });

    effect(() => {
      // Recompute scale correction whenever rotation state changes.
      this.rotate();
      this.updateRotationScale();
    });
  }

  private resetTransform(): void {
    this.scale.set(1);
    this.rotate.set(0);
    this.tx.set(0);
    this.ty.set(0);
    this.rotationScaleCorrection.set(1);
    this.pointers.clear();
    this.isSwipeCandidate = false;
  }

  protected onImageLoad(): void {
    this.updateRotationScale();
  }

  private updateRotationScale(): void {
    const img = this.imgRef()?.nativeElement;
    if (!img) {
      this.rotationScaleCorrection.set(1);
      return;
    }
    const isRotated90 = (this.rotate() / 90) % 2 !== 0;
    if (!isRotated90) {
      this.rotationScaleCorrection.set(1);
      return;
    }

    const W = window.innerWidth * 0.95;
    const H = window.innerHeight * 0.90;
    const imgW = img.clientWidth;
    const imgH = img.clientHeight;

    if (imgW > 0 && imgH > 0) {
      const scaleW = W / imgH;
      const scaleH = H / imgW;
      const correction = Math.min(scaleW, scaleH);
      this.rotationScaleCorrection.set(correction);
    } else {
      this.rotationScaleCorrection.set(1);
    }
  }

  // ── Toolbar controls ────────────────────────────────────────────────────
  protected rotateLeft(): void {
    this.rotate.update((r) => r - 90);
  }
  protected rotateRight(): void {
    this.rotate.update((r) => r + 90);
  }
  protected zoomBy(delta: number): void {
    const next = this.clampScale(this.scale() + delta);
    this.scale.set(next);
    if (next === 1) {
      this.tx.set(0);
      this.ty.set(0);
    }
  }

  // ── Gesture handling ────────────────────────────────────────────────────
  protected onPointerDown(event: PointerEvent): void {
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.pointers.size === 2) {
      this.isSwipeCandidate = false;
      const [a, b] = [...this.pointers.values()];
      this.pinchStartDist = this.distance(a, b);
      this.pinchStartScale = this.scale();
      return;
    }

    if (this.pointers.size === 1) {
      const isImg = (event.target as HTMLElement).tagName === 'IMG';

      if (isImg) {
        const now = Date.now();
        const dt = now - this.lastTapTime;
        const near =
          Math.abs(event.clientX - this.lastTapX) < 30 &&
          Math.abs(event.clientY - this.lastTapY) < 30;
        if (dt < 300 && near) {
          this.isSwipeCandidate = false;
          this.handleDoubleTap(event);
          this.lastTapTime = 0;
          return;
        }
        this.lastTapTime = now;
        this.lastTapX = event.clientX;
        this.lastTapY = event.clientY;
      }

      this.panStartX = event.clientX;
      this.panStartY = event.clientY;
      this.panStartTx = this.tx();
      this.panStartTy = this.ty();

      if (this.scale() <= 1) {
        this.swipeStartX = event.clientX;
        this.swipeStartY = event.clientY;
        this.isSwipeCandidate = true;
      }
    }
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      const dist = this.distance(a, b);
      if (this.pinchStartDist > 0) {
        const next = this.clampScale((dist / this.pinchStartDist) * this.pinchStartScale);
        this.scale.set(next);
        if (next === 1) {
          this.tx.set(0);
          this.ty.set(0);
        }
      }
      return;
    }

    if (this.pointers.size === 1 && this.scale() > 1) {
      this.tx.set(this.panStartTx + (event.clientX - this.panStartX));
      this.ty.set(this.panStartTy + (event.clientY - this.panStartY));
    }
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.pointers.has(event.pointerId)) return;

    if (this.isSwipeCandidate && this.scale() <= 1) {
      const dx = event.clientX - this.swipeStartX;
      const dy = event.clientY - this.swipeStartY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        this.isSwipeCandidate = false;
        this.pointers.delete(event.pointerId);
        if (dx > 0) {
          this.prev.emit();
        } else {
          this.next.emit();
        }
        return;
      }
    }

    const isBackdrop = (event.target as HTMLElement).tagName !== 'IMG' &&
                       !(event.target as HTMLElement).closest('button');
    if (this.isSwipeCandidate && this.scale() <= 1 && isBackdrop) {
      const dx = event.clientX - this.swipeStartX;
      const dy = event.clientY - this.swipeStartY;
      if (Math.hypot(dx, dy) < 10) {
        this.closed.emit();
      }
    }

    this.pointers.delete(event.pointerId);
    this.isSwipeCandidate = false;

    if (this.pointers.size === 1) {
      const [p] = [...this.pointers.values()];
      this.panStartX = p.x;
      this.panStartY = p.y;
      this.panStartTx = this.tx();
      this.panStartTy = this.ty();
    }
  }

  private handleDoubleTap(event: PointerEvent): void {
    if (this.scale() > 1) {
      this.resetTransform();
      return;
    }
    const el = this.imgRef()?.nativeElement;
    if (!el) {
      this.scale.set(this.DOUBLE_TAP_SCALE);
      return;
    }
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const offsetX = event.clientX - cx;
    const offsetY = event.clientY - cy;
    const s = this.DOUBLE_TAP_SCALE;
    this.scale.set(s);
    this.tx.set(-offsetX * (s - 1));
    this.ty.set(-offsetY * (s - 1));
  }

  private clampScale(s: number): number {
    return Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, s));
  }

  private distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
}
