import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import { BookingState, CurrentBooking } from "../../../overmind/state";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useRef, useState } from "react";
import {
  SUBSCRIBE_TO_BOOKING,
  UPDATE_EXPO_PUSHTOKEN,
} from "./queriesAndMutations";
import { useMutation, useSubscription } from "@apollo/react-hooks";

import { AnimatedBottomView } from "./components/animated-bottom-view";
import { BookingNotification } from "./components/booking-notification";
import { BookingView } from "./components/booking-view";
import { Color } from "../../constants/Theme";
import { CurrentLocation } from "./components/current-location";
import { Icons } from "../../constants/icons";
import { MenuButton } from "../Common/MenuButton";
import { NavigationProp } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { getPolyline } from "../../utils/polyline";
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

export const BookingScreen: React.FC<BookingScreenProps> = ({ navigation }) => {
  const [coords, updateCoords] = useState<[Coords]>();
  const mapRef = useRef<MapView>(null);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const { state, actions } = useOvermind();
  const { currentBooking } = state;
  const [updateExpoPushToken] = useMutation(UPDATE_EXPO_PUSHTOKEN);

  const { data: newBookingData, loading, error } = useSubscription(
    SUBSCRIBE_TO_BOOKING,
    {
      onSubscriptionData: async ({ subscriptionData }) => {
        if (subscriptionData.data) {
          console.log({ subscriptionData });
          const { bookingCreated } = subscriptionData.data;

          if (!bookingCreated) return;

          const {
            sourceLatLng,
            destLatLng,
            id,
            sourceAddress,
            destAddress,
            type,
          } = bookingCreated;

          if (id) {
            const currentBook: CurrentBooking = {
              id: id,
              sourceAddress: {
                readable: sourceAddress,
                location: sourceLatLng,
              },
              destinationAddress: {
                readable: destAddress,
                location: destLatLng,
              },
              type: type,
              status: BookingState.REQUESTED,
            };
            actions.updateCurrentBooking(currentBook);
          }

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
      async (notification) => {
        console.log({ notification });
        if (notification) {
          if (!notification.request) return;

          if (!notification.request.content) return;
          if (!notification.request.content.data) return;
          const data = notification.request.content.data;
          if (!data.body) return;

          if (!data.body.bookingData) return;

          const { bookingData } = data.body;

          const {
            sourceLatLng,
            destLatLng,
            id,
            sourceAddress,
            destAddress,
            type,
          } = bookingData;

          if (id) {
            const currentBook: CurrentBooking = {
              id: id,
              sourceAddress: {
                readable: sourceAddress,
                location: sourceLatLng,
              },
              destinationAddress: {
                readable: destAddress,
                location: destLatLng,
              },
              type: type,
              status: BookingState.REQUESTED,
            };
            actions.updateCurrentBooking(currentBook);
          }

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
      </Map>
      {currentBooking &&
        (currentBooking.status === BookingState.DRIVER_ASSIGNED ||
          currentBooking?.status === BookingState.DRIVER_ARRIVED ||
          currentBooking?.status === BookingState.STARTED) && (
          <WhereToWrapper>
            <BookingView
              bookingId={currentBooking?.id ?? ""}
              updateRoute={() => {}}
            />
          </WhereToWrapper>
        )}
      {currentBooking &&
        currentBooking.id &&
        currentBooking.status === BookingState.REQUESTED && (
          <BookingNotification
            bookingId={currentBooking.id}
            sourceAddress={currentBooking.sourceAddress.readable}
            destAdress={currentBooking.destinationAddress.readable}
            bookingType={currentBooking.type}
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
      {!currentBooking && <AnimatedBottomView />}
      {!currentBooking && (
        <CurrentLocation navigateToCurrentLoc={getLocationPermission} />
      )}
      <StatusBar style="auto" />
    </BackgroundView>
  );
};
