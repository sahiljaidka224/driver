import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Loader } from "../Common/loader";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import styled from "styled-components/native";

interface EntryScreenProps {
  navigation: NavigationProp<any, any>;
}

const BackgroundView = styled(SafeAreaView)`
  background-color: #ffffff;
  display: flex;
  flex: 1;
  align-items: center;
`;

const Wrapper = styled(View)`
  width: 100%;
  height: 60%;
`;

const WelcomeImage = styled(Image)`
  flex: 1;
  width: 100%;
`;

const WelcomeWrapper = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-left: 25px;
  margin-top: 10px;
  position: absolute;
  align-items: center;
`;

const WelcomeTo = styled(Text)`
  color: #0e1823;
  font-family: "SFPro-Regular";
  font-size: 22px;
  margin-right: 6px;
`;

const NameWrapper = styled(Image)`
  height: 52px;
  width: 68px;
  margin-top: 5px;
`;

export const HorizontalLine = styled(View)`
  height: 1.5px;
  background-color: #eeeeee;
  width: 90%;
  margin: 0 auto;
`;

export const PhoneWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  margin-bottom: 25px;
  margin-left: 40px;
  width: 100%;
  margin-top: 80px;
  align-items: center;
`;

export const CountryCode = styled(Text)`
  font-family: "SFPro-Regular";
  font-size: 24px;
  color: #000000;
`;

export const PhoneNumberClickable = styled(TouchableOpacity)`
  flex: 1;
  height: 40px;
  justify-content: center;
`;

export const PhoneNumber = styled(Text)`
  font-family: "SFPro-Regular";
  font-size: 18px;
  color: #000000;
  opacity: 0.4;
  margin-left: 6px;
`;

const SocialMediaWrapper = styled(View)`
  flex: 1;
  justify-content: center;
`;

const SocialMediaText = styled(Text)`
  color: #2ecb70;
  font-size: 17px;
  font-family: "SFPro-Regular";
`;

export const FlagWrapper = styled(View)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: black;
  margin-right: 17px;
`;

export const EntryScreen: React.FC<EntryScreenProps> = ({ navigation }) => {
  const onPhoneNumberClick = () => {
    navigation.navigate("EnterPhoneNumber");
  };

  return (
    <BackgroundView>
      <Wrapper>
        <WelcomeWrapper>
          {/* <WelcomeTo>Let's</WelcomeTo> */}
          <NameWrapper
            source={require("../../../assets/WelcomeScreenLogo.png")}
          />
        </WelcomeWrapper>
        <WelcomeImage
          source={require("../../../assets/WelcomeScreen.png")}
          resizeMode="contain"
        />
      </Wrapper>
      <PhoneWrapper>
        <FlagWrapper />
        <CountryCode>+61</CountryCode>
        <PhoneNumberClickable onPress={onPhoneNumberClick}>
          <PhoneNumber>474 430 303</PhoneNumber>
        </PhoneNumberClickable>
      </PhoneWrapper>
      <HorizontalLine />
      <SocialMediaWrapper>
        <SocialMediaText>
          By signing up you agree to our privacy policy
        </SocialMediaText>
      </SocialMediaWrapper>
      <StatusBar style="auto" />
    </BackgroundView>
  );
};
