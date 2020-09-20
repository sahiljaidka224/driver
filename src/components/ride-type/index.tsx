import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

interface RideTypeProps {
  heading: string;
  fare: string;
  description?: string;
  onPress: () => void;
}

const BackgroundView = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  width: 100%;
  height: 110px;
  padding: 20px;
  align-items: center;
  padding: 30px 20px;
`;

const CarWrapper = styled.Image`
  height: 85px;
  width: 90px;
  border-radius: 20px;
`;

const TextWrapper = styled.View`
  align-items: flex-start;
  justify-content: center;
  margin-left: 15px;
  flex: 2;
`;

const HeadingText = styled.Text`
  font-family: "SFPro-Regular";
  font-style: normal;
  font-weight: normal;
  font-size: 19px;
  line-height: 24px;
`;

const DescText = styled.Text`
  font-family: "SFPro-Regular";
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #878787;
`;

const Fare = styled.Text`
  font-family: "SFPro-Regular";
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 24px;
  margin-left: 15px;
  margin-right: 5px;
`;

export const RideView: React.FC<RideTypeProps> = ({
  fare,
  heading,
  description,
  onPress,
}) => {
  return (
    <BackgroundView onPress={onPress}>
      <CarWrapper
        source={require("../../../assets/Car.png")}
        resizeMode="center"
      />

      <TextWrapper>
        <HeadingText>{heading}</HeadingText>
        <DescText>{description}</DescText>
      </TextWrapper>
      <Fare>{`$${fare}`}</Fare>
    </BackgroundView>
  );
};
