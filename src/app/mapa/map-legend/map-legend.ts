import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-map-legend',
  imports: [Card],
  template: `
    <p-card styleClass="text-xs shadow-lg">
      <div class="flex flex-col gap-1.5 select-none">
        <div class="flex items-center gap-2">
          <span class="w-6 h-0.5 inline-block" style="background: #22c55e; border-top: 2px dashed #22c55e"></span>
          <span>Tren</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-6 h-0.5 inline-block" style="border-top: 2px dashed #8b5cf6"></span>
          <span>Excursión</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-6 h-0.5 inline-block" style="border-top: 2px solid #3b82f6"></span>
          <span>Vuelo</span>
        </div>
        <div class="flex items-center gap-2">
          <svg width="24" height="4" style="flex-shrink:0"><line x1="0" y1="2" x2="24" y2="2" stroke="#f97316" stroke-width="2.5" stroke-dasharray="1,5" stroke-linecap="round"/></svg>
          <span>Bus / Coach</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-6 h-0.5 inline-block" style="border-top: 2px dashed #6b7280; opacity: 0.5"></span>
          <span>Planeado / no confirmado</span>
        </div>
      </div>
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapLegend {}
