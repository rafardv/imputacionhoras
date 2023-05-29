import ContentMain from "./src/App";
import { UserProvider } from "./src/App/UserContext";

export default function App() {
  return (
    <UserProvider>
      <ContentMain />
    </UserProvider>
  );
}
