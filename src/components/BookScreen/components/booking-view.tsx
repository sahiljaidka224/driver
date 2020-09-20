import { BOOKING_UPDATED_SUBSCRIPTION } from "../queriesAndMutations";
import { Coords } from "..";
import { DriverDetails } from "./driver-view";
import { Loader } from "../../Common/loader";
import React from "react";
import { ScreenState } from "../../../../overmind/state";
import { getPolyline } from "../../../utils/polyline";
import styled from "styled-components/native";
import { useOvermind } from "../../../../overmind";
import { useSubscription } from "@apollo/react-hooks";

type BookingViewProps = {
  bookingId: string;
  updateRoute: (coordinates: [Coords]) => void;
};

const BackgroundView = styled.View`
  background-color: red;
  height: auto;
  width: auto;
  min-height: 15%;
`;

export const BookingView: React.FC<BookingViewProps> = ({
  bookingId,
  updateRoute,
}) => {
  const { state, actions } = useOvermind();
  const { source, bookingScreenState } = state;
  const { data: bookingUpdatedData, loading, error } = useSubscription(
    BOOKING_UPDATED_SUBSCRIPTION,
    {
      variables: { bookingId: bookingId },
      onSubscriptionData: async ({ subscriptionData }) => {
        if (subscriptionData.data) {
          const { bookingUpdated } = subscriptionData.data;
          const { status, location } = bookingUpdated;

          if (status === "DRIVER_ASSIGNED") {
            if (location && source && source.location) {
              if (location.length < 1) return;
              const destPoint = {
                lat: location[1],
                lng: location[0],
              };

              const coordinates = await getPolyline(source.location, destPoint);
              updateRoute(coordinates);
              actions.updateBookingScreenState(ScreenState.DRIVER_ASSIGNED);
            }
          }
        }
      },
    }
  );

  console.log({ bookingUpdatedData });

  return (
    <>
      {bookingScreenState === ScreenState.SEARCHING && <BackgroundView />}
      {bookingUpdatedData &&
        bookingScreenState === ScreenState.DRIVER_ASSIGNED &&
        bookingUpdatedData.bookingUpdated && (
          <DriverDetails
            name={bookingUpdatedData.bookingUpdated.fullName ?? "Name"}
            phone={bookingUpdatedData.bookingUpdated.mobile ?? ""}
            carName=""
            onCancel={() => {}}
          />
        )}
    </>
  );
};
