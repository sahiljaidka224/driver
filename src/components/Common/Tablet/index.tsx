import {
  Image,
  ImageRequireSource,
  Text,
  TouchableOpacity,
} from "react-native";

import { Color } from "../../../constants/Theme";
import React from "react";
import styled from "styled-components/native";

interface TabletButtonProps {
  onClick: () => void;
  selected?: boolean;
  optionText: string;
  imageSource: ImageRequireSource;
}

const Wrapper = styled(TouchableOpacity)<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  max-width: 120px;
  max-height: 50px;
  background-color: ${(props) =>
    props.selected ? Color.Button.Background : 'transparent'};
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  padding: 2px 15px;
  border: ${(props) =>
    props.selected ? '1px solid #000000' : 'none'};
`;

const ImageWrapper = styled(Image)`
  max-height: 30px;
  max-width: 60px;
  align-items: flex-end;
  justify-content: center;
`;

const TextWrapper = styled(Text)<{ selected: boolean }>`
  font-family: "SFPro-Regular";
  font-weight: 100;
  font-size: 16px;
  padding-bottom: 6px;
  color: ${(props) => (props.selected ? "#ffffff" : Color.Text.Normal.Color)};
`;

export const TabletButton: React.FC<TabletButtonProps> = ({
  onClick,
  selected = false,
  optionText,
  imageSource,
}) => {
  return (
    <Wrapper
      selected={selected}
      style={{
        shadowColor: `${Color.Shadow.Color}`,
        shadowOpacity: 0.4,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowRadius: 4,
      }}
    >
      <ImageWrapper source={imageSource} resizeMode="contain" />
      <TextWrapper selected={selected}>{optionText}</TextWrapper>
    </Wrapper>
  );
};
