import { accessBilldinCall } from "../Service";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const login = async (setUser, setUserA, userA, rememberAccount) => {
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
};
