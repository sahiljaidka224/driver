import { Image, SafeAreaView, Text, View } from "react-native";

import { Color } from "../../constants/Theme";
import { NextButton } from "../Common/NextButton";
import React from "react";
import styled from "styled-components";

const BackgroundView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Color.BackgroundView.Background};
  align-items: center;
`;

const NotificationWrapper = styled(View)`
  flex: 5;
  align-items: center;
  width: 100%;
`;

const NotificationIcon = styled(Image)`
  width: 160px;
  height: 195px;
  margin-top: 20%;
  margin-left: 5%;
`;

const NextButtonWrapper = styled(View)`
  flex: 1;
`;

const TextWrapper = styled(View)`
  height: max-content;
  margin-top: 20px;
  align-items: center;
`;

const TextBegin = styled(Text)`
  font-size: 26px;
  font-weight: 400;
  font-family: "SFPro-Regular";
`;

const TextEnd = styled(Text)`
  font-size: 32px;
  font-weight: 900;
  font-family: "SFPro-Regular";
`;

export const EnableNotifications = () => {
  return (
    <BackgroundView>
      <NotificationWrapper>
        <NotificationIcon
          source={require("../../../assets/NotificationIcon.png")}
          resizeMode="center"
        />
        <TextWrapper>
          <TextBegin>Relax with real-time</TextBegin>
          <TextEnd>trip updates</TextEnd>
        </TextWrapper>
      </NotificationWrapper>

      <NextButtonWrapper>
        <NextButton isValid onClick={() => {}} />
      </NextButtonWrapper>
    </BackgroundView>
  );
};
