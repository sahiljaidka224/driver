import { Dimensions } from 'react-native';

export const iphone6OrGreater = () => {
    return Dimensions.get('window').width > 375 ? true : false;
}