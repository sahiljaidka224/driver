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
    }
  }
`;

export const UPDATE_EXPO_PUSHTOKEN = gql`
  mutation UpdateExpoPushToken($pushToken: String!, $userType: String) {
    registerExpoPushToken(pushToken: $pushToken, userType: $userType)
  }
`;
