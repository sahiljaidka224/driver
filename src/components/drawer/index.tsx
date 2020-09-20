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

const optionsList = [
  {
    title: "Your trips",
  },
  {
    title: "Payment",
  },
  {
    title: "Settings",
  },
];

type Props = DrawerProps & NavigationProp<any, any>;

export const DrawerComp: React.FC<Props> = (props) => {
  return (
    <Container>
      <ImageWrapper source={Icons.driverDefault} resizeMode="contain" />
      <GreetingsWrapper>Hello</GreetingsWrapper>
      <Name>Pedro</Name>
      <MenuWrapper>
        {optionsList.map((ol) => {
          const { title } = ol;
          return (
            <DrawerItem
              label={title}
              onPress={() => {
                //   props.navigation.navigate("EnterPhoneNumber")

              }}
              labelStyle={styles.list}
            />
          );
        })}
      </MenuWrapper>
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
