// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userRedux';
import adminReducer from './adminRedux';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'admin'], // ✅ persist both slices independently
};

const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer, // ✅ add admin slice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
