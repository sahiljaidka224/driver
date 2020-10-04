import { Platform, TouchableOpacity, Vibration } from "react-native";

import { Color } from "../../../constants/Theme";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { UPDATE_BOOKING } from "../queriesAndMutations";
import styled from "styled-components/native";
import { useMutation } from "@apollo/react-hooks";

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
  flex-direction: column;
  justify-content: space-between;
`;

const IconWrapper = styled(TouchableOpacity)`
  padding-left: 15px;
`;

const BottomView = styled(TouchableOpacity)`
  width: 95%;
  height: 30%;
  background-color: #e5e5e5;
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

export const BookingNotification: React.FC<BookingNotificationProps> = ({
  bookingId,
  destAdress,
  sourceAddress,
  bookingType,
}) => {


  const [updatebooking, { loading, error, data }] = useMutation(
    UPDATE_BOOKING,
    {
      onCompleted: (completedData) => {
        console.log({ completedData });
      },
    }
  );

  const onPress = () => {
    if (bookingId) {
      Vibration.cancel();
      updatebooking({
        variables: { bookingId, status: "DRIVER_ASSIGNED" },
      });
    }
  };
  return (
    <BackgroundView>
      <IconWrapper onPress={() => console.log("presssedÎ")}>
        <FontAwesome name="times-circle" size={66} />
      </IconWrapper>
      <BottomView onPress={onPress}>
        <Info>Tap to accept this {bookingType.toLowerCase()}</Info>
        {sourceAddress ? (
          <Address numberOfLines={1}>{sourceAddress}</Address>
        ) : null}
        {sourceAddress && destAdress ? (
          <MapIconWrapper>
            <FontAwesome
              name="map-signs"
              size={34}
              color={Color.Button.Background}
            />
          </MapIconWrapper>
        ) : null}
        {destAdress ? <Address numberOfLines={1}>{destAdress}</Address> : null}
      </BottomView>
    </BackgroundView>
  );
};
