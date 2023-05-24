import React, { useContext } from "react";
import { View } from "react-native";
import LoginComponent from "./Login";
import NavigationComponent from "./Navigation";
import { UserContext } from "./UserContext";
import styles from "./styles";

const ContentMain = () => {
  const { user } = useContext(UserContext);

  console.log(user);
  return (
    <View style={styles.container}>
      {user === null || user.remember === false ? (
        <LoginComponent />
      ) : (
        <NavigationComponent />
      )}
    </View>
  );
};

export default ContentMain;
