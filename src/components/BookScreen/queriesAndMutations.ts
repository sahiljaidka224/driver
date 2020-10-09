import gql from "graphql-tag";

export const SUBSCRIBE_TO_BOOKING = gql`
  subscription SubscribeToBooking {
    bookingCreated {
      id
      destLatLng {
        lat
        lng
      }
      sourceAddress
      sourceLatLng {
        lat
        lng
      }
      destAddress
      type
      proposedFare
    }
  }
`;

export const UPDATE_BOOKING = gql`
  mutation UpdateBooking($bookingId: ID!, $status: String!) {
    driverUpdateBooking(bookingId: $bookingId, status: $status) {
      bookingId
      status
      source
      sourceLatLng {
        lat
        lng
      }
      type
      destAddress
      destLatLng {
        lat
        lng
      }
    }
  }
`;

export const UPDATE_EXPO_PUSHTOKEN = gql`
  mutation UpdateExpoPushToken($pushToken: String!, $userType: String) {
    registerExpoPushToken(pushToken: $pushToken, userType: $userType)
  }
`;

export const DRIVER_ONLINE = gql`
  mutation DriverOnline($isOnline: Boolean!) {
    driverOnline(isOnline: $isOnline)
  }
`;

export const BOOKING_UPDATED_SUBSCRIPTION = gql`
  subscription BookingUpdated($bookingId: ID!) {
    bookingUpdated(bookingId: $bookingId) {
      bookingId
      driverId
      email
      fullName
      mobile
      rating
      distance
      location
      status
    }
  }
`;

export const GET_BOOKING_BY_ID = gql`
  query GetBookingById($bookingId: ID!) {
    getBookingById(bookingId: $bookingId) {
      bookingId
      status
      source
      sourceLatLng {
        lat
        lng
      }
    }
  }
`;

export const DRIVER_DECLINE_BOOKING = gql`
  mutation DriverDeclineBooking($bookingId: ID!) {
    driverDeclineBooking(bookingId: $bookingId)
  }
`;
