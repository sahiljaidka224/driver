import * as Location from "expo-location";

import { BOOKING_MUTATION, GET_NEARBY_DRIVERS } from "./queriesAndMutations";
import { Dimensions, SafeAreaView, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import React, { useState } from "react";
import {
  useLazyQuery,
  useMutation,
} from "@apollo/react-hooks";

import { BookingView } from "./components/booking-view";
import { Color } from "../../constants/Theme";
import { GET_TRIPPRICE_BASEDON_LOCATION } from "../enter-destination/queriesAndMutations";
import { Icons } from "../../constants/icons";
import { InitalView } from "./components/initial-view";
import { MenuButton } from "../Common/MenuButton";
import { NavigationProp } from "@react-navigation/native";
import { Point } from "react-native-google-places-autocomplete";
import { RoutesView } from "./components/routes-view";
import { ScreenState } from "../../../overmind/state";
import { getAddressFromLatLong } from "../../utils/address-based-on-latlng";
import { getPolyline } from "../../utils/polyline";
import { getReadableAddress } from "../../utils/get-readable-address";
import { mapStyle } from "../../constants/MapStyle";
import styled from "styled-components/native";
import { useOvermind } from "../../../overmind";

interface BookingScreenProps {
  navigation: NavigationProp<any, any>;
}

export type Coords = { latitude: number; longitude: number };

const BackgroundView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Color.BackgroundView.Background};
`;

const MenuButtonWrapper = styled.View`
  margin-left: 25px;
  margin-top: 25px;
`;

const Map = styled(MapView)`
  width: ${Dimensions.get("window").width}px;
  height: ${Dimensions.get("window").height}px;
  flex: 1;
  position: absolute;
`;

const WhereToWrapper = styled.View`
  position: absolute;
  bottom: 0;
  min-width: 90%;
  height: auto;
  background-color: #fafafa;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  display: flex;
  left: 10px;
  right: 10px;

  box-shadow: 0px -20px 20px rgba(0, 0, 0, 0.051);
  /* TODO: above */
`;

const MarkerDot = styled.View`
  background-color: #2ecb70;
  width: 18px;
  height: 18px;
  border-radius: 9px;
`;

const MarkerCar = styled.Image`
  width: 40px;
  height: 40px;
`;

const DestinationMarkerWrapper = styled(TouchableOpacity)`
  width: 164px;
  height: 48px;
  padding: 5px;
  max-width: 164px;
  max-height: 48px;
  align-items: center;
  justify-content: center;
  display: flex;
  background-color: #0e1823;
  border-radius: 20px;
  flex-direction: row;
`;

const DestMarkerImage = styled.Image`
  width: 43px;
  height: 43px;
  margin-left: 6px;
`;

const DestMarkerText = styled.Text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  font-family: "SFPro-Regular";
  color: #fff;
  flex: 1;
  margin-left: 3px;
`;

const EditDest = styled.Image`
  width: 13px;
  height: 16px;
  margin-left: 3px;
  margin-right: 3px;
`;

export const BookingScreen: React.FC<BookingScreenProps> = ({ navigation }) => {
  const { state, actions } = useOvermind();
  const { source, destination, bookingScreenState } = state;
  const [bookingInProg, updateBookingInProgress] = React.useState<boolean>(
    false
  );

  const [coords, updateCoords] = useState<[Coords]>();
  const mapRef = React.useRef<MapView>(null);

  const [getDrivers, { loading, data, error }] = useLazyQuery(
    GET_NEARBY_DRIVERS,
    {
      pollInterval: 60000,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  const [
    getTripPrice,
    { loading: tripPriceLoading, error: tripPriceErr, data: tripPriceData },
  ] = useLazyQuery(GET_TRIPPRICE_BASEDON_LOCATION, {
    onCompleted: (completedData) => {
      console.log({ completedData });
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const [
    requestBooking,
    { loading: bookingLoading, error: bookingReqError, data: bookingReqData },
  ] = useMutation(BOOKING_MUTATION, {
    onCompleted: () => {
      updateBookingInProgress(true);
      actions.updateBookingScreenState(ScreenState.SEARCHING);
    },
  });

  const updateRoute = (coordinates: [Coords]) => {
    updateCoords(coordinates);
  };

  console.log({ bookingReqData, coords });

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }
      await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      }).then((locationData) => {
        getDrivers({
          variables: {
            cords: [
              locationData.coords.longitude,
              locationData.coords.latitude,
            ],
          },
        });

        if (mapRef && mapRef.current && locationData) {
          mapRef.current?.animateToRegion({
            latitude: locationData.coords.latitude ?? 0,
            longitude: locationData.coords.longitude ?? 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }

        async function getAddress() {
          const address = await getAddressFromLatLong(
            locationData.coords.latitude,
            locationData.coords.longitude
          );

          if (address && address.results && address.results.length > 0) {
            const results = address.results[0];

            if (!results) return;

            let result = results.formatted_address;

            const location: Point =
              results.geometry && results.geometry.location
                ? results.geometry.location
                : undefined;

            actions.updateSource({ readable: result, location });
          }
        }

        if (!source) getAddress();
      });
    })();

    async function showPolyline() {
      if (!source?.location || !destination?.location) return;
      const coordinates = await getPolyline(
        source?.location,
        destination?.location
      );

      updateCoords(coordinates);
      actions.updateBookingScreenState(ScreenState.ROUTES);

      if (mapRef && coordinates && coordinates.length > 1) {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 20,
            right: 20,
            bottom: 250,
            left: 20,
          },
          animated: true,
        });
      }
      getTripPriceFromDb();
    }

    if (source && destination) showPolyline();
  }, [source, destination]);

  const getTripPriceFromDb = () => {
    if (!source || !destination) return console.log("No source or dest");

    if (!source.location || !source.location.lat || !source.location.lng)
      return console.log("No source data");

    if (
      !destination.location ||
      !destination.location.lat ||
      !destination.location.lng
    )
      return console.log("No dest data");
    //TODO: show error;
    getTripPrice({
      variables: {
        sourceLat: source.location.lat,
        sourceLng: source.location.lng,
        destinationLat: destination.location.lat,
        destinationLng: destination.location.lng,
      },
    });
  };

  const onCancel = () => {
    updateCoords(undefined);
    actions.updateBookingScreenState(ScreenState.INITIAL);
    actions.updateDestination(undefined);

    if (mapRef && mapRef.current && source) {
      mapRef.current?.animateToRegion({
        latitude: source.location.lat ?? 0,
        longitude: source.location.lng ?? 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <BackgroundView>
      <Map
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        showsUserLocation={true}
        ref={mapRef}
        zoomEnabled={true}
      >
        {(bookingScreenState === ScreenState.INITIAL ||
          bookingScreenState === ScreenState.ROUTES) &&
          data &&
          data.findNearByDrivers &&
          data.findNearByDrivers.map((driver) => (
            <Marker
              key={driver._id}
              coordinate={{
                latitude: driver?.location[1] ?? 0,
                longitude: driver?.location[0] ?? 0,
              }}
            >
              <MarkerCar
                key={`marker-${driver._id}`}
                source={require("../../../assets/MarkerCar.png")}
                resizeMode="contain"
              />
            </Marker>
          ))}
        {(bookingScreenState === ScreenState.ROUTES ||
          bookingScreenState === ScreenState.DRIVER_ASSIGNED) &&
          coords &&
          coords.length > 1 &&
          coords.map((coord, index) => {
            if (index === 0) {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: coord.latitude ?? 0,
                    longitude: coord?.longitude ?? 0,
                  }}
                >
                  <MarkerDot />
                </Marker>
              );
            }

            if (index === coords.length - 1) {
              if (bookingScreenState === ScreenState.DRIVER_ASSIGNED) {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: coord.latitude ?? 0,
                      longitude: coord?.longitude ?? 0,
                    }}
                  >
                    <MarkerCar
                      key={`marker-${index}`}
                      source={require("../../../assets/MarkerCar.png")}
                      resizeMode="contain"
                    />
                  </Marker>
                );
              }
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: coord.latitude ?? 0,
                    longitude: coord?.longitude ?? 0,
                  }}
                  onPress={() => navigation.navigate("EnterDestination")}
                >
                  <DestinationMarkerWrapper
                    onPress={() => navigation.navigate("EnterDestination")}
                  >
                    <DestMarkerImage
                      source={Icons.destCar}
                      resizeMode="contain"
                    />
                    <DestMarkerText>
                      {getReadableAddress(destination?.readable ?? "")}
                    </DestMarkerText>
                    <EditDest source={Icons.edit} resizeMode="contain" />
                  </DestinationMarkerWrapper>
                </Marker>
              );
            }
          })}
        {(bookingScreenState === ScreenState.ROUTES ||
          bookingScreenState === ScreenState.DRIVER_ASSIGNED) &&
          coords &&
          coords.length > 1 && (
            <Polyline
              key={Math.random()}
              strokeWidth={4}
              strokeColor="#2ECB70"
              coordinates={coords ? coords : []}
            />
          )}
      </Map>
      <MenuButtonWrapper>
        {coords && bookingScreenState === ScreenState.ROUTES ? (
          <MenuButton
            onClick={onCancel}
            source={Icons.cross}
            isLoading={tripPriceLoading}
          />
        ) : (
          <MenuButton
            onClick={() => navigation.openDrawer()}
            source={Icons.drawer}
            isLoading={tripPriceLoading || bookingLoading}
          />
        )}
      </MenuButtonWrapper>
      <WhereToWrapper>
        {!coords && ScreenState.INITIAL === bookingScreenState && (
          <InitalView navigation={navigation} />
        )}
        {bookingScreenState === ScreenState.ROUTES &&
          coords &&
          tripPriceData &&
          tripPriceData.getTripPriceBasedOnLatLng && (
            <RoutesView
              key={Math.random()}
              distance={tripPriceData.getTripPriceBasedOnLatLng.distance ?? 0}
              duration={tripPriceData.getTripPriceBasedOnLatLng.duration ?? 0}
              options={
                tripPriceData.getTripPriceBasedOnLatLng.fare ?? undefined
              }
              requestBooking={requestBooking}
            />
          )}
        {bookingReqData &&
          bookingReqData.createBooking &&
          bookingReqData.createBooking.id &&
          bookingInProg && (
            <BookingView
              bookingId={bookingReqData.createBooking.id}
              updateRoute={updateRoute}
            />
          )}
      </WhereToWrapper>
    </BackgroundView>
  );
};
