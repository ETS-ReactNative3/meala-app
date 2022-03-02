import React from "react";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import LocalizationContext from "../../LanguageContext";
import NewsScreen from "../Screens/News/NewsScreen";
import AppBottomNavigationStack from "./AppBottomNavigator";
import OnboardingScreen from "../Screens/OnboardingScreen";
import { WelcomeView } from "../Screens/WelcomeView";

const TopStack = (props) => {
  const { t } = React.useContext(LocalizationContext);
  const Stack = createNativeStackNavigator();
  const { onboarding } = props;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome View" component={WelcomeView} />


      <Stack.Screen name="Home" component={AppBottomNavigationStack} />
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
    </Stack.Navigator>
  );
};

export default TopStack;
