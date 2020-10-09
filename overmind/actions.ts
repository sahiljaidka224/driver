import { AddressData, CurrentBooking, ScreenState } from "./state";

import { Action } from "overmind";

export const updateSource: Action<AddressData> = ({ state }, address) => {
  state.source = address;
};

export const updateDestination: Action<AddressData | undefined> = (
  { state },
  address
) => {
  state.destination = address;
};

export const updateBookingScreenState: Action<ScreenState> = (
  { state },
  screenState
) => {
  state.bookingScreenState = screenState;
};

export const updateCurrentBooking: Action<CurrentBooking | undefined> = (
  { state },
  currentBooking
) => {
  state.currentBooking = currentBooking;
};
