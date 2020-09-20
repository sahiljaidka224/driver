export const getReadableAddress = (address: string) => {
  if (address && address.length > 0) {
    const temp = address.split(",");

    if (temp.length > 0) {
      return temp[0];
    }
  }

  return "";
};
