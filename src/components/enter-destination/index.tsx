import { ActivityIndicator, Animated, Easing, View } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";

import { AddressAutocomplete } from "../google-places-autocomplete";
import { BackButton } from "../Common/BackButton";
import { Color } from "../../constants/Theme";
import { GET_TRIPPRICE_BASEDON_LOCATION } from "./queriesAndMutations";
import { Point } from "react-native-google-places-autocomplete";
import React from "react";
import { RideView } from "../ride-type";
import styled from "styled-components/native";
import { useLazyQuery } from "@apollo/react-hooks";
import { useOvermind } from "../../../overmind";

interface EnterDestinationProps {
  navigation: NavigationProp<any, any>;
  route: RouteProp<any, any>;
}

export interface AddressData {
  readable: string;
  location: Point;
}

const Wrapper = styled(View)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  top: 5%;
  flex: 1;
  border-radius: 10px;
`;

const BackButtonWrapper = styled(Animated.View)`
  margin-top: 25px;
  margin-left: 10px;
  width: 50px;
`;

const DestinationViewWrapper = styled(View)`
  width: 100%;
  height: 17%;
  display: flex;
  flex-direction: row;
`;

const DesignWrapper = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const VerticalLine = styled(View)`
  border: 0.5px dashed black;
  height: 48px;
`;

const CircleView = styled(View)<{ widthHeight: number }>`
  width: ${(props) => (props.widthHeight ? `${props.widthHeight}px` : "10px")};
  height: ${(props) => (props.widthHeight ? `${props.widthHeight}px` : "10px")};
  border-radius: ${(props) =>
    props.widthHeight ? `${props.widthHeight / 2}px` : "5px"};
  background-color: black;
`;

const TextViewWrapper = styled.View`
  flex: 5;
  justify-content: center;
`;

export const EnterDestinationScreen: React.FC<EnterDestinationProps> = ({
  navigation,
  route,
}) => {
  const { state, actions } = useOvermind();
  const { source, destination } = state;

  const [rotateAnim, updateRotateAnim] = React.useState(new Animated.Value(0));
  const [getTripPrice, { loading, error, data }] = useLazyQuery(
    GET_TRIPPRICE_BASEDON_LOCATION,
    {
      onCompleted: (completedData) => {
        console.log({ completedData });
      },
    }
  );

  React.useEffect(() => {
    if (source && destination) {
      //   getTripPriceFromDb();
    }
  }, [source, destination]);

  const onBackButton = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const updateSourceAdd = (data: AddressData) => {
    actions.updateSource(data);

    if (destination) onBackButton();
  };

  const updateDestinationAdd = (data: AddressData) => {
    actions.updateDestination(data);
    onBackButton();
  };

  const getTripPriceFromDb = () => {
    if (!source || !destination) return console.log("No source or dest");

    if (!source.location || !source.location.lat || !source.location.lng)
      return console.log("No source data");

    if (
      !destination.location ||
      !destination.location.lat ||
      !destination.location.lng
    )
      return console.log("No dest data");
    //TODO: show error;

    getTripPrice({
      variables: {
        sourceLat: source.location.lat,
        sourceLng: source.location.lng,
        destinationLat: destination.location.lat,
        destinationLng: destination.location.lng,
      },
    });
  };

  Animated.timing(rotateAnim, {
    toValue: 1,
    duration: 1500,
    easing: Easing.bounce,
    useNativeDriver: true,
  }).start();

  return (
    <Wrapper>
      <BackButtonWrapper
        style={{
          transform: [
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "270deg"],
              }),
            },
          ],
        }}
      >
        <BackButton onClick={onBackButton} />
      </BackButtonWrapper>
      <DestinationViewWrapper>
        <DesignWrapper>
          <CircleView widthHeight={18} />
          <VerticalLine />
          <CircleView widthHeight={10} />
        </DesignWrapper>
        <TextViewWrapper>
          <AddressAutocomplete
            key="1"
            address={source && source.readable ? source.readable : ""}
            placeholder="Current Location"
            updateAddress={updateSourceAdd}
            margin
          />
          <AddressAutocomplete
            key="2"
            address={
              destination && destination.readable ? destination.readable : ""
            }
            placeholder="Where to?"
            autoFocus={!destination}
            updateAddress={updateDestinationAdd}
          />
        </TextViewWrapper>
      </DestinationViewWrapper>
      {loading && <ActivityIndicator size="small" />}
      {/* {data && <RideView />} */}
    </Wrapper>
  );
};
