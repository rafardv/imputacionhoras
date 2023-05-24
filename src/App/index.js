import React, { useContext } from "react";
import { View } from "react-native";
import LoginComponent from "./Login";
import NavigationComponent from "./Navigation";
import { UserContext } from "./UserContext";

const ContentMain = () => {
  const { user } = useContext(UserContext);
  return (
    <View>{user === null ? <NavigationComponent /> : <LoginComponent />}</View>
  );
};

export default ContentMain;
