import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';

/** Map legend card listing transport line styles. */
@Component({
  selector: 'app-map-legend',
  imports: [Card],
  template: `
    <p-card styleClass="text-xs shadow-lg">
      <div class="flex flex-col gap-1.5 select-none">
        <div class="flex items-center gap-2">
          <svg width="24" height="4" style="flex-shrink:0"><path d="M0,2 Q6,0 12,2 T24,2" fill="none" stroke="#3b82f6" stroke-width="1.8" stroke-opacity="0.75"/></svg>
          <span>Vuelo</span>
        </div>
        <div class="flex items-center gap-2">
          <svg width="24" height="4" style="flex-shrink:0"><line x1="0" y1="2" x2="24" y2="2" stroke="#16a34a" stroke-width="2.5" stroke-opacity="0.85"/></svg>
          <span>Tren</span>
        </div>
        <div class="flex items-center gap-2">
          <svg width="24" height="4" style="flex-shrink:0"><line x1="0" y1="2" x2="24" y2="2" stroke="#f97316" stroke-width="2.5" stroke-opacity="0.85"/></svg>
          <span>Bus / Coach</span>
        </div>
        <div class="flex items-center gap-2">
          <svg width="24" height="4" style="flex-shrink:0"><line x1="0" y1="2" x2="24" y2="2" stroke="#f97316" stroke-width="2.0" stroke-dasharray="6,4" stroke-opacity="0.80"/></svg>
          <span>Transporte Interno</span>
        </div>
        <div class="flex items-center gap-2 pt-1 mt-1 border-t border-gray-200">
          <svg width="24" height="4" style="flex-shrink:0"><line x1="0" y1="2" x2="24" y2="2" stroke="#16a34a" stroke-width="2.5" stroke-dasharray="4,8" stroke-opacity="0.40"/></svg>
          <span class="opacity-70">Planeado / no confirmado</span>
        </div>
      </div>
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapLegend {}
