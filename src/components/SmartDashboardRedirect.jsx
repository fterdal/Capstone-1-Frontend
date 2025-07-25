import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SmartDashboardRedirect = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/dashboard/main");
    }
  }, [user, navigate]);

  return null;
};

export default SmartDashboardRedirect;
