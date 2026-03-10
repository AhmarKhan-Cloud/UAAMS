import { BloggerDashboard } from "../../components/blogger/BloggerDashboard";
import { useAuth } from "../../context/AuthContext";

export const BloggerOverviewPage = () => {
  const { currentUser, logout } = useAuth();

  return <BloggerDashboard user={currentUser} onLogout={logout} />;
};