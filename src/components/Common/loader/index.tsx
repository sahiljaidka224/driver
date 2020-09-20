import { Animated, Easing } from "react-native";

import { Color } from "../../../constants/Theme";
import React from "react";
import styled from "styled-components/native";

interface LoaderProps {
  loadingText?: string;
  onButtonPress: () => void;
  buttonTitle?: string;
}

const BackgroundView = styled.View`
  flex: 1;
  background-color: #fefefe;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
`;

const LoadingWrapper = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingView = styled(Animated.View)`
  width: 50px;
  height: 50px;
  border: 1.5px solid ${Color.Button.Background};
  border-radius: 25px;
`;

const LoadingText = styled.Text`
  margin-top: 5px;
  font-size: 15px;
  font-family: "SFPro-Regular";
`;

const LoaderButton = styled.Button`
  width: 50%;
  margin: 0 auto;
  bottom: 10px;
  position: absolute;
  background-color: ${Color.Button.Background};
`;

export const Loader: React.FC<LoaderProps> = ({
  loadingText = "Loading ...",
  onButtonPress,
  buttonTitle = "Cancel",
}) => {
  const [spin, updateSpin] = React.useState(new Animated.Value(0));

  Animated.loop(
    Animated.timing(spin, {
      toValue: 1,
      duration: 700,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  return (
    <BackgroundView>
      <LoadingWrapper>
        <LoadingView
          style={{
            borderBottomWidth: 0,
            borderLeftWidth: 0,
            transform: [
              {
                rotate: spin.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          }}
        />
        <LoadingText>{loadingText}</LoadingText>
      </LoadingWrapper>
      <LoaderButton title={buttonTitle} onPress={onButtonPress} />
    </BackgroundView>
  );
};
