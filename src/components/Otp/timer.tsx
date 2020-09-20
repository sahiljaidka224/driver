import { Animated, TouchableOpacity } from "react-native";

import { Color } from "../../constants/Theme";
import { MutationFunction } from "@apollo/react-hooks";
import React from "react";
import styled from "styled-components/native";

type TimerProps = {
  resendOtp: MutationFunction;
  number: string;
};

const ResendButton = styled(TouchableOpacity)`
  border: 3px solid ${Color.Button.Background};
  width: auto;
  min-width: 100px;
  border-radius: 10px;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  padding-left: 10px;
`;

const TextWrapper = styled.Text`
  font-family: "SFPro-Regular";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
`;

const TIMER_VALUE = 35;

export const Timer: React.FC<TimerProps> = ({ resendOtp, number }) => {
  const [seconds, updateSeconds] = React.useState(TIMER_VALUE);
  const [fadeAnim, updateFadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (!seconds) return;

    if (seconds === 1) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }

    const intervalId = setInterval(() => {
      updateSeconds(seconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  const secondsBaseText = "Resend code in 0:";
  const secondsText =
    seconds <= 1
      ? ""
      : `${secondsBaseText} ${seconds > 9 ? seconds : `0${seconds}`}`;

  const onPress = () => {
    resendOtp({
      variables: { mobile: number },
    });

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      updateSeconds(TIMER_VALUE);
    });
  };

  return (
    <Wrapper>
      <TextWrapper>{secondsText}</TextWrapper>
      <Animated.View
        style={{
          opacity: fadeAnim,
        }}
      >
        <ResendButton onPress={onPress}>
          <TextWrapper>RESEND</TextWrapper>
        </ResendButton>
      </Animated.View>
    </Wrapper>
  );
};
