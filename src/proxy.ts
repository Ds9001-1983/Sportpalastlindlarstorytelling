import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next.js 16: "middleware" wurde zu "proxy" umbenannt (Node-Runtime, kein edge).
// next-intl liefert den Request-Handler – wir exportieren ihn als `proxy`.
const handle = createMiddleware(routing);

export function proxy(request: Parameters<typeof handle>[0]) {
  return handle(request);
}

export const config = {
  // Alles außer Next-Internals, API und Dateien mit Endung (z.B. /frames/*.webp, /og.jpg).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
