import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { City } from '../../shared/models';

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
  imports: [],
  template: `
    <form
      class="bg-surface-50 border border-surface-200 rounded-lg p-4 mb-6 flex flex-col gap-3"
      (submit)="submit($event)"
    >
      <h2 class="text-sm font-semibold text-surface-700 m-0">Subir foto o video</h2>

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
        <input
          type="file"
          accept="image/*,video/*"
          class="text-sm"
          (change)="onFile($event)"
          required
        />
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
  readonly busy = signal(false);
  readonly errorMsg = signal<string | null>(null);

  onFile(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    this.file.set(input.files?.[0] ?? null);
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

    try {
      await firstValueFrom(this.http.post('/api/photos', fd));
      this.caption.set('');
      this.file.set(null);
      this.cityId.set('');
      this.uploaded.emit();
    } catch {
      this.errorMsg.set('No se pudo subir. Verificá que estés logueado como owner y que el archivo sea imagen o video.');
    } finally {
      this.busy.set(false);
    }
  }
}
