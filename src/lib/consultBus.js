/**
 * The consultation overlay's event bus.
 *
 * Kept out of the overlay component so triggers (Navbar, ClosingCta, Footer,
 * InlineCta) can open the dialog without importing a component module — which
 * also keeps fast-refresh happy (component files export components only).
 *
 * The overlay listens for OPEN/CLOSE on `window`; anything anywhere can fire
 * openConsult(). `setConsultOpen` marks the open state on <html> so other
 * scroll-lock owners (the Navbar menu) can yield to the overlay instead of
 * unlocking the page beneath it.
 */

export const OPEN_CONSULT_EVENT = 'occ:open-consult';
export const CLOSE_CONSULT_EVENT = 'occ:close-consult';

/** Any trigger anywhere on the site opens the overlay with this one call. */
export const openConsult = () =>
  window.dispatchEvent(new Event(OPEN_CONSULT_EVENT));

export const closeConsult = () =>
  window.dispatchEvent(new Event(CLOSE_CONSULT_EVENT));

export const setConsultOpen = (open) => {
  if (open) document.documentElement.dataset.consultOpen = 'true';
  else delete document.documentElement.dataset.consultOpen;
};
