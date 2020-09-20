import { ActivityIndicator, Animated, Easing, Image, TouchableOpacity } from "react-native";

import { Color } from "../../../constants/Theme";
import React from "react";
import styled from "styled-components/native";

interface NextButtonProps {
  onClick: () => void;
  isValid: boolean;
  loading?: boolean;
}

const NextButtonWrapper = styled(TouchableOpacity)`
  width: 61px;
  height: 61px;
  border-radius: 30.5px;
  align-items: center;
  justify-content: center;
  background-color: ${Color.Button.Background};
`;

const NextButtonImage = styled(Image)`
  width: 14px;
  height: 14px;
`;

export const NextButton: React.FC<NextButtonProps> = ({ onClick, isValid, loading}) => {
  const [fadeAnim, updateFadeAnim] = React.useState(new Animated.Value(0));
  const [rotateAnim, updateRotateAnim] = React.useState(new Animated.Value(0));


  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();

  if (isValid) {
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

  }

  return (
    <NextButtonWrapper onPress={onClick}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [150, 0],
              }),
              rotate:
                isValid &&
                rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
            },
          ],
        }}
      >
        {loading ? (
            <ActivityIndicator size="small" color="#fff" />
        ) : (
          <NextButtonImage
            source={require("../../../../assets/ArrowLeft.png")}
          />
        )}
      </Animated.View>
    </NextButtonWrapper>
  );
};
