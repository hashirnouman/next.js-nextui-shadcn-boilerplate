// slices/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  direction: string;
}

const initialState: CounterState = {
  direction: 'ltr',
};

const directionSlice = createSlice({
  name: 'changedirection',
  initialState,
  reducers: {
    dirRTL: (state) => {
      state.direction = 'rtl';
    },
    dirLTR: (state) => {
      state.direction = 'ltr';
    },
  },
});

export const { dirRTL, dirLTR } = directionSlice.actions;
export default directionSlice.reducer;
