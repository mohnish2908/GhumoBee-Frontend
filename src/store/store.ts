import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import opportunityReducer from '../slices/opportunitySlice';
import userReducer from '../slices/userSlice';

const opportunityPersistConfig = {
  key: 'opportunity',
  storage,
  whitelist: ['opportunities', 'lastFetched'] // Only persist these fields
};

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['_id', 'name', 'email', 'role', 'profilePicture', 'city', 'state', 'isVerified', 'token'] // Persist user data
};

const persistedOpportunityReducer = persistReducer(opportunityPersistConfig, opportunityReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    opportunity: persistedOpportunityReducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);