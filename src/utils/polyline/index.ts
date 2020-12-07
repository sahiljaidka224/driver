import * as Location from "expo-location";

import Axios from "axios";
import { Point } from "react-native-google-places-autocomplete";
import polyline from "@mapbox/polyline";

export const getPolyline = async (source: Point, destination: Point) => {
  if (!source || !destination) return;

  if (!source.lat || !source.lng || !destination.lat || !destination.lng)
    return;

  const directions = await Axios.get(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${source?.lat},${source?.lng}&destination=${destination?.lat},${destination?.lng}&mode=driving&key=AIzaSyDDGCRsdawsguNpqCvTI-zlgCBDz2H8zVY`
  );

  if (!directions || !directions.data) return;

  const directionsData = directions.data;

  if (!directionsData.routes || directionsData.routes.length === 0) return;

  const routes = directionsData.routes[0];

  const points = polyline.decode(routes.overview_polyline.points);
  const coordinates = points.map((point: Number[]) => {
    return {
      latitude: point[0],
      longitude: point[1],
    };
  });

  return coordinates;
};


export const getCurrentLocation = async () => {
  const location = await Location.getCurrentPositionAsync({
    enableHighAccuracy: true,
  });

  return {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };
};
