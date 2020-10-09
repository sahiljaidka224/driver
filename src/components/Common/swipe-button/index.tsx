import { Animated } from "react-native";
import { Color } from "../../../constants/Theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import styled from "styled-components/native";

type SwipeableButtonProps = {
  defaultText?: string;
  successText?: string;
  onSuccess?: () => void;
};

const SwipeableButtonWrapper = styled.View`
  width: 90%;
  height: 50px;
  border-radius: 30px;
  background: ${Color.Button.Background};
  margin-bottom: 10px;
`;

const TextWrapper = styled.View`
  width: auto;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  margin: 0 15px;
  display: flex;
  flex-direction: row;
`;

const Desc = styled.Text`
  font-size: 18px;
  font-weight: 400;
  color: white;
`;

const AnimatedText = styled(Animated.Text)`
  font-size: 18px;
  font-weight: 400;
  color: white;
`;

const LeftAction = styled(RectButton)`
  flex: 1;
  justify-content: center;
`;

export const SwipeableButton: React.FC<SwipeableButtonProps> = ({
  defaultText = "Swipe right to notify",
  successText = "Loading ...",
  onSuccess,
}) => {
  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation,
    dragX: Animated.AnimatedInterpolation
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <LeftAction onPress={() => {}}>
        <AnimatedText
          style={[
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          {successText}
        </AnimatedText>
      </LeftAction>
    );
  };

  return (
    <SwipeableButtonWrapper>
      <Swipeable
        renderLeftActions={renderLeftActions}
        onSwipeableLeftOpen={() => {
          if (onSuccess) {
            onSuccess();
          }
        }}
      >
        <TextWrapper>
          <Desc>{defaultText}</Desc>
          <Feather name="arrow-right" color="#fff" size={20} />
        </TextWrapper>
      </Swipeable>
    </SwipeableButtonWrapper>
  );
};
