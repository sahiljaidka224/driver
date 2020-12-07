import {
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { BookingState, CurrentBooking } from "../../../../overmind/state";
import { DRIVER_DECLINE_BOOKING, UPDATE_BOOKING } from "../queriesAndMutations";
import React, { useEffect } from "react";

import { Color } from "../../../constants/Theme";
import { Coords } from "..";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { FontAwesome } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useMutation } from "@apollo/react-hooks";
import { useOvermind } from "../../../../overmind";

type BookingNotificationProps = {
  bookingId: string;
  onCancel: (coords: [Coords] | undefined) => void;
};

const BackgroundView = styled.View`
  background-color: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  margin: 0 auto;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
`;

const IconWrapper = styled(TouchableOpacity)`
  padding-left: 15px;
`;

const BottomView = styled(TouchableOpacity)<{ background?: string }>`
  width: 95%;
  height: 30%;
  background-color: ${({ background }) =>
    background ? background : "#e5e5e5"};
  margin: 0 auto;
  margin-bottom: 10px;
  border-radius: 20px;
  padding: 10px;
  justify-content: space-between;
`;

const Info = styled.Text`
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  font-family: "SFPro-Regular";
  margin: 0 auto;
`;

const Address = styled.Text`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 18px;
  font-family: "SFPro-Regular";
  margin: 10px auto;
`;

const MapIconWrapper = styled.View`
  margin: 0 auto;
`;

const ONE_SECOND_IN_MS = 100;

const PATTERN = [1 * ONE_SECOND_IN_MS];
const TIMER_VALUE = 15;

export const BookingNotification: React.FC<BookingNotificationProps> = ({
  bookingId,
  onCancel,
}) => {
  const [seconds, updateSeconds] = React.useState(TIMER_VALUE);
  const { actions, state } = useOvermind();

  const { currentBooking } = state;

  const [
    declineBooking,
    { loading: declineBookingLoading, error: decBookingError },
  ] = useMutation(DRIVER_DECLINE_BOOKING, {
    onCompleted: (completedData) => {
      const { driverDeclineBooking } = completedData;

      if (driverDeclineBooking) {
        actions.updateCurrentBooking(undefined);
      }
    },
    fetchPolicy: "no-cache",
  });

  const [updatebooking, { loading, error }] = useMutation(UPDATE_BOOKING, {
    fetchPolicy: "no-cache",
    onCompleted: (completedData) => {
      const { driverUpdateBooking } = completedData;
      if (!driverUpdateBooking) return;

      const {
        status,
        sourceLatLng,
        bookingId,
        source,
        destAddress,
        destLatLng,
        type,
      } = driverUpdateBooking;
      const currentStatus = BookingState.DRIVER_ASSIGNED;

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
          status: currentStatus,
        };
        actions.updateCurrentBooking(currentBook);
      }
    },
  });

  const onPress = () => {
    if (bookingId) {
      Vibration.cancel();
      updatebooking({
        variables: { bookingId, status: "DRIVER_ASSIGNED" },
      });
    }
  };

  useEffect(() => {
    if (!seconds) return;

    const intervalId = setInterval(() => {
      updateSeconds(seconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  const onTimerComplete = () => {
    if (bookingId) {
      onCancel(undefined);
      declineBooking({
        variables: { bookingId },
      });
    }
  };

  return (
    <BackgroundView>
      <IconWrapper onPress={onTimerComplete}>
        <FontAwesome name="times-circle" size={66} />
      </IconWrapper>
      {loading || declineBookingLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <CountdownCircleTimer
          isPlaying={seconds > 0}
          duration={TIMER_VALUE}
          colors={Color.Button.Background}
          onComplete={onTimerComplete}
        >
          {({ remainingTime }) => (
            <Animated.Text
              style={{ fontSize: 46, color: Color.Button.Background }}
            >
              {remainingTime}
            </Animated.Text>
          )}
        </CountdownCircleTimer>
      )}

      <BottomView
        onPress={onPress}
        background={
          seconds % 2 === 0 ? `${Color.Button.Background}` : "#e5e5e5"
        }
      >
        {currentBooking && (
          <>
            <Info>Tap to accept this {currentBooking?.type.toLowerCase()}</Info>
            {currentBooking?.sourceAddress.readable ? (
              <Address numberOfLines={1}>
                {currentBooking?.sourceAddress.readable}
              </Address>
            ) : null}
            {currentBooking?.sourceAddress &&
            currentBooking?.destinationAddress ? (
              <MapIconWrapper>
                <FontAwesome name="map-signs" size={34} color="red" />
              </MapIconWrapper>
            ) : null}
            {currentBooking?.destinationAddress.readable ? (
              <Address numberOfLines={1}>
                {currentBooking?.destinationAddress.readable}
              </Address>
            ) : null}
          </>
        )}
      </BottomView>
    </BackgroundView>
  );
};
