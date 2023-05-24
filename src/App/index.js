import React, { useContext } from "react";
import { View } from "react-native";
import LoginComponent from "./Login";
import NavigationComponent from "./Navigation";
import { UserContext } from "./UserContext";
import styles from "./styles";

const ContentMain = () => {
  const { user } = useContext(UserContext);
  return (
    <View style={styles.container}>
      {user === null ? <LoginComponent /> : <NavigationComponent />}
    </View>
  );
};

export default ContentMain;
