import { ManageApplications } from "../../components/university/ManageApplications";
import { useAuth } from "../../context/AuthContext";

export const UniversityApplicationsPage = () => {
  const { currentUser } = useAuth();

  return <ManageApplications universityId={currentUser?.id || "university-applications"} />;
};