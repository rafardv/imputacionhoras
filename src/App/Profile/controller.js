import AsyncStorage from "@react-native-async-storage/async-storage";

export const cerrarSesion = async (setUser) => {
  await AsyncStorage.setItem("rememberAccount", "false");
  setUser(null);
};
