// One place that decides how a WhatsApp link opens.
//
// Every wa.me link on the page (and the booking form) goes through `openWhatsApp`:
//  1. Ask first with a small confirmation panel, so a stray tap never leaves the site,
//     unless the visitor ticked "Don't ask again" or is inside an app (Instagram,
//     Facebook…) that already shows its own "Open WhatsApp?" prompt.
//  2. Then take the shortest route for the device:
//     - desktop: WhatsApp Web directly (skips wa.me's "Continue to chat" page)
//     - phone:   wa.me in the same tab, which hands off to the WhatsApp app
//                (or WhatsApp's install page if it isn't installed)

const SKIP_KEY = 'fwu-wa-skip';

export type WaTarget = { phone: string; text: string };

export function parseWa(href: string): WaTarget | null {
  try {
    const u = new URL(href);
    if (u.hostname !== 'wa.me' && u.hostname !== 'api.whatsapp.com') return null;
    const phone = (u.pathname.replace(/\D/g, '') || u.searchParams.get('phone') || '').replace(/\D/g, '');
    return { phone, text: u.searchParams.get('text') ?? '' };
  } catch {
    return null;
  }
}

const ua = navigator.userAgent;
/** In-app browsers that show their own "leave app / open WhatsApp" prompt. */
export const inAppBrowser = /Instagram|FBAN|FBAV|FB_IAB|FBIOS|Line\/|Snapchat|Twitter|LinkedInApp/i.test(ua);
const isPhone = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || window.matchMedia('(pointer: coarse)').matches;

export function skipConfirm() {
  try {
    return localStorage.getItem(SKIP_KEY) === '1';
  } catch {
    return false;
  }
}
export function setSkipConfirm(v: boolean) {
  try {
    localStorage.setItem(SKIP_KEY, v ? '1' : '0');
  } catch {}
}

/** Leave for WhatsApp. Must be called synchronously from a click/tap (Safari blocks delayed opens). */
export function go({ phone, text }: WaTarget) {
  const q = text ? `text=${encodeURIComponent(text)}` : '';
  if (isPhone) {
    window.location.href = `https://wa.me/${phone}${q ? `?${q}` : ''}`;
  } else {
    window.open(`https://web.whatsapp.com/send?phone=${phone}${q ? `&${q}` : ''}`, '_blank', 'noopener');
  }
}

type Asker = (t: WaTarget) => void;
let asker: Asker | null = null;
/** The confirmation panel registers itself here. */
export function registerAsker(fn: Asker) {
  asker = fn;
}

/** Entry point for every WhatsApp action on the site. */
export function openWhatsApp(target: WaTarget) {
  if (inAppBrowser || skipConfirm() || !asker) go(target);
  else asker(target);
}
