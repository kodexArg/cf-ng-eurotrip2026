import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleButton } from 'primeng/togglebutton';
import { ItineraryFilterService } from '../itinerary-filter.service';

@Component({
  selector: 'app-itinerary-filters',
  standalone: true,
  imports: [FormsModule, ToggleButton],
  templateUrl: './itinerary-filters.html',
  styleUrl: './itinerary-filters.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItineraryFilters {
  protected readonly filters = inject(ItineraryFilterService);

  get showHitos(): boolean {
    return this.filters.showHitos();
  }
  set showHitos(v: boolean) {
    if (v !== this.filters.showHitos()) this.filters.toggle('hito');
  }

  get showTraslados(): boolean {
    return this.filters.showTraslados();
  }
  set showTraslados(v: boolean) {
    if (v !== this.filters.showTraslados()) this.filters.toggle('traslado');
  }

  get showHospedajes(): boolean {
    return this.filters.showHospedajes();
  }
  set showHospedajes(v: boolean) {
    if (v !== this.filters.showHospedajes()) this.filters.toggle('estadia');
  }
}
