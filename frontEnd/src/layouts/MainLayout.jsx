import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-0">
      <Navbar />
      <main style={{ paddingTop: "56px" }}>
        <Outlet />
      </main>
    </div>
  );
}
