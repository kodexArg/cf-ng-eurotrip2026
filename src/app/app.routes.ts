import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { ownerGuard } from './shared/guards/owner.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendario',
    pathMatch: 'full',
  },
  {
    path: 'mapa',
    loadComponent: () => import('./mapa/map').then((m) => m.MapPage),
    canActivate: [authGuard],
  },
  {
    path: 'calendario',
    loadComponent: () => import('./calendario/calendar').then((m) => m.CalendarPage),
    canActivate: [authGuard],
  },
  {
    path: 'itinerario',
    loadComponent: () => import('./itinerario/itinerary').then((m) => m.ItineraryPage),
    canActivate: [authGuard],
  },
  {
    path: 'sitios',
    loadComponent: () => import('./sitios/sitios-page').then((m) => m.SitiosPage),
    canActivate: [authGuard],
  },
  {
    path: 'fotos',
    loadComponent: () => import('./fotos/gallery').then((m) => m.GalleryPage),
    canActivate: [authGuard],
  },
  {
    path: 'reservas',
    loadComponent: () => import('./reservas/reservas').then((m) => m.ReservasPage),
    canActivate: [authGuard],
  },
  {
    path: 'modificaciones',
    loadComponent: () => import('./modificaciones/modificaciones').then((m) => m.ModificacionesPage),
  },
  {
    path: 'access',
    loadComponent: () => import('./access/access-request').then((m) => m.AccessRequestPage),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then((m) => m.AdminPage),
    canActivate: [ownerGuard],
  },
  { path: 'madrid', redirectTo: '/sitios?c=madrid' },
  { path: 'barcelona', redirectTo: '/sitios?c=barcelona' },
  { path: 'palma', redirectTo: '/sitios?c=palma' },
  { path: 'londres', redirectTo: '/sitios?c=londres' },
  { path: 'roma', redirectTo: '/sitios?c=roma' },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
  },
];
