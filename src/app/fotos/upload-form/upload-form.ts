import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
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
 * Renders only when the parent decides the user is an editor. Multi-file by
 * default: the user keeps adding photos/videos (the selection accumulates
 * across picks) and then presses "Enviar". Each file is POSTed to
 * /api/photos (multipart, gated by `_middleware.ts`). The shared place +
 * date/no-date apply to every file; the caption applies ONLY to the first
 * file of the batch.
 */
@Component({
  selector: 'app-upload-form',
  imports: [DatePicker, FormsModule, FileUpload, Panel],
  template: `
    <p-panel
      header="Subir fotos o videos"
      [toggleable]="true"
      [collapsed]="true"
      styleClass="mb-6 rounded-lg border border-surface-200"
    >
      <form
        class="flex flex-col gap-4 px-1 pt-1 pb-2"
        (submit)="submit($event)"
      >
        <!-- Lugar -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-semibold uppercase tracking-wide"
            style="color: var(--p-surface-500)"
          >Lugar</label>
          <select
            class="w-full border border-surface-300 rounded-lg px-3 py-2.5 text-sm bg-surface-0 focus:outline-none focus:ring-2 focus:ring-primary-300"
            style="color: var(--p-surface-800); min-height: 44px"
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

        <!-- Archivos (multi, foto o video) -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-semibold uppercase tracking-wide"
            style="color: var(--p-surface-500)"
          >Archivos (fotos o videos)</label>
          <p-fileupload
            mode="basic"
            [customUpload]="true"
            [multiple]="true"
            chooseLabel="Agregar archivos…"
            accept="image/*,video/*"
            [maxFileSize]="524288000"
            (onSelect)="onFileSelect($event)"
            styleClass="w-full"
          />
          @if (files().length) {
            <ul class="flex flex-col gap-1 mt-1 m-0 p-0 list-none">
              @for (f of files(); track f.key; let i = $index) {
                <li
                  class="flex items-center gap-2 text-xs rounded-md px-2 py-1.5"
                  style="background: var(--p-surface-50); color: var(--p-surface-600)"
                >
                  <i
                    class="pi"
                    [class.pi-image]="f.kind === 'photo'"
                    [class.pi-video]="f.kind === 'video'"
                    style="font-size: 0.7rem"
                  ></i>
                  <span class="flex-1 truncate">{{ f.file.name }}</span>
                  @if (i === 0) {
                    <span
                      class="uppercase tracking-wide font-semibold"
                      style="font-size: 9px; color: var(--p-primary-color)"
                    >epígrafe</span>
                  }
                  <button
                    type="button"
                    class="shrink-0 leading-none"
                    style="background: none; border: none; color: var(--p-surface-400); cursor: pointer; font-size: 0.85rem"
                    (click)="removeAt(i)"
                    aria-label="Quitar"
                  >✕</button>
                </li>
              }
            </ul>
            <span class="text-xs mt-0.5" style="color: var(--p-surface-500)">
              {{ files().length }} archivo(s) · el epígrafe se aplica solo al primero
            </span>
          }
        </div>

        <!-- Epígrafe (solo a la primera) -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-semibold uppercase tracking-wide"
            style="color: var(--p-surface-500)"
          >
            Epígrafe
            <span style="color: var(--p-surface-400); font-weight: 400; text-transform: none; letter-spacing: 0">
              ({{ caption().length }}/150 · solo 1ª)
            </span>
          </label>
          <input
            type="text"
            maxlength="150"
            class="w-full border border-surface-300 rounded-lg px-3 py-2.5 text-sm bg-surface-0 focus:outline-none focus:ring-2 focus:ring-primary-300"
            style="color: var(--p-surface-800); min-height: 44px"
            [value]="caption()"
            (input)="caption.set($any($event.target).value)"
            placeholder="Texto corto opcional (primera foto/video)"
          />
        </div>

        <!-- Fecha (compartida por todo el lote) -->
        <div class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <label
              class="text-xs font-semibold uppercase tracking-wide"
              style="color: var(--p-surface-500)"
            >Fecha (todo el lote)</label>
            <label
              class="flex items-center gap-1.5 text-xs cursor-pointer select-none"
              style="color: var(--p-surface-600)"
            >
              <input
                type="checkbox"
                class="w-4 h-4"
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
          <p
            class="text-xs m-0 rounded-lg px-3 py-2"
            style="color: #dc2626; background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.2)"
          >{{ errorMsg() }}</p>
        }

        <div class="flex justify-end pt-1">
          <button
            type="submit"
            class="text-sm font-semibold rounded-lg px-5 py-2.5 disabled:opacity-50 transition-opacity"
            style="background: var(--p-primary-color, #2563eb); color: #fff; min-height: 44px; min-width: 96px; border: none; cursor: pointer"
            [disabled]="busy() || !cityId() || !files().length"
          >
            {{ busy() ? progressLabel() : 'Enviar (' + files().length + ')' }}
          </button>
        </div>
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
  /** Accumulated batch; first item gets the caption. */
  readonly files = signal<{ key: string; file: File; kind: 'photo' | 'video' }[]>([]);
  readonly dateTaken = signal<Date | null>(null);
  readonly noDate = signal(false);
  readonly busy = signal(false);
  readonly errorMsg = signal<string | null>(null);
  private readonly done = signal(0);

  readonly progressLabel = computed(
    () => `Subiendo ${this.done()}/${this.files().length}…`
  );

  /** Accumulate picks (multi-select across repeated picks); dedupe by name+size+mtime. */
  onFileSelect(ev: FileSelectEvent): void {
    const picked = ev.files ?? [];
    const next = [...this.files()];
    for (const file of picked) {
      const key = `${file.name}:${file.size}:${file.lastModified}`;
      if (next.some((e) => e.key === key)) continue;
      next.push({ key, file, kind: file.type.startsWith('video/') ? 'video' : 'photo' });
    }
    this.files.set(next);
  }

  removeAt(i: number): void {
    this.files.set(this.files().filter((_, idx) => idx !== i));
  }

  async submit(ev: Event): Promise<void> {
    ev.preventDefault();
    const batch = this.files();
    if (!batch.length || !this.cityId()) return;

    this.busy.set(true);
    this.errorMsg.set(null);
    this.done.set(0);

    const d = this.dateTaken();
    const iso =
      !this.noDate() && d
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        : null;
    const cap = this.caption().trim();

    const failed: typeof batch = [];
    let okCount = 0;
    for (let i = 0; i < batch.length; i++) {
      const fd = new FormData();
      fd.append('file', batch[i].file);
      fd.append('city_id', this.cityId());
      if (i === 0 && cap) fd.append('caption', cap);
      if (iso) fd.append('date_taken', iso);
      try {
        await firstValueFrom(this.http.post('/api/photos', fd));
        okCount++;
      } catch {
        failed.push(batch[i]);
      }
      this.done.update((n) => n + 1);
    }

    this.busy.set(false);
    if (okCount > 0) this.uploaded.emit();

    if (failed.length) {
      this.files.set(failed);
      this.errorMsg.set(
        `${okCount} subido(s), ${failed.length} fallaron. Reintentá los que quedaron (verificá login de editor y que sean imagen/video).`
      );
    } else {
      this.caption.set('');
      this.files.set([]);
      this.cityId.set('');
      this.dateTaken.set(null);
      this.noDate.set(false);
    }
  }
}
