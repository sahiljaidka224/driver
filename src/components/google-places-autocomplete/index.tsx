import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputChangeEventData,
  TextInputEndEditingEventData,
} from "react-native";

import { AddressData } from "../enter-destination";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React from "react";

interface AutoCompleteProps {
  address?: string;
  placeholder?: string;
  autoFocus?: boolean;
  updateAddress?: (data: AddressData) => void;
  margin?: boolean;
}

export const AddressAutocomplete: React.FC<AutoCompleteProps> = ({
  address,
  placeholder,
  autoFocus,
  updateAddress,
  margin,
}) => {
  const [selectedAddress, updateSelectedAddress] = React.useState(address);

  const onChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const { text } = event.nativeEvent;

    updateSelectedAddress(text);
  };

  const onEndEditing = (
    event: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    const { text } = event.nativeEvent;

    if (text.length === 0) {
      updateSelectedAddress(address);
    }
  };

  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      fetchDetails={true}
      onPress={(data, details = null) => {
        updateSelectedAddress(data.description);

        if (details && details.geometry && details.geometry.location) {
          const latlng = details.geometry.location;
          const readableAddress = data.description;

          if (updateAddress) {
            updateAddress({
              readable: readableAddress,
              location: latlng,
            });
          }
        }
      }}
      query={{
        key: "AIzaSyDDGCRsdawsguNpqCvTI-zlgCBDz2H8zVY",
        language: "en",
        rankby: "distance",
        radius: 50,
        location: "2",
        components: "country:au",
      }}
      scrollEnabled={true}
      listViewDisplayed={true}
      nearbyPlacesAPI="GooglePlacesSearch"
      textInputProps={{
        onChange: onChange,
        value: selectedAddress,
        onEndEditing: onEndEditing,
      }}
      enablePoweredByContainer={false}
      styles={{
        ...styles,
        listView: {
          width: "100%",
          minHeight: "50%",
          position: "absolute",
          left: -10,
          top: margin ? 110 : 50,
          elevation: 10,
        },
      }}
      autoFocus={autoFocus}
      GooglePlacesSearchQuery={{
        rankby: "distance",
      }}
      filterReverseGeocodingByTypes={[
        "locality",
        "administrative_area_level_1",
      ]}
    />
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    backgroundColor: "rgba(0,0,0,0)",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 0,
  },
  textInput: {
    borderStyle: "solid",
    borderColor: "rgba(135,135,135, 0.3)",
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 25,
    borderRadius: 22.5,
    height: 45,
    color: "#5d5d5d",
    backgroundColor: "rgba(135,135,135, 0.13)",
    fontSize: 15,
    paddingLeft: 20,
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
});
