import { SafeAreaView, StyleSheet } from "react-native";

import { Color } from "../../constants/Theme";
import { DrawerItem } from "@react-navigation/drawer";
import { Icons } from "../../constants/icons";
import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { setToken } from "../../../auth";
import styled from "styled-components/native";

type DrawerProps = {
  name: string;
};

const Container = styled(SafeAreaView)`
  flex: 1;
`;

const ImageWrapper = styled.Image`
  margin-top: 30px;
  width: 68px;
  height: 68px;
  border-radius: 34px;
  margin-left: 25px;
`;

const GreetingsWrapper = styled.Text`
  margin-left: 25px;
  margin-top: 15px;
  font-family: "SFPro-Regular";
  font-size: 35px;
  color: ${Color.Text.Normal.Color};
`;

const Name = styled.Text`
  margin-left: 25px;
  font-family: "SFPro-Regular";
  font-size: 20px;
  color: ${Color.Text.Normal.Color};
`;

const MenuWrapper = styled.View`
  padding: 10px 20px 20px 20px;
  flex: 1;
  margin-top: 10px;
`;

const SignOutWrapper = styled.TouchableOpacity`
  background: #e5e5e5;
  height: 50px;
  justify-content: center;
  max-width: 40%;
  margin-left: 25px;
  border-radius: 20px;
  margin-bottom: 20px;
  align-items: center;
`;

const SignOutText = styled.Text`
  font-family: "SFPro-Regular";
  font-size: 18px;
  color: ${Color.Text.Normal.Color};
`;

const optionsList = [
  {
    title: "Your rides",
    id: "1",
    screen: "YourRides",
  },
  {
    title: "Payment",
    id: "2",
    screen: "PaymentsView",
  },
  {
    title: "Settings",
    id: "3",
    screen: "EditAccount",
  },
];

type Props = DrawerProps & NavigationProp<any, any>;

export const DrawerComp: React.FC<Props> = (props) => {
  const onSignoutPress = () => {
    setToken("");
    props.navigation.replace("Main");
  };

  return (
    <Container>
      <ImageWrapper source={Icons.driverDefault} resizeMode="contain" />
      <GreetingsWrapper>Hello</GreetingsWrapper>
      <Name>Pedro</Name>
      <MenuWrapper>
        {optionsList.map((ol) => {
          const { title, id, screen } = ol;
          return (
            <DrawerItem
              key={id}
              label={title}
              onPress={() => {
                props.navigation.navigate(screen);
              }}
              labelStyle={styles.list}
              activeBackgroundColor="red"
              inactiveBackgroundColor="white"
            />
          );
        })}
      </MenuWrapper>
      <SignOutWrapper onPress={onSignoutPress}>
        <SignOutText>Sign out</SignOutText>
      </SignOutWrapper>
    </Container>
  );
};

const styles = StyleSheet.create({
  list: {
    color: "#0E1823",
    fontFamily: "SFPro-Regular",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 15,
    lineHeight: 19,
    marginBottom: 10,
  },
});
