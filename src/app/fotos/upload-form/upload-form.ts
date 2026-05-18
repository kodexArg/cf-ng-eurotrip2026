import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { City } from '../../shared/models';
import { FileUpload, FileSelectEvent } from 'primeng/fileupload';
import { Panel } from 'primeng/panel';

/**
 * Owner-only media upload form for the trip gallery.
 *
 * @remarks
 * Renders only when the parent decides the user is the owner. Posts a
 * multipart/form-data body to POST /api/photos (gated by `_middleware.ts`).
 * Fields: place (city, required), photo/video file (required), caption
 * (optional, max 150 chars with a live counter). Emits `uploaded` on success
 * so the gallery can refresh.
 */
@Component({
  selector: 'app-upload-form',
  imports: [DatePicker, FormsModule, FileUpload, Panel],
  template: `
    <p-panel
      header="Subir foto o video"
      [toggleable]="true"
      [collapsed]="true"
      styleClass="mb-6"
    >
      <form
        class="flex flex-col gap-3"
        (submit)="submit($event)"
      >
        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-600">Lugar</label>
          <select
            class="border border-surface-300 rounded px-2 py-1 text-sm bg-white"
            [value]="cityId()"
            (change)="cityId.set($any($event.target).value)"
            required
          >
            <option value="" disabled>Elegí un lugar…</option>
            @for (c of cities(); track c.id) {
              <option [value]="c.id">{{ c.name }}</option>
            }
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-600">Archivo (imagen o video)</label>
          <p-fileupload
            mode="basic"
            [customUpload]="true"
            chooseLabel="Elegir archivo…"
            accept="image/*,video/*"
            [maxFileSize]="524288000"
            (onSelect)="onFileSelect($event)"
            styleClass="w-full"
          />
          @if (file()) {
            <span class="text-xs text-surface-500 mt-0.5">{{ file()!.name }}</span>
          }
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs text-surface-600">
            Epígrafe <span class="text-surface-400">({{ caption().length }}/150)</span>
          </label>
          <input
            type="text"
            maxlength="150"
            class="border border-surface-300 rounded px-2 py-1 text-sm"
            [value]="caption()"
            (input)="caption.set($any($event.target).value)"
            placeholder="Texto corto opcional"
          />
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <label class="text-xs text-surface-600">Fecha de la foto</label>
            <label class="flex items-center gap-1.5 text-xs text-surface-600 cursor-pointer select-none">
              <input
                type="checkbox"
                [checked]="noDate()"
                (change)="noDate.set($any($event.target).checked)"
              />
              Sin fecha (genérica)
            </label>
          </div>
          <p-datepicker
            [(ngModel)]="dateTaken"
            name="dateTaken"
            dateFormat="dd/mm/yy"
            [showIcon]="true"
            [readonlyInput]="true"
            appendTo="body"
            placeholder="Elegí una fecha…"
            [disabled]="noDate()"
            styleClass="w-full"
          />
        </div>

        @if (errorMsg()) {
          <p class="text-xs text-red-600 m-0">{{ errorMsg() }}</p>
        }

        <button
          type="submit"
          class="self-start bg-primary-600 text-white text-sm rounded px-4 py-1.5 disabled:opacity-50"
          [disabled]="busy() || !cityId() || !file()"
        >
          {{ busy() ? 'Subiendo…' : 'Subir' }}
        </button>
      </form>
    </p-panel>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadForm {
  private readonly http = inject(HttpClient);

  readonly cities = input.required<City[]>();
  readonly uploaded = output<void>();

  readonly cityId = signal('');
  readonly caption = signal('');
  readonly file = signal<File | null>(null);
  readonly dateTaken = signal<Date | null>(null);
  readonly noDate = signal(false);
  readonly busy = signal(false);
  readonly errorMsg = signal<string | null>(null);

  onFileSelect(ev: FileSelectEvent): void {
    this.file.set(ev.files?.[0] ?? null);
  }

  async submit(ev: Event): Promise<void> {
    ev.preventDefault();
    const f = this.file();
    if (!f || !this.cityId()) return;

    this.busy.set(true);
    this.errorMsg.set(null);
    const fd = new FormData();
    fd.append('file', f);
    fd.append('city_id', this.cityId());
    if (this.caption().trim()) fd.append('caption', this.caption().trim());
    const d = this.dateTaken();
    if (!this.noDate() && d) {
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      fd.append('date_taken', iso);
    }

    try {
      await firstValueFrom(this.http.post('/api/photos', fd));
      this.caption.set('');
      this.file.set(null);
      this.cityId.set('');
      this.dateTaken.set(null);
      this.noDate.set(false);
      this.uploaded.emit();
    } catch {
      this.errorMsg.set('No se pudo subir. Verificá que estés logueado como owner y que el archivo sea imagen o video.');
    } finally {
      this.busy.set(false);
    }
  }
}
