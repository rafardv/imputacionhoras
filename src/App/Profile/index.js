import React from "react";
import { View, Text } from "react-native";

const ProfileComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://www.asofiduciarias.org.co/wp-content/uploads/2018/06/sin-foto.png",
            }}
            style={styles.photo}
          />
          <Text style={styles.name}>Victor Bisquert</Text>
          <Text style={styles.email}>correo@gmail.com</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileComponent;
