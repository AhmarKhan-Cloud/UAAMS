import { BloggerManagement } from "../../components/BloggerManagement";
import { useAuth } from "../../context/AuthContext";

export const UniversityBloggerManagementPage = () => {
  const { currentUser } = useAuth();

  return <BloggerManagement universityName={currentUser?.name || "University"} />;
};