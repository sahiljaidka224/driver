import gql from "graphql-tag";

export const GET_TRIPPRICE_BASEDON_LOCATION = gql`
  query GetTripPriceBasedOnLatLng(
    $sourceLat: Float!
    $sourceLng: Float!
    $destinationLat: Float!
    $destinationLng: Float!
  ) {
    getTripPriceBasedOnLatLng(
      source: { lat: $sourceLat, lng: $sourceLng }
      destination: { lat: $destinationLat, lng: $destinationLng }
    ) {
      duration
      distance
      fare {
        type
        price
      }
    }
  }
`;
