import { Color } from '../../../constants/Theme';
import { Feather } from "@expo/vector-icons";
import React from 'react';
import styled from 'styled-components/native';

type CurrentLocProps = {
    navigateToCurrentLoc: () => void;
}

const CurrentLocationView = styled.TouchableOpacity`
  background: white;
  width: 42px;
  height: 42px;
  position: absolute;
  right: 20px;
  bottom: 16%;
  border-radius: 21px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${Color.Button.Background};
`;

export const CurrentLocation: React.FC<CurrentLocProps> = ({navigateToCurrentLoc}) => {
  return (
    <CurrentLocationView
      onPress={navigateToCurrentLoc}
      style={{
        shadowColor: `${Color.Shadow.Color}`,
        shadowOpacity: 0.2,
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 4,
      }}
    >
      <Feather name="navigation-2" color={Color.Button.Background} size={24} />
    </CurrentLocationView>
  );
};