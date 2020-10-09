import { ActivityIndicator, Linking } from "react-native";
import {
  BOOKING_UPDATED_SUBSCRIPTION,
  GET_BOOKING_BY_ID,
  UPDATE_BOOKING,
} from "../queriesAndMutations";
import { BookingState, CurrentBooking } from "../../../../overmind/state";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";

import { Color } from "../../../constants/Theme";
import { Coords } from "..";
import { CustomerView } from "./customer-view";
import React from "react";
import { SwipeableButton } from "../../Common/swipe-button";
import styled from "styled-components/native";
import { useOvermind } from "../../../../overmind";

type BookingViewProps = {
  bookingId: string;
  updateRoute: (coordinates: [Coords]) => void;
};

const CurrentLocationView = styled.TouchableOpacity`
  background: white;
  width: 42px;
  height: 42px;
  position: absolute;
  right: 20px;
  top: -30px;
  border-radius: 21px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${Color.Button.Background};
`;

const BackgroundView = styled.View`
  height: auto;
  width: auto;
  min-height: 15%;
  justify-content: center;
  align-items: center;
`;

const InfoText = styled.Text<{ bold?: boolean }>`
  font-size: 17px;
  font-weight: ${({ bold }) => (bold ? 600 : 300)};
  margin-top: 10px;
  flex-wrap: wrap;
  flex: 1;
  margin-left: ${({ bold }) => (bold ? "0" : "10px")};
`;

const IconTextWrapper = styled.View`
  display: flex;
  flex-direction: row;
  max-width: 90%;
  width: auto;
  justify-content: center;
  align-items: center;
`;

const SwipeableButtonWrapper = styled.View`
  width: 90%;
  height: 50px;
  border-radius: 10px;
`;

export const BookingView: React.FC<BookingViewProps> = ({
  bookingId,
  updateRoute,
}) => {
  const { state, actions } = useOvermind();
  const { currentBooking } = state;

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

  const [
    updatebooking,
    { loading: updateBookingLoading, error: updateBookingErr },
  ] = useMutation(UPDATE_BOOKING, {
    onCompleted: (completedData) => {
      const { driverUpdateBooking } = completedData;

      if (!driverUpdateBooking) return;

      const {
        status,
        sourceLatLng,
        bookingId,
        destAddress,
        destLatLng,
        source,
        type,
      } = driverUpdateBooking;
      if (getStatusBasedOnStr(status) === BookingState.COMPLETED) {
        actions.updateCurrentBooking(undefined);
      } else {
        if (bookingId) {
          const currentBook: CurrentBooking = {
            id: bookingId,
            sourceAddress: {
              readable: source,
              location: sourceLatLng,
            },
            destinationAddress: {
              readable: destAddress,
              location: destLatLng,
            },
            type: type,
            status: getStatusBasedOnStr(status),
          };
          actions.updateCurrentBooking(currentBook);
        }
      }
    },
  });

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

  const getNextStatus = (): BookingState | undefined => {
    if (!currentBooking) return;
    let nextStatus = BookingState.DRIVER_ASSIGNED;
    switch (currentBooking.status) {
      case BookingState.DRIVER_ARRIVED:
        nextStatus = BookingState.STARTED;
        break;

      case BookingState.STARTED:
        nextStatus = BookingState.COMPLETED;
        break;

      case BookingState.DRIVER_ASSIGNED:
        nextStatus = BookingState.DRIVER_ARRIVED;
        break;
      default:
        nextStatus = BookingState.DRIVER_ARRIVED;
        break;
    }
    return nextStatus;
  };

  const getStatusBasedOnStr = (status: string): BookingState => {
    let currentStatus;
    switch (status) {
      case "DRIVER_ARRIVED":
        currentStatus = BookingState.DRIVER_ARRIVED;
        break;
      case "DRIVER_ASSIGNED":
        currentStatus = BookingState.DRIVER_ASSIGNED;
        break;
      case "STARTED":
        currentStatus = BookingState.STARTED;
        break;
      case "COMPLETED":
        currentStatus = BookingState.COMPLETED;
        break;
      default:
        currentStatus = BookingState.DRIVER_ASSIGNED;
        break;
    }

    return currentStatus;
  };

  const getStringStatus = (): string => {
    const nextStatus = getNextStatus();

    if (!nextStatus) return "";
    let nextStatusStr = "DRIVER_ASSIGNED";
    switch (nextStatus) {
      case BookingState.DRIVER_ASSIGNED:
        nextStatusStr = "DRIVER_ASSIGNED";
        break;
      case BookingState.DRIVER_ARRIVED:
        nextStatusStr = "DRIVER_ARRIVED";
        break;
      case BookingState.STARTED:
        nextStatusStr = "STARTED";
        break;
      case BookingState.COMPLETED:
        nextStatusStr = "COMPLETED";
        break;
      default:
        nextStatusStr = "DRIVER_ARRIVED";
        break;
    }

    return nextStatusStr;
  };

  const onOpenMaps = () => {
    if (!currentBooking) return;
    const { sourceAddress } = currentBooking;
    const { location } = sourceAddress;
    let daddr = encodeURIComponent(`${location.lat}, ${location.lng}`);
    Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
  };

  const onUpdate = () => {
    updatebooking({
      variables: {
        bookingId,
        status: getStringStatus(),
      },
    });
  };

  return (
    <BackgroundView>
      <InfoText bold>Head to pick up location</InfoText>
      {currentBooking &&
      currentBooking.sourceAddress &&
      currentBooking.sourceAddress.readable ? (
        <>
          <IconTextWrapper>
            <FontAwesome name="map-pin" size={22} />
            <InfoText>{currentBooking.sourceAddress.readable}</InfoText>
          </IconTextWrapper>
          <CustomerView name={"Name"} phone={""} carName="" />
          {updateBookingLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <SwipeableButton
              onSuccess={onUpdate}
              defaultText={
                getStringStatus() ? `Swipe right to ${getStringStatus()}` : ""
              }
            />
          )}
        </>
      ) : null}
      <CurrentLocationView
        onPress={onOpenMaps}
        style={{
          shadowColor: `${Color.Shadow.Color}`,
          shadowOpacity: 0.2,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 4,
        }}
      >
        <Feather
          name="navigation-2"
          color={Color.Button.Background}
          size={24}
        />
      </CurrentLocationView>
    </BackgroundView>
  );
};
