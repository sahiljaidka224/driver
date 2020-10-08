import {
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { DRIVER_DECLINE_BOOKING, UPDATE_BOOKING } from "../queriesAndMutations";
import React, { useEffect } from "react";

import { Color } from "../../../constants/Theme";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { FontAwesome } from "@expo/vector-icons";
import { ScreenState } from "../../../../overmind/state";
import styled from "styled-components/native";
import { useMutation } from "@apollo/react-hooks";
import { useOvermind } from "../../../../overmind";

type BookingNotificationProps = {
  bookingId: string;
  destAdress: string;
  sourceAddress: string;
  bookingType: string;
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
  destAdress,
  sourceAddress,
  bookingType,
}) => {
  const [seconds, updateSeconds] = React.useState(TIMER_VALUE);

  const { actions } = useOvermind();

  const [
    declineBooking,
    { loading: declineBookingLoading, error: decBookingError },
  ] = useMutation(DRIVER_DECLINE_BOOKING, {
    onCompleted: (completedData) => {
      const { driverDeclineBooking } = completedData;

      if (driverDeclineBooking) {
        actions.updateBookingScreenState(ScreenState.INITIAL);
      }
    },
  });

  const [updatebooking, { loading, error }] = useMutation(UPDATE_BOOKING, {
    onCompleted: (completedData) => {
      const { driverUpdateBooking } = completedData;
      if (!driverUpdateBooking) return;

      const { status, sourceLatLng } = driverUpdateBooking;
      if (status === "DRIVER_ASSIGNED") {
        actions.updateBookingScreenState(ScreenState.DRIVER_ASSIGNED);
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
    declineBooking({
      variables: { bookingId },
    });
  };

  return (
    <BackgroundView>
      <IconWrapper onPress={() => console.log("presssed")}>
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
        <Info>Tap to accept this {bookingType.toLowerCase()}</Info>
        {sourceAddress ? (
          <Address numberOfLines={1}>{sourceAddress}</Address>
        ) : null}
        {sourceAddress && destAdress ? (
          <MapIconWrapper>
            <FontAwesome name="map-signs" size={34} color="red" />
          </MapIconWrapper>
        ) : null}
        {destAdress ? <Address numberOfLines={1}>{destAdress}</Address> : null}
      </BottomView>
    </BackgroundView>
  );
};
