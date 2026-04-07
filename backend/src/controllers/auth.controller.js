const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const UniversityProfile = require("../models/UniversityProfile");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { signAuthToken } = require("../utils/jwt");
const { ROLES, UNIVERSITY_APPROVAL } = require("../constants/roles");

const isSupportedRole = (role) =>
  [ROLES.STUDENT, ROLES.UNIVERSITY, ROLES.BLOGGER, ROLES.ADMIN].includes(role);

const register = asyncHandler(async (req, res) => {
  const {
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
    representativeName,
  } = req.body;

  if (!isSupportedRole(role)) {
    throw new ApiError(400, "Invalid role selected.");
  }

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  if (role === ROLES.ADMIN) {
    throw new ApiError(403, "Admin registration is restricted.");
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  if (username) {
    const existingUsername = await User.findOne({ username: String(username).trim().toLowerCase() });
    if (existingUsername) {
      throw new ApiError(409, "This username is already taken.");
    }
  }

  const createdUser = await User.create({
    role,
    name: String(name).trim(),
    email: normalizedEmail,
    password: String(password),
    username: username ? String(username).trim().toLowerCase() : undefined,
    phone: phone ? String(phone).trim() : "",
    location: location ? String(location).trim() : "",
    website: website ? String(website).trim() : "",
    establishedYear: establishedYear ? String(establishedYear).trim() : "",
    studentCount: studentCount ? String(studentCount).trim() : "",
    programsOffered: programsOffered ? String(programsOffered).trim() : "",
    representativeName: representativeName ? String(representativeName).trim() : "",
    approvalStatus:
      role === ROLES.UNIVERSITY
        ? UNIVERSITY_APPROVAL.PENDING
        : UNIVERSITY_APPROVAL.APPROVED,
  });

  if (role === ROLES.STUDENT) {
    await StudentProfile.create({
      user: createdUser._id,
      fullName: createdUser.name,
      email: createdUser.email,
    });
  }

  if (role === ROLES.UNIVERSITY) {
    await UniversityProfile.create({
      university: createdUser._id,
      universityName: createdUser.name,
      representativeName: createdUser.representativeName || "",
      email: createdUser.email,
      phone: createdUser.phone || "",
      city: createdUser.location || "",
      website: createdUser.website || "",
      established: createdUser.establishedYear || "",
      totalStudents: createdUser.studentCount || "",
      programs: [],
    });
  }

  return res.status(201).json({
    success: true,
    message:
      role === ROLES.UNIVERSITY
        ? "University registration submitted and waiting for admin approval."
        : "Account created successfully.",
    data: {
      user: createdUser.toSafeObject(),
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password || !role) {
    throw new ApiError(400, "Identifier, password, and role are required.");
  }

  if (!isSupportedRole(role)) {
    throw new ApiError(400, "Invalid role selected.");
  }

  const normalizedIdentifier = String(identifier).trim().toLowerCase();

  const query = { role };
  if (role === ROLES.BLOGGER) {
    query.$or = [{ email: normalizedIdentifier }, { username: normalizedIdentifier }];
  } else {
    query.email = normalizedIdentifier;
  }

  const user = await User.findOne(query).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials for the selected role.");
  }

  const isPasswordCorrect = await user.comparePassword(String(password));
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials for the selected role.");
  }

  if (
    user.role === ROLES.UNIVERSITY &&
    user.approvalStatus === UNIVERSITY_APPROVAL.PENDING
  ) {
    throw new ApiError(
      403,
      "University account is pending admin approval. Please try again later."
    );
  }

  if (
    user.role === ROLES.UNIVERSITY &&
    user.approvalStatus === UNIVERSITY_APPROVAL.REJECTED
  ) {
    throw new ApiError(
      403,
      "University registration was rejected. Contact system admin support."
    );
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signAuthToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      token,
      user: user.toSafeObject(),
    },
  });
});

const me = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user.toSafeObject(),
    },
  });
});

module.exports = {
  register,
  login,
  me,
};
