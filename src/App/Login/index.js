import React, { useState, useContext, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../UserContext";
import { accessBilldinCall } from "../Service";
import styles from "./styles";
import image from "../assets/billdIN-logo-1.png";

const LoginComponent = () => {
  const { user, setUser } = useContext(UserContext);
  const [rememberAccount, setRememberAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userA, setUserA] = useState({
    email: "",
    password: "",
  });

  //#82C1C6

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        const storedPassword = await AsyncStorage.getItem("password");
        const storedRememberAccount = await AsyncStorage.getItem(
          "rememberAccount"
        );

        if (storedEmail && storedPassword && storedRememberAccount === "true") {
          if (storedEmail !== "" && storedPassword !== "") {
            setUserA({ email: storedEmail, password: storedPassword });
            setRememberAccount(true);
            performLogin(); // Lanzar la petición automáticamente al cargar el componente
          }
        }
      } catch (error) {
        console.log("Error al cargar los datos almacenados:", error);
      }
    };

    loadStoredData();
  }, [rememberAccount]);

  const performLogin = async () => {
    setLoading(true);

    if (!userA.email || !userA.password) {
      console.log("Por favor, ingresa un correo y una contraseña válidos");
      return;
    }

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
          remember: rememberAccount,
        });

        if (rememberAccount) {
          await AsyncStorage.setItem("email", userA.email);
          await AsyncStorage.setItem("password", userA.password);
          await AsyncStorage.setItem("rememberAccount", "true");
        } else {
          await AsyncStorage.removeItem("email");
          await AsyncStorage.removeItem("password");
          await AsyncStorage.removeItem("rememberAccount");
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

    setLoading(false);
  };

  const login = () => {
    if (!userA.email || !userA.password) {
      console.log("Por favor, ingresa un correo y una contraseña válidos");
      return;
    }

    performLogin();
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      ) : (
        <View>
          <View style={styles.logoContainer}>
            <Image source={image} style={styles.logo} />
          </View>
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
          <TouchableOpacity style={styles.btn} onPress={login}>
            <Text>Entrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default LoginComponent;
