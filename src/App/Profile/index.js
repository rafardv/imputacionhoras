import React, { useContext, useEffect, useState } from "react";
import styles from "./styles";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { UserContext } from "../UserContext";
import { getUserByPK } from "../Service";

const ProfileComponent = () => {
  const { user } = useContext(UserContext);
  const [dataUser, setDataUser] = useState();

  useEffect(() => {
    const data = async () => {
      try {
        const user1 = await getUserByPK(user.pk);
        setDataUser(user1);
      } catch {}
    };
    data();
  }, []);

  console.log(dataUser);
  return (
    <View>
      <View>
        <View>
          <Image
            source={{
              uri: "https://www.asofiduciarias.org.co/wp-content/uploads/2018/06/sin-foto.png",
            }}
          />
          <Text></Text>
          <Text>correo@gmail.com</Text>
        </View>
        <TouchableOpacity>
          <Text>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileComponent;
