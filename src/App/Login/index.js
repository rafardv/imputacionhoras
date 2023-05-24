import React, { useState, useContext } from "react";
import { TextInput, View, Text } from "react-native";
import { Button } from "react-native";
import { UserContext } from "../UserContext";
import { accessBilldinCall } from "../Service";
import styles from "./styles";

const LoginComponent = () => {
  const { user, setUser } = useContext(UserContext);

  const [userA, setUserA] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      const response = await accessBilldinCall({
        username: userA.email,
        password: userA.password,
      });

      if (response.jwtToken && response.payload.PK) {
        setUser({
          email: userA.email,
          jwtToken: response.jwtToken,
          pk: response.payload.PK,
        });

        setUserA({
          email: "",
          password: "",
        });
      } else {
        console.log("Error de inicio de sesión:", response.error);
      }
    } catch (error) {
      console.log("Error de inicio de sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Correo electrónico</Text>
      <TextInput
        placeholder="Correo"
        value={userA.email}
        onChangeText={(text) => setUserA({ ...userA, email: text })}
        style={styles.input}
      />
      <Text>Contraseña</Text>
      <TextInput
        placeholder="Contraseña"
        value={userA.password}
        onChangeText={(text) => setUserA({ ...userA, password: text })}
        style={styles.input}
      />
      <Button title="Entrar" onPress={login} />
    </View>
  );
};

export default LoginComponent;
