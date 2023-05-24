import React, { useContext } from "react";
import ImputationsHoursComponent from "../CalculateHours";
import ProfileComponent from "../Profile";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { UserContext } from "../UserContext";

const NavigationComponent = () => {
  const { user } = useContext(UserContext);
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" options={{ headerShown: false }}>
          {() => <Tabs user={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Tabs = ({ user }) => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Perfil"
        component={ProfileComponent}
        options={{
          tabBarLabel: "Perfil",
        }}
      />
      <Tab.Screen
        name="Imputación horas"
        component={ImputationsHoursComponent}
        options={{
          tabBarLabel: "Imputación",
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationComponent;
