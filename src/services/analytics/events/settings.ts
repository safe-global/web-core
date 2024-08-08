import { EventType } from '@/services/analytics/types'

const SETTINGS_CATEGORY = 'settings'

export const SETTINGS_EVENTS = {
  SETUP: {
    ADD_OWNER: {
      action: 'Add owner',
      category: SETTINGS_CATEGORY,
    },
    EDIT_OWNER: {
      action: 'Edit owner',
      category: SETTINGS_CATEGORY,
    },
    REPLACE_OWNER: {
      action: 'Replace owner',
      category: SETTINGS_CATEGORY,
    },
    REMOVE_OWNER: {
      action: 'Remove owner',
      category: SETTINGS_CATEGORY,
    },
    CHANGE_THRESHOLD: {
      action: 'Change threshold',
      category: SETTINGS_CATEGORY,
    },
    OWNERS: {
      event: EventType.META,
      action: 'Owners',
      category: SETTINGS_CATEGORY,
    },
    THRESHOLD: {
      event: EventType.META,
      action: 'Threshold',
      category: SETTINGS_CATEGORY,
    },
  },
  APPEARANCE: {
    COPY_PREFIXES: {
      action: 'Copy EIP-3770 prefixes',
      category: SETTINGS_CATEGORY,
    },
    DARK_MODE: {
      action: 'Dark mode',
      category: SETTINGS_CATEGORY,
    },
  },
  MODULES: {
    REMOVE_MODULE: {
      action: 'Remove module',
      category: SETTINGS_CATEGORY,
    },
    REMOVE_GUARD: {
      action: 'Remove transaction guard',
      category: SETTINGS_CATEGORY,
    },
  },
  SPENDING_LIMIT: {
    NEW_LIMIT: {
      action: 'New spending limit',
      category: SETTINGS_CATEGORY,
    },
    RESET_PERIOD: {
      event: EventType.META,
      action: 'Spending limit reset period',
      category: SETTINGS_CATEGORY,
    },
    REMOVE_LIMIT: {
      action: 'Remove spending limit',
      category: SETTINGS_CATEGORY,
    },
    LIMIT_REMOVED: {
      action: 'Spending limit removed',
      category: SETTINGS_CATEGORY,
    },
  },
  DATA: {
    IMPORT_ADDRESS_BOOK: {
      action: 'Imported address book via Import all',
      category: SETTINGS_CATEGORY,
    },
    IMPORT_SETTINGS: {
      action: 'Imported settings via Import all',
      category: SETTINGS_CATEGORY,
    },
    IMPORT_SAFE_APPS: {
      action: 'Imported Safe apps via Import all',
      category: SETTINGS_CATEGORY,
    },
    IMPORT_UNDEPLOYED_SAFES: {
      action: 'Imported counterfactual safes via Import all',
      category: SETTINGS_CATEGORY,
    },
  },
  ENV_VARIABLES: {
    SAVE: {
      action: 'Environment variables changed',
      category: SETTINGS_CATEGORY,
    },
  },
  SAFE_APPS: {
    CHANGE_SIGNING_METHOD: {
      action: 'Safe apps signing method changed',
      category: SETTINGS_CATEGORY,
    },
  },
}
