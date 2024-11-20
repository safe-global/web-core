import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { reduxStorage } from './storage'
import txHistory from './txHistorySlice'
import activeChain from './activeChainSlice'
import { cgwClient } from '@/src/store/gateway/cgwClient'
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin'
import { isTestingEnv } from '../config/constants'

const persistConfig = {
  key: 'root',
  version: 1,
  storage: reduxStorage,
  blacklist: [cgwClient.reducerPath],
}
export const rootReducer = combineReducers({
  txHistory,
  activeChain,
  [cgwClient.reducerPath]: cgwClient.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    devTools: false,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(cgwClient.middleware),
    enhancers: (getDefaultEnhancers) => {
      if (isTestingEnv) {
        return getDefaultEnhancers()
      }

      return getDefaultEnhancers().concat(devToolsEnhancer())
    },
  })

export const store = makeStore()

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
