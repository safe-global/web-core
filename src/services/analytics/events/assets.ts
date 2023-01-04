import { EventType } from '@/services/analytics/types'

const ASSETS_CATEGORY = 'assets'

export const ASSETS_EVENTS = {
  CURRENCY_MENU: {
    action: 'Currency menu',
    category: ASSETS_CATEGORY,
  },
  TOKEN_LIST_MENU: {
    action: 'Token list menu',
    category: ASSETS_CATEGORY,
  },
  CHANGE_CURRENCY: {
    event: EventType.META,
    action: 'Change currency',
    category: ASSETS_CATEGORY,
  },
  TOGGLE_HIDDEN_ASSETS: {
    event: EventType.META,
    action: 'Toggle hidden assets',
    category: ASSETS_CATEGORY,
  },
  DIFFERING_TOKENS: {
    event: EventType.META,
    action: 'Tokens',
    category: ASSETS_CATEGORY,
  },
  HIDDEN_TOKENS: {
    event: EventType.META,
    action: 'Hidden tokens',
    category: ASSETS_CATEGORY,
  },
  SEND: {
    action: 'Send',
    category: ASSETS_CATEGORY,
  },
  HIDE: {
    action: 'Hide',
    category: ASSETS_CATEGORY,
  },
  CANCEL_HIDE_DIALOG: {
    action: 'Cancel hide dialog',
    category: ASSETS_CATEGORY,
  },
  SAVE_HIDE_DIALOG: {
    action: 'Save hide dialog',
    category: ASSETS_CATEGORY,
  },
  DESELECT_ALL_HIDE_DIALOG: {
    action: 'Deselect all hide dialog',
    category: ASSETS_CATEGORY,
  },
}
