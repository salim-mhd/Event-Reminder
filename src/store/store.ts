import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import eventReducer from '@/store/slices/eventSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;