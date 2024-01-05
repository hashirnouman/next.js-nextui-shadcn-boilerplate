// store/index.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import counterReducer from '../slices/directionSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
  // Add other reducers here if you have more slices
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
