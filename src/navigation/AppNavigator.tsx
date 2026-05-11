import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import { colors } from '../theme';
import { SplashScreen } from '../screens/SplashScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { RestaurantDetailScreen } from '../screens/RestaurantDetailScreen';
import { OrderTrackingScreen } from '../screens/OrderTrackingScreen';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
        <Stack.Screen
          name="OrderTracking"
          component={OrderTrackingScreen}
          options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


