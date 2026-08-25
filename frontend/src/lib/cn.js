import clsx from 'clsx'

// A tiny wrapper so components read cleanly. clsx handles conditional
// class names without dragging in a full merge library.
export function cn(...inputs) {
  return clsx(inputs)
}
