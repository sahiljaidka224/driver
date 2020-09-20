import moment from "moment";

export const greetingsBasedOnTime = () => {
  const hours = parseInt(moment().format("HH"));

  if (hours >= 5 && hours < 12) {
    return "Good Morning 🌞";
  }

  if (hours >= 12 && hours < 17) {
    return "Good Afternoon 🕛";
  }

  if (hours >= 17 && hours <= 19) {
    return "Good Evening 🌇";
  }

  return "Hello 🤙🏽";
};
