import { Color } from "../../../constants/Theme";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { getReadableAddress } from "../../../utils/get-readable-address";
import { greetingsBasedOnTime } from "../../../utils/GreetingsBasedOnCurrentTime";
import styled from "styled-components/native";
import { useOvermind } from "../../../../overmind";

interface InitialViewProps {
  navigation: NavigationProp<any, any>;
}

const GreetingsText = styled.Text`
  font-size: 22px;
  font-family: "SFPro-Regular";
  margin-top: 20px;
  margin-left: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${Color.Text.Normal.Color};
  font-style: normal;
`;

const WhereToTextWrapper = styled(TouchableOpacity)`
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid rgba(112, 112, 112, 0.2);
  width: 90%;
  height: 100px;
  border-radius: 20px;
  justify-content: center;
  margin-bottom: 40px;
  padding: 18px 0px 18px 0px;
`;

const LocationText = styled.Text`
  font-family: "SFPro-Regular";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  margin: 0 18px;
  min-height: 19px;
`;

const HorizontalLine = styled.View<{ margin?: boolean }>`
  border: 0.6px solid rgba(112, 112, 112, 0.2);
  width: 90%;
  margin: ${(props) => (props.margin ? `14px auto` : "4px auto")};
`;

export const InitalView: React.FC<InitialViewProps> = ({ navigation }) => {
  const { state } = useOvermind();
  const { source } = state;

  const moveToEnterDestinationScreen = () => {
    navigation.navigate("EnterDestination");
  };
  const readableAddress =
    source && source?.readable
      ? getReadableAddress(source?.readable)
      : "Current location";

  return (
    <>
      <GreetingsText>{greetingsBasedOnTime()}</GreetingsText>
      <WhereToTextWrapper
        onPress={moveToEnterDestinationScreen}
        style={{
          shadowColor: `${Color.Shadow.Color}`,
          shadowOpacity: 0.05,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowRadius: 4,
        }}
      >
        <LocationText key="1">{readableAddress}</LocationText>
        <HorizontalLine margin={true} />
        <LocationText key="3">Where to?</LocationText>
      </WhereToTextWrapper>
    </>
  );
};
