export const getAddressFromLatLong = async (lat: Number, lng: Number) => {
    const address = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDDGCRsdawsguNpqCvTI-zlgCBDz2H8zVY&language=en`
    );

    return address.json();
};
