import { Routes } from '@angular/router';
import { CITY_SLUGS } from './shared/constants/cities';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendario',
    pathMatch: 'full',
  },
  {
    path: 'mapa',
    loadComponent: () => import('./mapa/map').then((m) => m.MapPage),
  },
  {
    path: 'calendario',
    loadComponent: () => import('./calendario/calendar').then((m) => m.CalendarPage),
  },
  {
    path: 'itinerario',
    loadComponent: () => import('./itinerario/itinerary').then((m) => m.ItineraryPage),
  },
  {
    path: 'sitios',
    loadComponent: () => import('./sitios/sitios-page').then((m) => m.SitiosPage),
  },
  {
    path: 'fotos',
    loadComponent: () => import('./fotos/gallery').then((m) => m.GalleryPage),
  },
  {
    path: 'reservas',
    loadComponent: () => import('./reservas/reservas').then((m) => m.ReservasPage),
  },
  {
    path: 'modificaciones',
    loadComponent: () => import('./modificaciones/modificaciones').then((m) => m.ModificacionesPage),
  },
  {
    path: 'bienvenida',
    loadComponent: () => import('./bienvenida/bienvenida').then((m) => m.BienvenidaPage),
  },
  { path: CITY_SLUGS.MADRID,    redirectTo: `/sitios?c=${CITY_SLUGS.MADRID}` },
  { path: CITY_SLUGS.BARCELONA, redirectTo: `/sitios?c=${CITY_SLUGS.BARCELONA}` },
  { path: CITY_SLUGS.PALMA,     redirectTo: `/sitios?c=${CITY_SLUGS.PALMA}` },
  { path: CITY_SLUGS.LONDRES,   redirectTo: `/sitios?c=${CITY_SLUGS.LONDRES}` },
  { path: CITY_SLUGS.ROMA,      redirectTo: `/sitios?c=${CITY_SLUGS.ROMA}` },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
  },
];
