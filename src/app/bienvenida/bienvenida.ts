import { ChangeDetectionStrategy, Component } from '@angular/core';
import { httpResource } from '@angular/common/http';

interface WhoAmI {
  accessActive: boolean;
  email: string | null;
  editor: boolean;
}

/**
 * Post-login welcome page. Cloudflare Access (Google) has already
 * authenticated the user; this greets them and shows whether they have
 * edit access (allowlisted email) or are a view-only visitor.
 */
@Component({
  selector: 'app-bienvenida',
  imports: [],
  template: `
    <div class="max-w-xl mx-auto p-6 text-center flex flex-col gap-5 mt-10">
      <h1 class="text-3xl font-bold text-surface-800">Bienvenida al Eurotrip 2026</h1>

      @if (who.isLoading()) {
        <p class="text-surface-500">Cargando tu sesión…</p>
      } @else if (!who.value()?.accessActive) {
        <p class="text-surface-600">
          El acceso con Google aún no está activo. Estás en modo de transición.
        </p>
      } @else if (who.value()?.email) {
        <p class="text-surface-700">
          Entraste como <strong>{{ who.value()!.email }}</strong>.
        </p>
        @if (who.value()!.editor) {
          <div class="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">
            Tenés <strong>permiso de edición</strong>: podés crear y modificar
            contenido (subir fotos/videos, etc.).
          </div>
        } @else {
          <div class="rounded-lg bg-sky-50 border border-sky-200 p-4 text-sky-800">
            Tenés acceso de <strong>solo lectura</strong>: podés ver todo el viaje,
            pero no modificar nada. ¡Disfrutá!
          </div>
        }
        <div class="flex gap-3 justify-center mt-2">
          <a
            href="/calendario"
            class="bg-primary-600 text-white text-sm rounded px-4 py-2 no-underline"
          >Entrar al viaje</a>
          <a
            href="/cdn-cgi/access/logout"
            class="text-sm rounded px-4 py-2 border border-surface-300 text-surface-600 no-underline"
          >Cerrar sesión</a>
        </div>
      } @else {
        <p class="text-surface-600">No pudimos verificar tu sesión de Google.</p>
        <a href="/cdn-cgi/access/logout" class="text-sm text-primary-600">Reintentar login</a>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BienvenidaPage {
  readonly who = httpResource<WhoAmI>(() => '/api/auth/whoami');
}
