export const roleDefaultPath = {
  student: "/student",
  university: "/university",
  blogger: "/blogger",
  admin: "/admin",
};

export const resolveRolePath = (role) => roleDefaultPath[role] || "/";

export const roleLabelMap = {
  student: "Student",
  university: "University",
  blogger: "Blogger",
  admin: "Admin",
};