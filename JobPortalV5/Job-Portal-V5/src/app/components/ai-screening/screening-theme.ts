import { ElementRef } from '@angular/core';
import { ScreeningTheme } from '@app/Service/ai-screening.service';

/* Paints one of the AI screening pages in the company's portal colours.

   The stylesheets are written against three custom properties with the
   portal's own defaults already in them, so this only overrides what the
   server actually sent. A company with no tblJobportalpolicy row, an older API
   that sends no Theme at all, or a blank column each leave the page in portal
   blue rather than unstyled - which is why every value is checked rather than
   assigned straight through.

   setProperty is used directly rather than Renderer2: Angular 6's
   setStyle has no flag for custom properties, and ngStyle silently drops any
   key beginning with "--". The element is this component's own host, so no
   other page is affected.

   prefix is 'ais' on the scheduling page and 'air' in the room - the two
   stylesheets name their tokens separately so neither can quietly inherit the
   other's. */
export function applyScreeningTheme(host: ElementRef, prefix: string, theme: ScreeningTheme): void {
    if (!host || !host.nativeElement || !theme) { return; }

    var root = host.nativeElement.querySelector('.' + prefix + '-app');
    if (!root) { return; }

    /* HeaderColor is deliberately not applied: it coloured the page's own
       wordmark, which has been removed because the portal masthead directly
       above already carries the company branding. The API still sends it, so
       it is here to be used again if a heading ever comes back. */
    set(root, '--' + prefix + '-accent', theme.ThemeColor);
    set(root, '--' + prefix + '-ink', theme.FontColor);
}

/* A colour is only applied when it is a value a browser will accept. An
   unparseable one would make the property compute to "unset", which falls back
   to the inherited value rather than the stylesheet's default - a blank page
   instead of a blue one. */
function set(root: any, name: string, value: string): void {
    if (!value) { return; }

    var trimmed = ('' + value).trim();
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) { return; }

    root.style.setProperty(name, trimmed);
}
