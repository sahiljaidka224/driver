import * as Linking from "expo-linking";

import { Color } from "../../../constants/Theme";
import { Icons } from "../../../constants/icons";
import React from "react";
import styled from "styled-components/native";

interface DriverDetailsProps {
  name: string;
  carName?: string;
  phone: string;
  onCancel: () => void;
}

const Container = styled.View`
  padding: 20px;
`;

const Wrapper = styled.View`
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DriverImage = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
`;

const NameWrapper = styled.View`
  margin-left: 10px;
  flex: 1;
`;

const Name = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 17px;
  font-family: "SFPro-Regular";
  color: #0e1823;
`;

const CarName = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 17px;
  font-family: "SFPro-Regular";
  color: #878787;
`;

const CallWrapper = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${Color.Button.Background};
  justify-content: center;
  align-items: center;
`;

const CallImage = styled.Image`
  width: 15.6px;
  height: 15.6px;
`;

const CancelWrapper = styled.View`
  display: flex;
  align-items: center;
`;

const CancelButton = styled.TouchableOpacity`
  width: 140px;
  height: 55px;
  border-radius: 20px;
  background-color: #e5e6e7;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

const CancelText = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 17px;
  font-family: "SFPro-Regular";
  color: #0e1823;
`;

export const DriverDetails: React.FC<DriverDetailsProps> = ({
  name,
  carName = "Toyota Camry",
  phone = "0475431313",
  onCancel,
}) => {
  const onPress = () => {
    Linking.openURL(`tel:${phone.replace(/-/g, "")}`);
  };
  return (
    <Container>
      <Wrapper>
        <DriverImage source={Icons.driverDefault} resizeMode="contain" />
        <NameWrapper>
          <Name>{name}</Name>
          <CarName>{carName}</CarName>
        </NameWrapper>
        <CallWrapper onPress={onPress}>
          <CallImage source={Icons.call} resizeMode="contain" />
        </CallWrapper>
      </Wrapper>
      <CancelWrapper>
        <CancelButton onPress={onCancel}>
          <CancelText>Abort</CancelText>
        </CancelButton>
      </CancelWrapper>
    </Container>
  );
};
