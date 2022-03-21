import { NotificationContainer } from "react-notifications";
import { AppRouting } from "./App.Routing";

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-y-hidden">
      <NotificationContainer />
      <AppRouting />
    </div>
  );
}

export default App;
