import { get } from "http";
import NewMessage from "../../components/messageDashboard/NewMessage";

export default async function Dashboard() {
  // Fetch messages from server
  // const messages = await get("/api/messages");
  
  return (
    <div className="min-vh-100">
      <h1 className="text-center">Personal Dashboard</h1>
      <NewMessage/>
    </div>
  );
}

