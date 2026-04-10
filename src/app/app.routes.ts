import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendario',
    pathMatch: 'full',
  },
  {
    path: 'mapa',
    loadComponent: () => import('./mapa/mapa').then((m) => m.MapaPage),
  },
  {
    path: 'calendario',
    loadComponent: () => import('./calendario/calendario').then((m) => m.CalendarioPage),
  },
  {
    path: 'itinerario',
    loadComponent: () => import('./itinerario/itinerario').then((m) => m.ItinerarioPage),
  },
  {
    path: 'madrid',
    data: { slug: 'madrid' },
    loadComponent: () => import('./ciudades/ciudad').then((m) => m.CiudadPage),
  },
  {
    path: 'barcelona',
    data: { slug: 'barcelona' },
    loadComponent: () => import('./ciudades/ciudad').then((m) => m.CiudadPage),
  },
  {
    path: 'paris',
    data: { slug: 'paris' },
    loadComponent: () => import('./ciudades/ciudad').then((m) => m.CiudadPage),
  },
  {
    path: 'venecia',
    data: { slug: 'venecia' },
    loadComponent: () => import('./ciudades/ciudad').then((m) => m.CiudadPage),
  },
  {
    path: 'roma',
    data: { slug: 'roma' },
    loadComponent: () => import('./ciudades/ciudad').then((m) => m.CiudadPage),
  },
  {
    path: 'fotos',
    loadComponent: () => import('./fotos/fotos').then((m) => m.FotosPage),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then((m) => m.NotFound),
  },
];
