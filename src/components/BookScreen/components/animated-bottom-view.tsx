import { Animated, Dimensions, Easing, PanResponder } from "react-native";
import React, { ReactElement, useState } from "react";

import { Audio } from "expo-av";
import { Color } from "../../../constants/Theme";
import Constants from "expo-constants";
import { DRIVER_ONLINE } from "../queriesAndMutations";
import styled from "styled-components/native";
import { useMutation } from "@apollo/react-hooks";

type AnimatedBottomViewProps = {
  children?: ReactElement;
};

const PanGestureView = styled(Animated.View)`
  position: absolute;
  right: 0;
  align-items: center;
`;

const ScrollViewWrapper = styled.ScrollView`
  padding: 10px;
  background-color: skyblue;
  width: 100%;
  margin: 0 auto;
`;

const OnlineButton = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${Color.Button.Background};
  margin-bottom: 20px;
  justify-content: center;
  align-items: center;
`;

const OnlineText = styled.Text`
  font-weight: bold;
  font-size: 34px;
  color: #fff;
`;

const BackgroundView = styled.View`
  position: absolute;
  bottom: 0;
  min-width: 90%;
  height: auto;
  background-color: transparent;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  display: flex;
  left: 10px;
  right: 10px;
  align-items: center;
`;

export const AnimatedBottomView: React.FC<AnimatedBottomViewProps> = ({
  children,
}) => {
  const { height, width } = Dimensions.get("window");
  const initialPosition = { x: 0, y: height - 230 };
  const pos = new Animated.ValueXY(initialPosition);
  const [toTop, updateToTop] = useState(false);
  const [position, updatePosition] = useState(pos);
  const soundObject = new Audio.Sound();

  const [isOnline, updateOnline] = useState(false);
  const [rotateAnim, updateRotateAnim] = useState(new Animated.Value(0));

  const [updateOnlineStatus, { loading, error }] = useMutation(DRIVER_ONLINE, {
    onCompleted: ({ driverOnline }) => {
      if (driverOnline) {
        updateOnline(driverOnline);
      }
    },
  });

  React.useEffect(() => {
    (async () => {
      await soundObject.loadAsync(
        require("../../../../assets/audio/ButtonClick.mp3")
      );
    })();
  }, []);

  const animateText = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
    ]).start(() => {
      animateText();
    });
  };

  if (isOnline) {
    animateText();
  }


  const onOnlinePress = async () => {
    try {
      //   console.log({ soundObject });
      //   await soundObject.playAsync();

      //TODO: unload after 5 seconds
      //   await soundObject.unloadAsync();

      updateOnlineStatus({
        variables: {
          isOnline: !isOnline,
        },
      });
    } catch (err) {
      console.log({ err });
    }
  };

  const snapToTop = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: Constants.statusBarHeight + 5 },
      duration: 300,
      useNativeDriver: false,
    }).start();
    updateToTop(true);
  };

  const snapToBottom = (initialPosition: { x: number; y: number }) => {
    Animated.timing(position, {
      toValue: initialPosition,
      duration: 210,
      useNativeDriver: false,
    }).start();
    updateToTop(false);
  };

  const parentResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: (_e, _gestureState) => {
      return false;
    },
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_e, gestureState) => {
      if (toTop) {
        return gestureState.dy > 6;
      } else {
        return gestureState.dy < -6;
      }
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderMove: (_evt, gestureState) => {
      let newy = gestureState.dy;
      if (toTop && newy < 0) return;
      if (toTop) {
        position.setValue({ x: 0, y: newy + Constants.statusBarHeight });
      } else {
        position.setValue({ x: 0, y: initialPosition.y + newy });
      }
    },
    onPanResponderRelease: (_evt, gestureState) => {
      if (toTop) {
        if (gestureState.dy > 50) {
          snapToBottom(initialPosition);
        } else {
          snapToTop();
        }
      } else {
        if (gestureState.dy < -90) {
          snapToTop();
        } else {
          snapToBottom(initialPosition);
        }
      }
    },
  });

  return (
    // <PanGestureView
    //   style={[{ height }, position.getLayout()]}
    //   {...parentResponder.panHandlers}
    // >
    <>
      <BackgroundView>
        {!toTop && !isOnline && (
          <OnlineButton onPress={onOnlinePress}>
            <OnlineText>GO</OnlineText>
          </OnlineButton>
        )}
        <Animated.View
          style={{
            opacity: isOnline ? 1 : 0,
            transform: [
              {
                rotate:
                  isOnline &&
                  rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
              },
            ],
          }}
        >
          <Animated.Text>Searching ...</Animated.Text>
        </Animated.View>
        {/* {!toTop && isOnline && <Animated.Text>Searching ...</Animated.Text>} */}
      </BackgroundView>
    </>
    //   <ScrollViewWrapper>
    //     <Text style={{ fontSize: 44 }}>Lorem Ipsum</Text>
    //     {children}
    //   </ScrollViewWrapper>
    // </PanGestureView>
  );
};
