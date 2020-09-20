import { AddressData, ScreenState } from "./state";

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
