import React from "react";
import CheckHoursComponent from "../CheckHours";
import ProfileComponent from "../Profile";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import ImputationsHoursComponent from "../CalculateHours";
import { Ionicons } from "@expo/vector-icons";

const NavigationComponent = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ImputationsHoursComponent"
          component={ImputationsHoursComponent}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Tabs = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarVisible: false,
        headerShown: false,
        tabBarActiveTintColor: "#82C1C6",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Imputación horas"
        component={CheckHoursComponent}
        options={{
          tabBarLabel: "Horas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileComponent}
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-sharp" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationComponent;
