/**
 * Haptic feedback utility.
 * Triggers a short vibration on mobile devices that support it.
 */
export function haptic(ms = 10) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(ms);
  }
}
