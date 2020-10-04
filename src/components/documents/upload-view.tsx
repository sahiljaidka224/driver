import * as ImagePicker from "expo-image-picker";

import { ActivityIndicator } from "react-native";
import { Color } from "../../constants/Theme";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { ReactNativeFile } from "apollo-upload-client";
import { UPLOAD_DOC } from "./queriesAndMutations";
import styled from "styled-components/native";
import { useMutation } from "@apollo/react-hooks";

type Props = {
  type: string;
  readable: string;
};

const BackgroundView = styled.View`
  width: 90%;
  height: auto;
  border: 2px solid ${Color.Button.Background};
  justify-content: space-between;
  padding: 15px;
  border-radius: 10px;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ImageWrapper = styled.Image`
  width: 40px;
  height: 40px;
`;

const Error = styled.Text`
  font-size: 14px;
  font-family: "SFPro-Regular";
  color: red;
  margin: 0 auto;
  margin-bottom: 15px;
`;

const Desc = styled.Text`
  font-size: 16px;
  font-family: "SFPro-Regular";
  color: ${Color.Text.Normal.Color};
  margin: 0 auto;
`;

export const UploadView: React.FC<Props> = ({ type, readable }) => {
  const [uploadImage, { loading, error, data }] = useMutation(UPLOAD_DOC);

  console.log({ data });

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        return result;
      }
    } catch (E) {
      console.log(E);
    }
  };

  const createRNFile = async () => {
    const image = await pickImage();
    return image
      ? new ReactNativeFile({
          uri: image.uri,
          type: "image/png",
          name: readable,
        })
      : null;
  };

  const onUpload = async () => {
    const file = await createRNFile();
    if (!file) return;
    await uploadImage({
      variables: { file: file, name: type },
    });
  };

  const ImageComp = () => {
      if (data && data.uploadDriverDocs && data.uploadDriverDocs.url) {
          return <ImageWrapper source={{uri: data.uploadDriverDocs.url}} resizeMode="contain"/>
      }
      return <ImageWrapper source={require("../../../assets/Car.png")} />;
  }

  return (
    <>
      <BackgroundView>
        <FontAwesome
          name="plus-circle"
          size={32}
          onPress={onUpload}
          color={Color.Button.Background}
        />

        <Desc>{`${data ? "Success" : `Upload ${readable}`}`}</Desc>

        {loading && !data ? <ActivityIndicator size="small" /> : <ImageComp />}
      </BackgroundView>
      {<Error>{error ? "Please try again" : ""}</Error>}
    </>
  );
};
