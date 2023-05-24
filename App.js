import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import ContentMain from "./src/App";
import { UserProvider } from "./src/App/UserContext";

export default function App() {
  return (
    <UserProvider>
      <ContentMain style={styles.container} />
      <StatusBar style="auto" />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
