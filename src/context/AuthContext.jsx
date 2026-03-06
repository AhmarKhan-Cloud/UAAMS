import { createContext, useContext, useEffect, useMemo, useState } from "react";

const SESSION_STORAGE_KEY = "uaams_current_user";
const USERS_STORAGE_KEY = "uaams_registered_users";

const demoUsers = [
  {
    id: "stu-demo-01",
    name: "Ayesha Khan",
    email: "student@uaams.com",
    password: "student123",
    role: "student",
    approvalStatus: "approved",
  },
  {
    id: "uni-demo-01",
    name: "NUST Islamabad",
    email: "university@uaams.com",
    password: "university123",
    role: "university",
    approvalStatus: "approved",
  },
  {
    id: "blog-demo-01",
    name: "Campus Insights Team",
    email: "blogger@uaams.com",
    username: "campus_writer",
    password: "blogger123",
    role: "blogger",
    approvalStatus: "approved",
  },
  {
    id: "admin-demo-01",
    name: "System Administrator",
    email: "admin@uaams.com",
    password: "admin123",
    role: "admin",
    approvalStatus: "approved",
  },
];

const readStorage = (key, fallbackValue) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) {
      return fallbackValue;
    }

    return JSON.parse(value);
  } catch {
    return fallbackValue;
  }
};

const toPublicUser = (user) => {
  if (!user) {
    return null;
  }

  const { password, ...publicUser } = user;
  return publicUser;
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState(() =>
    readStorage(USERS_STORAGE_KEY, []),
  );

  const [currentUser, setCurrentUser] = useState(() =>
    readStorage(SESSION_STORAGE_KEY, null),
  );

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
      return;
    }

    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, [currentUser]);

  const login = ({ identifier, password, role }) => {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const allUsers = [...demoUsers, ...registeredUsers];

    const matchedUser = allUsers.find((user) => {
      const emailMatch = user.email.toLowerCase() === normalizedIdentifier;
      const usernameMatch =
        user.username && user.username.toLowerCase() === normalizedIdentifier;

      return user.role === role && (emailMatch || usernameMatch);
    });

    if (!matchedUser || matchedUser.password !== password) {
      return {
        ok: false,
        message: "Invalid credentials for the selected role.",
      };
    }

    if (
      matchedUser.role === "university" &&
      matchedUser.approvalStatus === "pending"
    ) {
      return {
        ok: false,
        message:
          "University account is pending admin approval. Please try again later.",
      };
    }

    if (
      matchedUser.role === "university" &&
      matchedUser.approvalStatus === "rejected"
    ) {
      return {
        ok: false,
        message:
          "University registration was rejected. Contact system admin support.",
      };
    }

    const publicUser = toPublicUser(matchedUser);
    setCurrentUser(publicUser);

    return {
      ok: true,
      user: publicUser,
      message: "Login successful.",
    };
  };

  const register = ({
    role,
    name,
    email,
    password,
    username,
    phone,
    location,
    website,
    establishedYear,
    studentCount,
    programsOffered,
  }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const allUsers = [...demoUsers, ...registeredUsers];

    const duplicate = allUsers.some(
      (user) => user.email.toLowerCase() === normalizedEmail,
    );

    if (duplicate) {
      return {
        ok: false,
        message: "An account with this email already exists.",
      };
    }

    const createdUser = {
      id: `${role}-${Date.now()}`,
      role,
      name: name.trim(),
      email: normalizedEmail,
      password,
      username: username?.trim() || undefined,
      phone: phone?.trim() || "",
      location: location?.trim() || "",
      website: website?.trim() || "",
      establishedYear: establishedYear?.trim() || "",
      studentCount: studentCount?.trim() || "",
      programsOffered: programsOffered?.trim() || "",
      approvalStatus: role === "university" ? "pending" : "approved",
    };

    setRegisteredUsers((previous) => [createdUser, ...previous]);

    return {
      ok: true,
      message:
        role === "university"
          ? "University registration submitted and waiting for admin approval."
          : "Account created successfully. Please login to continue.",
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      demoCredentials: demoUsers.map((user) => ({
        role: user.role,
        identifier: user.username || user.email,
        password: user.password,
      })),
      login,
      register,
      logout,
      registeredUsers,
    }),
    [currentUser, registeredUsers],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};