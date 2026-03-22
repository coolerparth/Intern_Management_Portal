import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "240px" }}>
        <Sidebar role={user?.role} />
      </div>

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{
          padding: "20px",
          background: "#f5f7f6",
          minHeight: "100vh"
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;