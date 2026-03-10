import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { HomePage } from "../pages/public/HomePage";
import { NotFoundPage } from "../pages/shared/NotFoundPage";
import { UnauthorizedPage } from "../pages/shared/UnauthorizedPage";
import { resolveRolePath } from "../utils/rolePaths";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { adminNavItems, adminRoutePages } from "./adminRoutes";
import { bloggerNavItems, bloggerRoutePages } from "./bloggerRoutes";
import { studentNavItems, studentRoutePages } from "./studentRoutes";
import { universityNavItems, universityRoutePages } from "./universityRoutes";

const mapRolePages = (pages, prefix) =>
  pages.map((page) => {
    if (page.index) {
      return <Route key={`${prefix}-index`} index element={page.element} />;
    }

    return <Route key={`${prefix}-${page.path}`} path={page.path} element={page.element} />;
  });

const RoleRedirect = () => {
  const { currentUser } = useAuth();

  if (!currentUser?.role) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={resolveRolePath(currentUser.role)} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>

      <Route path="/dashboard" element={<RoleRedirect />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["student"]} />}>
          <Route
            path="/student"
            element={
              <DashboardLayout
                title="Student Dashboard"
                navItems={studentNavItems}
                theme="emerald"
              />
            }
          >
            {mapRolePages(studentRoutePages, "student")}
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["university"]} />}>
          <Route
            path="/university"
            element={
              <DashboardLayout
                title="University Dashboard"
                navItems={universityNavItems}
                theme="blue"
              />
            }
          >
            {mapRolePages(universityRoutePages, "university")}
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["blogger"]} />}>
          <Route
            path="/blogger"
            element={
              <DashboardLayout
                title="Blogger Dashboard"
                navItems={bloggerNavItems}
                theme="purple"
              />
            }
          >
            {mapRolePages(bloggerRoutePages, "blogger")}
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route
            path="/admin"
            element={
              <DashboardLayout
                title="Admin Dashboard"
                navItems={adminNavItems}
                theme="indigo"
              />
            }
          >
            {mapRolePages(adminRoutePages, "admin")}
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};