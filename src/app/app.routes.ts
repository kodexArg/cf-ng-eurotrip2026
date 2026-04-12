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
    path: 'madrid',
    data: { slug: 'madrid' },
    loadComponent: () => import('./ciudades/city').then((m) => m.CityPage),
    canActivate: [authGuard],
  },
  {
    path: 'barcelona',
    data: { slug: 'barcelona' },
    loadComponent: () => import('./ciudades/city').then((m) => m.CityPage),
    canActivate: [authGuard],
  },
  {
    path: 'paris',
    data: { slug: 'paris' },
    loadComponent: () => import('./ciudades/city').then((m) => m.CityPage),
    canActivate: [authGuard],
  },
  {
    path: 'palma',
    data: { slug: 'palma' },
    loadComponent: () => import('./ciudades/city').then((m) => m.CityPage),
    canActivate: [authGuard],
  },
  {
    path: 'roma',
    data: { slug: 'roma' },
    loadComponent: () => import('./ciudades/city').then((m) => m.CityPage),
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
    path: 'access',
    loadComponent: () => import('./access/access-request').then((m) => m.AccessRequestPage),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then((m) => m.AdminPage),
    canActivate: [ownerGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then((m) => m.AdminPage),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
  },
];
