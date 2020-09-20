import { Color } from "../../constants/Theme";
import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

type Props = {
  name: string;
};

const OptionTextWrapper = styled(TouchableOpacity)<{ selected: boolean }>`
  margin: 15px;
  padding: 10px 10px 0px 10px;
  min-height: 30px;
  height: auto;
  width: 50%;
  border-radius: 20px;
  background: ${({ selected }) => (selected ? "#cbcbcb" : "transparent")};
`;

const Option = styled.Text`
  color: ${Color.Text.Normal.Color};
  font-family: "SFPro-Regular";
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 10px;
`;

export const ListOption: React.FC<Props> = ({ name }) => {
  const [selected, updateSelected] = React.useState<boolean>(false);
  return (
    <OptionTextWrapper
      selected={selected}
      onPressIn={() => {
        updateSelected(true);
      }}
      onPressOut={() => {
        updateSelected(false);
      }}
      onPress={() => {}}
    >
      <Option>{name}</Option>
    </OptionTextWrapper>
  );
};
