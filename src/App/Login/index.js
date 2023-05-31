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
import styles from "./styles";
import image from "../assets/billdIN-logo-1.png";
import { login } from "./controller";

const LoginComponent = () => {
  const { setUser } = useContext(UserContext);
  const [rememberAccount, setRememberAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userA, setUserA] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const loadStoredData = async () => {
      setLoading(true);
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
            login(setUser, setUserA, userA, rememberAccount);
          }
        }
      } catch (error) {
        console.log("Error al cargar los datos almacenados:", error);
      }
    };

    loadStoredData();
  }, [rememberAccount]);

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
          <TouchableOpacity
            style={styles.btn}
            onPress={() => login(setUser, setUserA, userA, rememberAccount)}
          >
            <Text>Entrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default LoginComponent;
