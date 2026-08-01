// ================ //
// Pixel Font Prefs //
// ================ //

export const PIXEL_FONT_STORAGE_KEY = "leetbytes-pixel-font";
export const PIXEL_FONT_OFF_CLASS = "pixel-font-off";

// Persists the pixel-font on/off choice and flips the <html> class that
// globals.css keys its font-family override off of.
export function setPixelFontPreference(enabled: boolean)
{
  window.localStorage.setItem(PIXEL_FONT_STORAGE_KEY, enabled ? "on" : "off");
  document.documentElement.classList.toggle(PIXEL_FONT_OFF_CLASS, !enabled);
}

export function getStoredPixelFontPreference(): boolean
{
  return window.localStorage.getItem(PIXEL_FONT_STORAGE_KEY) !== "off";
}
