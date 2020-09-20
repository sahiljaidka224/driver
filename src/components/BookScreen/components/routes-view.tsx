import { MutationFunction } from "@apollo/react-hooks";
import React from "react";
import { RideView } from "../../ride-type";
import styled from "styled-components/native";
import { useOvermind } from "../../../../overmind";

interface Option {
  type: string;
  price: string;
}

interface RoutesViewProps {
  options?: Option[];
  duration: string;
  distance: string;
  requestBooking: MutationFunction;
}

const TopHighlight = styled.View`
  border: 3px solid #c4c4c4;
  border-radius: 2.5px;
  width: 15%;
  margin: 8px auto;
`;

const ChooseTrip = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  font-family: "SFPro-Regular";
  color: #0e1823;
  margin: 0 auto;
`;

const HorizontalLine = styled.View<{ margin?: boolean }>`
  border: 0.6px solid rgba(112, 112, 112, 0.2);
  width: 90%;
  margin: ${(props) => (props.margin ? `14px auto` : "4px auto")};
`;

export const RoutesView: React.FC<RoutesViewProps> = ({
  options,
  distance,
  duration,
  requestBooking,
}) => {
  const { state } = useOvermind();
  const { source, destination } = state;
  const timeString = `Choose a trip ${
    duration ? `to get there in ${duration} mins` : ""
  }`;
  return (
    <>
      <TopHighlight />
      <ChooseTrip>{timeString}</ChooseTrip>
      {options && options.map((opt, index) => {
        const { type, price } = opt;

        const onPress = () => {
          if (!source || !destination) return;
          requestBooking({
            variables: {
              type: type,
              proposedFare: price,
              sourceAddress: source.readable,
              destAddress: destination.readable,
              sourceLat: source.location.lat,
              sourceLng: source.location.lng,
              destLat: destination.location.lat,
              destLng: destination.location.lng,
            },
          });
        };
        return (
          <>
            <RideView
              key={index}
              heading={type}
              description="Affordable rides, all to yourself"
              fare={price}
              onPress={onPress}
            />
            {index + 1 !== options.length && (
              <HorizontalLine key={`${index}-line`} />
            )}
          </>
        );
      })}
    </>
  );
};