import { useNavigate } from "react-router-dom";
import { UniversityOverview } from "../../components/UniversityOverview";

const routeMap = {
  applications: "/university/applications",
  announcements: "/university/announcements",
  "roll-numbers": "/university/roll-numbers",
  "form-builder": "/university/form-builder",
};

export const UniversityOverviewPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (tab) => {
    const route = routeMap[tab] || "/university";
    navigate(route);
  };

  return <UniversityOverview onNavigate={handleNavigate} />;
};