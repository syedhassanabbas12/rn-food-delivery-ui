import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  HomeTab: undefined;
  CartTab: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  RestaurantDetail: {
    restaurantId: string;
  };
  OrderTracking: undefined;
};



