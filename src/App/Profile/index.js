import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { UserContext } from "../UserContext";
import { getUserByPK } from "../Service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";

const ProfileComponent = () => {
  const { user, setUser } = useContext(UserContext);
  const [dataUser, setDataUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const importUser = await getUserByPK({
          userPK: user.pk,
          jwtToken: user.jwtToken,
        });

        setDataUser(importUser);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cerrarSesion = async () => {
    await AsyncStorage.setItem("rememberAccount", "false"); // Actualizar el valor de rememberAccount en AsyncStorage
    setUser(null); // Establecer el usuario en null en el UserContext
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="gray" /> // Mostrar el icono de carga
      ) : (
        <View style={styles.containerImg}>
          <Image
            style={styles.photo}
            source={{
              uri: "https://www.asofiduciarias.org.co/wp-content/uploads/2018/06/sin-foto.png",
            }}
          />
          <Text
            style={styles.name}
          >{`${dataUser.name} ${dataUser.surname}`}</Text>
          <Text style={styles.email}>{dataUser?.username}</Text>
          <TouchableOpacity style={styles.button} onPress={cerrarSesion}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfileComponent;
