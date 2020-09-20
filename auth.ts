import * as SecureStore from "expo-secure-store";

export const setToken = (token: string) =>
  SecureStore.setItemAsync("token", token);

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    SecureStore.getItemAsync("token")
      .then((res) => {
        if (res !== null && res.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => reject(err));
  });
};
