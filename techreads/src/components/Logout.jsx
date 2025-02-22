import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const Logout = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout({ logoutParams: { returnTo: "http://localhost:5173/" } });
    localStorage.removeItem("user");
  }, [logout]);

  return <div>Logging out...</div>;
};

export default Logout;
