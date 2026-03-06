import { StudentProfile } from "../../components/StudentProfile";
import { useAuth } from "../../context/AuthContext";

export const StudentProfilePage = () => {
  const { currentUser } = useAuth();

  return (
    <StudentProfile
      studentId={currentUser?.id || "student-profile"}
      initialName={currentUser?.name || "Student"}
    />
  );
};