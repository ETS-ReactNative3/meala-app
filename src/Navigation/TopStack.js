import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import LocalizationContext from '../../LanguageContext';
import NewsScreen from '../Screens/News/NewsScreen';
import AppBottomNavigationStack from './AppBottomNavigator';
import OnboardingScreen from '../Screens/OnboardingScreen';

function TopStack(props) {
  const { t } = React.useContext(LocalizationContext);
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {props.onboarding && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}

      <Stack.Screen name="Home" component={AppBottomNavigationStack} />
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
    </Stack.Navigator>
  );
}

export default TopStack;
