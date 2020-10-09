import React, { ReactElement, useState } from "react";

import { Audio } from "expo-av";
import { Color } from "../../../constants/Theme";
import { DRIVER_ONLINE } from "../queriesAndMutations";
import styled from "styled-components/native";
import { useMutation } from "@apollo/react-hooks";

type AnimatedBottomViewProps = {
  children?: ReactElement;
};

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

const SearchingTextWrapper = styled.View`
  margin-bottom: 40px;
  justify-content: center;
  align-items: center;
`;

const SearchingText = styled.Text`
  font-size: 28px;
  font-weight: bold;
  line-height: 28px;
  color: ${Color.Button.Background};
`;

export const AnimatedBottomView: React.FC<AnimatedBottomViewProps> = ({
  children,
}) => {
  const soundObject = new Audio.Sound();

  const [isOnline, updateOnline] = useState(false);

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

  return (
    <BackgroundView>
      {!isOnline && (
        <OnlineButton onPress={onOnlinePress}>
          <OnlineText>GO</OnlineText>
        </OnlineButton>
      )}

      {isOnline && (
        <SearchingTextWrapper>
          <SearchingText>Searching</SearchingText>
        </SearchingTextWrapper>
      )}
    </BackgroundView>
  );
};
