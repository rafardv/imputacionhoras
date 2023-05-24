import React, { useState, useContext, useEffect } from "react";
import { TextInput, View, Text, Button } from "react-native";
import { UserContext } from "../UserContext";
import { accessBilldinCall } from "../Service";
import styles from "./styles";
import { Switch } from "react-native";

const LoginComponent = () => {
  const { user, setUser } = useContext(UserContext);

  const [userA, setUserA] = useState({
    email: "",
    password: "",
  });

  const [rememberAccount, setRememberAccount] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    const storedRememberAccount = localStorage.getItem("rememberAccount");

    if (storedEmail && storedPassword && storedRememberAccount === "true") {
      setUserA({ email: storedEmail, password: storedPassword });
      setRememberAccount(true);
      login(); // Lanzar la petición automáticamente al cargar el componente
    }
  }, []);

  console.log(userA);

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

        if (rememberAccount) {
          localStorage.setItem("email", userA.email);
          localStorage.setItem("password", userA.password);
          localStorage.setItem("rememberAccount", "true");
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          localStorage.removeItem("rememberAccount");
        }

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
