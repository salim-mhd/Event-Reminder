import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IEvent {
  description: string;
  end: string;
  id: string;
  start: string;
  summary: string;
  status?: string;
  eventType: string;
  createdAt: string;
  userId: string;

}

interface AuthState {
  events: IEvent[];
}

const initialState: AuthState = {
  events: [],
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<IEvent[]>) => {
      state.events = action.payload;
    },
    updateEvent: (state, action: PayloadAction<IEvent>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...action.payload };
      }
    },
  },
});

export const { setEvents, updateEvent } = eventSlice.actions;
export default eventSlice.reducer;
