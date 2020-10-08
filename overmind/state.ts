import { Point } from "react-native-google-places-autocomplete";

export interface AddressData {
  readable: string;
  location: Point;
}

export enum ScreenState {
  INITIAL,
  ROUTES,
  SEARCHING,
  DRIVER_ASSIGNED,
  BOOKING_IN_PROGRESS,
  DRIVER_ARRIVED,
  CANCELLED,
  COMPLETED,
  BOOKING_RECEIVED
}

type State = {
  source: AddressData | undefined;
  destination: AddressData | undefined;
  bookingScreenState: ScreenState;
};

export const state: State = {
  source: undefined,
  destination: undefined,
  bookingScreenState: ScreenState.INITIAL,
};
