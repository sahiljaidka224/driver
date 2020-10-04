import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import {
  Dimensions,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import React, { useRef, useState } from "react";
import {
  SUBSCRIBE_TO_BOOKING,
  UPDATE_EXPO_PUSHTOKEN,
} from "./queriesAndMutations";
import {
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/react-hooks";

import { BookingNotification } from "./components/booking-notification";
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

type Subscription = {
  remove: () => void;
};

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
  const [bookingInProg, updateBookingInProgress] = useState<boolean>(false);
  const [coords, updateCoords] = useState<[Coords]>();
  const mapRef = useRef<MapView>(null);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  const [updateExpoPushToken] = useMutation(UPDATE_EXPO_PUSHTOKEN);

  const { data: newBookingData, loading, error } = useSubscription(
    SUBSCRIBE_TO_BOOKING,
    {
      onSubscriptionData: async ({ subscriptionData }) => {
        if (subscriptionData.data) {
          console.log({ subscriptionData });
          const { bookingCreated } = subscriptionData.data;

          if (!bookingCreated) return;

          const { sourceLatLng, destLatLng } = bookingCreated;

          if (sourceLatLng && destLatLng) {
            const coordinates = await getPolyline(sourceLatLng, destLatLng);
            updateCoords(coordinates);

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
          }
        }
      },
    }
  );

  const getPushNotificationsPermissions = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert(
        "Please allow notification permissions from settings in order to take full advantage of the app."
      );
      return;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync();

    console.log({ pushToken });

    if (pushToken) {
      updateExpoPushToken({
        variables: {
          pushToken: pushToken.data,
          userType: "driver",
        },
      });
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  const getLocationPermission = async () => {
    const { status: existingStatus } = await Location.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Location.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert(
        "Please allow location permissions from settings in order to take full advantage of the app."
      );
      return;
    }

    await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    }).then((locationData) => {
      if (mapRef && mapRef.current && locationData) {
        mapRef.current?.animateToRegion({
          latitude: locationData.coords.latitude ?? 0,
          longitude: locationData.coords.longitude ?? 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    });
  };

  React.useEffect(() => {
    getLocationPermission();
    getPushNotificationsPermissions();

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log({ notification });
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log({ response });
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current as Subscription
      );
      Notifications.removeNotificationSubscription(
        responseListener.current as Subscription
      );
    };
  }, []);

  const onCancel = () => {
    updateCoords(undefined);

    // if (mapRef && mapRef.current && source) {
    //   mapRef.current?.animateToRegion({
    //     latitude: source.location.lat ?? 0,
    //     longitude: source.location.lng ?? 0,
    //     latitudeDelta: 0.0922,
    //     longitudeDelta: 0.0421,
    //   });
    // }
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
        {coords &&
          coords.length > 1 &&
          coords.map((coord, index) => {
            if (index === 0 || index === coords.length - 1) {
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
          })}
        {coords && coords.length > 1 && (
          <Polyline
            key={Math.random()}
            strokeWidth={4}
            strokeColor="#2ECB70"
            coordinates={coords ? coords : []}
          />
        )}
      </Map>
      {newBookingData &&
        newBookingData.bookingCreated &&
        newBookingData.bookingCreated.id && (
          <BookingNotification
            bookingId={newBookingData.bookingCreated.id}
            sourceAddress={newBookingData.bookingCreated.sourceAddress}
            destAdress={newBookingData.bookingCreated.destAddress}
            bookingType={newBookingData.bookingCreated.type}
          />
        )}
      <MenuButtonWrapper>
        {
          <MenuButton
            onClick={() => navigation.openDrawer()}
            source={Icons.drawer}
            isLoading={false}
          />
        }
      </MenuButtonWrapper>
    </BackgroundView>
  );
};
