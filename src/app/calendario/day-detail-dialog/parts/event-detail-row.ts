import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  TripEvent,
  TrasladoEvent,
  EstadiaEvent,
  isTraslado,
  isEstadia,
  isHito,
  timeOf,
} from '../../../shared/models';
import { TrasladoDetail } from './traslado-detail';
import { EstadiaDetail } from './estadia-detail';

/**
 * Renders a single event row inside the day-detail dialog.
 *
 * Composes icon, title, type badge, optional time range, optional cost, and a
 * confirmation badge. When the event is a traslado, renders TrasladoDetail
 * inline. When it is an estadia, renders EstadiaDetail inline. Receives
 * precomputed color strings and an optional route string from the parent so
 * no city-lookup or business logic lives here.
 *
 * @remarks
 * Variants:
 * - hito: city color icon, "hito" badge, no sub-detail section
 * - traslado: slate icon (#475569), "traslado" badge, TrasladoDetail section,
 *   border rgba(71,85,105,0.25)
 * - estadia: violet icon (#7c3aed), "estadía" badge, EstadiaDetail section,
 *   border rgba(124,58,237,0.25)
 *
 * Inputs:
 * - `event` (required) — the TripEvent to render
 * - `iconColor` (required) — precomputed icon/badge color string (hex or var())
 * - `borderColor` (required) — precomputed border color string
 * - `bgColor` (required) — precomputed background color string
 * - `trasladoRoute` — precomputed "CityA → CityB" string; required when event is traslado
 */
@Component({
  selector: 'app-event-detail-row',
  standalone: true,
  imports: [TrasladoDetail, EstadiaDetail],
  template: `
    <div
      class="rounded-lg border p-3"
      [style.borderColor]="borderColor()"
      [style.backgroundColor]="bgColor()"
      [style.opacity]="event().done || event().confirmed || event().mandatory ? '1' : '0.7'"
    >
      <div class="flex items-start gap-2">
        <i
          [class]="'pi ' + (event().icon || 'pi-circle')"
          [style.color]="iconColor()"
          style="font-size: 14px; padding-top: 2px; width: 18px; text-align: center; flex-shrink: 0"
        ></i>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <div
                class="text-sm font-semibold leading-snug"
                style="color: var(--p-surface-800); word-wrap: break-word"
              >
                {{ event().title }}
              </div>
              <div
                class="text-xs mt-0.5 flex items-center gap-1.5 flex-wrap"
                style="color: var(--p-surface-500)"
              >
                <span
                  class="uppercase font-semibold tracking-wide"
                  style="font-size: 9px"
                  [style.color]="iconColor()"
                >
                  {{ typeLabel() }}
                </span>
                @if (timeRange(); as tr) {
                  <span style="color: var(--p-surface-300)">·</span>
                  <span style="font-variant-numeric: tabular-nums">
                    <i
                      class="pi pi-clock"
                      style="font-size: 9px; margin-right: 2px"
                    ></i>
                    {{ tr }}
                  </span>
                }
              </div>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
              @if (event().usd != null && event().usd! > 0) {
                <span
                  class="text-xs font-semibold flex items-center"
                  style="color: #16a34a"
                >
                  <i
                    class="pi pi-dollar"
                    style="font-size: 9px"
                  ></i>{{ event().usd }}
                </span>
              } @else if (event().usd === 0) {
                <span
                  class="font-medium uppercase tracking-wide"
                  style="font-size: 9px; color: var(--p-surface-400); letter-spacing: 0.05em"
                  title="Gratis"
                >gratis</span>
              }
              @if (event().done) {
                <i
                  class="pi pi-check-circle"
                  title="Hecho!"
                  style="font-size: 12px; color: #f59e0b"
                ></i>
              } @else if (event().confirmed) {
                <i
                  class="pi pi-check-circle"
                  title="Confirmado"
                  style="font-size: 12px; color: var(--p-surface-400)"
                ></i>
              } @else if (event().mandatory) {
                <i
                  class="pi pi-lock"
                  title="Obligado"
                  style="font-size: 12px; color: var(--p-surface-400)"
                ></i>
              } @else {
                <i
                  class="pi pi-circle"
                  title="Planeado"
                  style="font-size: 11px; color: #cbd5e1"
                ></i>
              }
            </div>
          </div>

          @if (event().description) {
            <div
              class="text-xs mt-1.5 leading-snug"
              style="color: var(--p-surface-600)"
            >
              {{ event().description }}
            </div>
          }

          @if (asTrasladoEvent(); as t) {
            <app-traslado-detail [traslado]="t" [route]="trasladoRoute()" />
          }

          @if (asEstadiaEvent(); as s) {
            <app-estadia-detail [estadia]="s" />
          }

          @if (event().notes) {
            <div
              class="text-xs mt-1.5 italic flex items-start gap-1"
              style="color: var(--p-surface-500)"
            >
              <i
                class="pi pi-info-circle"
                style="font-size: 10px; padding-top: 2px"
              ></i>
              <span>{{ event().notes }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailRow {
  readonly event = input.required<TripEvent>();
  readonly iconColor = input.required<string>();
  readonly borderColor = input.required<string>();
  readonly bgColor = input.required<string>();
  readonly trasladoRoute = input<string>('');

  protected typeLabel(): string {
    const e = this.event();
    if (isHito(e)) return 'hito';
    if (isTraslado(e)) return 'traslado';
    if (isEstadia(e)) return 'estadía';
    return '';
  }

  protected timeRange(): string | null {
    const e = this.event();
    const tin = e.timestampIn ? timeOf(e.timestampIn) : '';
    const tout = e.timestampOut ? timeOf(e.timestampOut) : '';
    if (tin && tout) return `${tin} – ${tout}`;
    if (tin) return tin;
    return null;
  }

  protected asTrasladoEvent(): TrasladoEvent | null {
    const e = this.event();
    return isTraslado(e) ? e : null;
  }

  protected asEstadiaEvent(): EstadiaEvent | null {
    const e = this.event();
    return isEstadia(e) ? e : null;
  }
}
