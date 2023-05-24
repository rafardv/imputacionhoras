import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { UserContext } from "../UserContext";
import { getUserByPK } from "../Service";
import styles from "./styles";

const ProfileComponent = () => {
  const { user } = useContext(UserContext);
  const [dataUser, setDataUser] = useState();

  useEffect(() => {
    const data = async () => {
      try {
        const importUser = await getUserByPK(user.pk);
        setDataUser(importUser);
      } catch {}
    };
    data();
  }, []);

  console.log(dataUser);
  return (
    <View style={styles.container}>
      <View>
        <Image
          style={styles.photo}
          source={{
            uri: "https://www.asofiduciarias.org.co/wp-content/uploads/2018/06/sin-foto.png",
          }}
        />
        <Text style={styles.name}>Victor bisquert</Text>
        <Text style={styles.email}>correo@gmail.com</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileComponent;
