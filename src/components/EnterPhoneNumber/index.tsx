import {
  CountryCode,
  FlagWrapper,
  HorizontalLine,
  PhoneWrapper,
} from "../EntryPoint";
import {
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native";

import { BackButton } from "../Common/BackButton/index";
import { NavigationProp } from "@react-navigation/native";
import { NextButton } from "../Common/NextButton";
import React from "react";
import { SIGNUP_USING_NUM } from "../EntryPoint/queriesAndMutations";
import { iphone6OrGreater } from "../../utils/device-info";
import styled from "styled-components/native";
import { useMutation } from "@apollo/react-hooks";

interface EnterPhoneNumberProps {
  navigation: NavigationProp<any, any>;
}

const SafeAreaWrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: #ffffff;
  display: flex;
`;

export const EnterMobileNumberText = styled(Text)`
  font-size: 21px;
  color: #0e1823;
  font-family: "SFPro-Regular";
  margin-left: 30px;
  margin-top: 30px;
`;

const PhoneNumberInput = styled(TextInput)`
  padding-left: 6px;
  font-family: "SFPro-Regular";
  font-size: 19px;
  color: #000000;
`;

export const NextButtonWrapper = styled(View)`
  align-items: center;
  width: ${iphone6OrGreater() ? "84%" : "80%"};
  justify-content: space-between;
  display: flex;
  margin: ${iphone6OrGreater() ? "10px" : "0"};
  flex-direction: row;
`;

export const ByContinuingText = styled(Text)`
  font-size: 16px;
  font-family: "SFPro-Regular";
  margin: 0 20px;
  width: 80%;
`;

const Container = styled(View)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ContainerNumber = styled(View)`
  flex: 1;
`;

const ContainerButton = styled(View)`
  flex: 1;
  align-items: flex-start;
  padding: 10px;
`;

const Error = styled(Text)`
  font-size: 14px;
  font-family: "SFPro-Regular";
  color: red;
  margin: 0 auto;
`;

let noop: () => {};

export const EnterPhoneNumber: React.FC<EnterPhoneNumberProps> = ({
  navigation,
}) => {
  const [value, onChangeText] = React.useState<string>("");
  const [signUp, { loading, error, data }] = useMutation(SIGNUP_USING_NUM, {
    onCompleted: (completedData) => {
      navigation.navigate("OtpScreen", {
        number: value,
        id: completedData.createDriver._id,
      });
    },
  });

  const onBackButtonClick = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const onChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const { text } = event.nativeEvent;
    let trimmedText = text.replace(/ /g, "");

    trimmedText = trimmedText.replace(/[^0-9]/g, "");
    if (trimmedText.length > 3) {
      const initialSplit = trimmedText.substring(0, 3);
      let secondSplit = trimmedText.substring(3, trimmedText.length);

      if (trimmedText.length > 6) {
        secondSplit = trimmedText.substring(3, 6);

        const finalSplit = trimmedText.substring(6, trimmedText.length);
        return onChangeText(`${initialSplit} ${secondSplit} ${finalSplit}`);
      }
      return onChangeText(`${initialSplit} ${secondSplit}`);
    }
    onChangeText(text);
  };

  const onNextButtonClick = async () => {
    if (value.replace(/ /g, "").length !== 9) return;

    await signUp({ variables: { mobNumber: value.replace(/ /g, "") } });
  };

  return (
    <SafeAreaWrapper>
      <BackButton onClick={onBackButtonClick} />
      <Container>
        <ContainerNumber>
          <EnterMobileNumberText>
            Enter your mobile number
          </EnterMobileNumberText>
          <PhoneWrapper>
            <FlagWrapper />
            <CountryCode>+61</CountryCode>
            <PhoneNumberInput
              multiline={false}
              numberOfLines={1}
              placeholder="474 430 303"
              placeholderTextColor="rgba(96, 96, 94, 0.5)"
              autoFocus
              keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
              value={value}
              onChange={onChange}
              maxLength={11}
            />
          </PhoneWrapper>
          <HorizontalLine />
          {!loading && !data && error && <Error>Please try again!</Error>}
        </ContainerNumber>
        <ContainerButton>
          <NextButtonWrapper>
            <ByContinuingText>
              By continuing you will receive a SMS for verification
            </ByContinuingText>
            <NextButton
              onClick={!loading ? onNextButtonClick : noop}
              isValid={value.replace(/ /g, "").length === 9}
              loading={loading}
            />
          </NextButtonWrapper>
        </ContainerButton>
      </Container>
    </SafeAreaWrapper>
  );
};
