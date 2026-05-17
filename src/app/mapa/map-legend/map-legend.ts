import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from 'primeng/card';

/**
 * Map legend card listing transport line styles with updated categorization.
 * 
 * UPDATED LINE TYPE REPRESENTATION (V2):
 * -------------------------------------
 * 
 * 1. FLIGHTS: Blue geodesic curves
 *    - Represent actual flight paths using great-circle calculations
 *    - Visible curvature distinguishes them from straight-line transports
 *    - Styled with 1.8px weight, 0.75 opacity for subtle prominence
 * 
 * 2. TRAINS: Green solid lines
 *    - Used for inter-zone and inter-province railway connections
 *    - Solid 2.5px lines with 0.85 opacity for clear visibility
 *    - Examples: Eurostar, AVE, TGV inter-city routes
 * 
 * 3. BUSES / COACH: Orange solid lines
 *    - Applied to long-distance bus routes and coach tours
 *    - Same visual weight as trains but differentiated by color
 *    - Examples: Cross-country bus lines, tour buses like Stonehenge Express
 * 
 * 4. INTERNAL TRANSPORT: Orange dashed lines
 *    - Designates intra-city transportation within urban areas
 *    - Includes metro/subway, local buses, taxis, ride-sharing (Uber)
 *    - Distinguished by dashed patterns:
 *      * Metro: 6,4 dash pattern at 2.0px weight
 *      * Taxi/Uber: 1,5 dash pattern with round line caps
 *    - Helps users distinguish local transit from long-haul journeys
 * 
 * 5. PENDING/UNCONFIRMED ITEMS:
 *    - Dashed variants (4,8 pattern) at 40% opacity
 *    - Applied uniformly across all transport types when confirmed=false
 *    - Provides visual distinction between firm plans and tentative arrangements
 * 
 * LEGEND DESIGN NOTES:
 * -------------------
 * - All samples use consistent sizing (24x4px) for easy visual comparison
 * - Colors match the actual route rendering implementations
 * - Curved flight path represented by SVG quadratic Bézier curve
 * - Pending items use muted styling to avoid visual competition with confirmed routes
 * - Text labels kept concise for readability at small sizes
 */
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
