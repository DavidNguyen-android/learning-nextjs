import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { invoiceApi } from './api/invoiceApi';
import invoiceFiltersReducer from './slices/invoiceFiltersSlice';
import uiReducer from './slices/uiSlice';
import userPrefsReducer from './slices/userPrefsSlice';

const userPrefsPersistConfig = {
  key: 'userPrefs',
  storage,
};

const rootReducer = combineReducers({
  ui: uiReducer,
  invoiceFilters: invoiceFiltersReducer,
  userPrefs: persistReducer(userPrefsPersistConfig, userPrefsReducer),
  [invoiceApi.reducerPath]: invoiceApi.reducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(invoiceApi.middleware),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>['store'];
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
