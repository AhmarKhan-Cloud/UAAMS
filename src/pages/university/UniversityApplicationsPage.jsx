import { ManageApplications } from "../../components/ManageApplications";
import { useAuth } from "../../context/AuthContext";

export const UniversityApplicationsPage = () => {
  const { currentUser } = useAuth();

  return <ManageApplications universityId={currentUser?.id || "university-applications"} />;
};