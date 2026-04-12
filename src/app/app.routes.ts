import { Routes } from '@angular/router';

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
    path: 'madrid',
    data: { slug: 'madrid' },
    loadComponent: () => import('./ciudades/city').then((m) => m.CityPage),
  },
  {
    path: 'barcelona',
    data: { slug: 'barcelona' },
    loadComponent: () => import('./ciudades/city').then((m) => m.CityPage),
  },
  {
    path: 'paris',
    data: { slug: 'paris' },
    loadComponent: () => import('./ciudades/city').then((m) => m.CityPage),
  },
  {
    path: 'venecia',
    data: { slug: 'venecia' },
    loadComponent: () => import('./ciudades/city').then((m) => m.CityPage),
  },
  {
    path: 'roma',
    data: { slug: 'roma' },
    loadComponent: () => import('./ciudades/city').then((m) => m.CityPage),
  },
  {
    path: 'fotos',
    loadComponent: () => import('./fotos/gallery').then((m) => m.GalleryPage),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
  },
];
