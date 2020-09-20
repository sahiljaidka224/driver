import { KeyboardAvoidingView } from "react-native";
import React from "react";
import styled from "styled-components/native";

type EditDetailsProps = {
  name?: string;
  phone?: string;
  email?: string;
};

const BackgroundView = styled.SafeAreaView`
  flex: 1;
  background: #fff;
`;

const Wrapper = styled.TouchableWithoutFeedback`
  background: red;
`;

export const EditDetails: React.FC<EditDetailsProps> = ({
  name,
  phone,
  email,
}) => {
  return (
    <BackgroundView>
      <KeyboardAvoidingView>
        <Wrapper />
      </KeyboardAvoidingView>
    </BackgroundView>
  );
};
