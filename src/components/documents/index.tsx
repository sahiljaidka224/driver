import * as Permissions from "expo-permissions";

import { Color } from "../../constants/Theme";
import React from "react";
import { SafeAreaView } from "react-native";
import { UploadView } from "./upload-view";
import styled from "styled-components/native";

const BackgroundView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Color.BackgroundView.Background};
  align-items: center;
`;

const documentTypes = [
  {
    type: "licenseFront",
    readable: "License Front",
    key: "1",
  },
  {
    type: "licenseBack",
    readable: "License Back",
    key: "2",
  },
];

export const DocumentsView = () => {
  const getPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  React.useEffect(() => {
    getPermissions();
  }, []);

  return (
    <BackgroundView>
      {documentTypes.map((doc) => {
        const { type, readable, key } = doc;
        return <UploadView type={type} readable={readable} key={key} />;
      })}
    </BackgroundView>
  );
};
