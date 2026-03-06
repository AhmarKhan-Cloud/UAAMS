import { UniversityProfile } from "../../components/UniversityProfile";
import { useAuth } from "../../context/AuthContext";

export const UniversityProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <UniversityProfile
      universityId={currentUser?.id || "university-profile"}
      initialName={currentUser?.name || "University"}
    />
  );
};