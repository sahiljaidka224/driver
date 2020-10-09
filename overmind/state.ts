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
  BOOKING_RECEIVED,
}

export enum BookingState {
  REQUESTED,
  DRIVER_ASSIGNED,
  DRIVER_ARRIVED,
  STARTED,
  CANCELLED_BY_USER,
  CANCELLED_BY_DRIVER,
  COMPLETED,
}

export type CurrentBooking = {
  id: string;
  sourceAddress: AddressData;
  destinationAddress: AddressData;
  status: BookingState;
  type: string;
};

type State = {
  source: AddressData | undefined;
  destination: AddressData | undefined;
  bookingScreenState: ScreenState;
  currentBooking: CurrentBooking | undefined;
};

export const state: State = {
  source: undefined,
  destination: undefined,
  bookingScreenState: ScreenState.INITIAL,
  currentBooking: undefined,
};
