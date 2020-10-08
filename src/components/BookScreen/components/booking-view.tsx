import {
  BOOKING_UPDATED_SUBSCRIPTION,
  GET_BOOKING_BY_ID,
} from "../queriesAndMutations";
import { useQuery, useSubscription } from "@apollo/react-hooks";

import { Color } from "../../../constants/Theme";
import { Coords } from "..";
import { CustomerView } from "./customer-view";
import { Loader } from "../../Common/loader";
import React from "react";
import { ScreenState } from "../../../../overmind/state";
import { getPolyline } from "../../../utils/polyline";
import styled from "styled-components/native";
import { useOvermind } from "../../../../overmind";

type BookingViewProps = {
  bookingId: string;
  updateRoute: (coordinates: [Coords]) => void;
};

const BackgroundView = styled.View`
  height: auto;
  width: auto;
  min-height: 15%;
  justify-content: center;
  align-items: center;
`;

const InfoText = styled.Text`
  font-size: 17px;
  font-weight: 600;
  margin-top: 10px;
`;

export const BookingView: React.FC<BookingViewProps> = ({
  bookingId,
  updateRoute,
}) => {
  const { state, actions } = useOvermind();
  const { source, bookingScreenState } = state;

  const {
    loading: bookingDeetsLoading,
    error: bookingDeetsError,
    data: bookingDeetsData,
  } = useQuery(GET_BOOKING_BY_ID, {
    variables: {
      bookingId: bookingId,
    },
    onCompleted: (completedData) => {
      console.log({ completedData });
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  console.log({ bookingDeetsData });
  const { data: bookingUpdatedData, loading, error } = useSubscription(
    BOOKING_UPDATED_SUBSCRIPTION,
    {
      variables: { bookingId: bookingId },
      onSubscriptionData: async ({ subscriptionData }) => {
        if (subscriptionData.data) {
          const { bookingUpdated } = subscriptionData.data;
          const { status, location } = bookingUpdated;

          //   if (status === "DRIVER_ASSIGNED") {
          //     if (location && source && source.location) {
          //       if (location.length < 1) return;
          //       const destPoint = {
          //         lat: location[1],
          //         lng: location[0],
          //       };

          //       const coordinates = await getPolyline(source.location, destPoint);
          //       updateRoute(coordinates);
          //       actions.updateBookingScreenState(ScreenState.DRIVER_ASSIGNED);
          //     }
          //   }
        }
      },
    }
  );

  console.log({ bookingUpdatedData });

  return (
    <BackgroundView>
      {/* {bookingScreenState === ScreenState.SEARCHING && <BackgroundView />} */}
      <InfoText>Head to pick up location</InfoText>
      {bookingDeetsData &&
        bookingScreenState === ScreenState.DRIVER_ASSIGNED &&
        bookingDeetsData.getBookingById && (
          <CustomerView
            name={"Name"}
            phone={""}
            carName=""
            onCancel={() => {}}
          />
        )}
    </BackgroundView>
  );
};
