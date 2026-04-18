/**
 * Pure-function helper that returns the same markup that `<app-icon>` would
 * render, for contexts where Angular components are not available (e.g.
 * Leaflet popup HTML strings).
 *
 * Supports the same `ms-` (Material Symbols Outlined) and `pi-` (PrimeIcons)
 * prefixes as `AppIcon`.
 *
 * Usage:
 *   iconHtml('pi-calendar', { color: '#555', size: '9px' })
 *   // → '<i class="pi pi-calendar" style="font-size:9px;color:#555"></i>'
 *
 *   iconHtml('ms-home', { size: '14px' })
 *   // → '<span class="material-symbols-outlined" style="font-size:14px;line-height:1">home</span>'
 */
export function iconHtml(
  name: string,
  opts: { color?: string; size?: string; extraStyle?: string } = {},
): string {
  const { color, size = '1rem', extraStyle } = opts;

  const styleParts: string[] = [`font-size:${size}`];
  if (color) styleParts.push(`color:${color}`);
  if (extraStyle) styleParts.push(extraStyle);
  const style = styleParts.join(';');

  if (name.startsWith('ms-')) {
    const iconName = name.slice(3);
    return `<span class="material-symbols-outlined" style="${style};line-height:1">${iconName}</span>`;
  }

  if (name.startsWith('pi-')) {
    // AppIcon renders `pi pi-xxx` from `pi-xxx` input: prepend "pi " class.
    const piClass = `pi ${name}`;
    return `<i class="${piClass}" style="${style}"></i>`;
  }

  // Fallback: treat as raw pi icon class (e.g. "pi-map-marker" already includes prefix).
  return `<i class="pi ${name}" style="${style}"></i>`;
}
