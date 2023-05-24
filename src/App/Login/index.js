import React, { useState, useContext } from "react";
import { TextInput, View, Text } from "react-native";
import { Button } from "react-native";
import { UserContext } from "../UserContext";
import { accessBilldinCall } from "../Service";
import styles from "./styles";
import { Switch } from "react-native";

const LoginComponent = () => {
  const { user, setUser } = useContext(UserContext);

  const [userA, setUserA] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [rememberAccount, setRememberAccount] = useState(false);

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
          rememberMe: userA.rememberMe, // Mantener el estado del radio button
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
        secureTextEntry
        onChangeText={(text) => setUserA({ ...userA, password: text })}
        style={styles.input}
      />
      <View style={styles.rememberContainer}>
        <Switch
          value={rememberAccount}
          onValueChange={(value) => setRememberAccount(value)}
        />
        <Text style={styles.rememberText}>Recordar cuenta</Text>
      </View>
      <Button title="Entrar" onPress={login} />
    </View>
  );
};

export default LoginComponent;
