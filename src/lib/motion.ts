import type { Transition } from 'framer-motion'

/** Shared Framer Motion spring presets — tactile, never bouncy. */

/** Modals and dialogs: confident settle, no wobble. */
export const springModal: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 28,
}

/** Sheets and drawers: slightly softer entry. */
export const springSheet: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

/** Small elements (chips, cards): quick and light. */
export const springPill: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
}
