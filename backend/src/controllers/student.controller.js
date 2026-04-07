const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const UniversityProfile = require("../models/UniversityProfile");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { ROLES, UNIVERSITY_APPROVAL, USER_STATUS } = require("../constants/roles");

const formatReadableDate = (value) => {
  if (!value) return "Not announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not announced";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getMyProfile = asyncHandler(async (req, res) => {
  let profile = await StudentProfile.findOne({ user: req.user._id });

  if (!profile) {
    profile = await StudentProfile.create({
      user: req.user._id,
      fullName: req.user.name,
      email: req.user.email,
    });
  }

  return res.status(200).json({
    success: true,
    data: { profile },
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  delete payload.user;
  delete payload._id;

  const profile = await StudentProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: payload, $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true, runValidators: true }
  );

  return res.status(200).json({
    success: true,
    message: "Student profile updated successfully.",
    data: { profile },
  });
});

const getRecommendations = asyncHandler(async (req, res) => {
  const minAggregate = Number(req.query.minAggregate || 0);
  const maxFee = Number(req.query.maxFee || Number.MAX_SAFE_INTEGER);
  const typeFilter = (req.query.type || "all").toLowerCase();

  const universities = await User.find({
    role: ROLES.UNIVERSITY,
    approvalStatus: UNIVERSITY_APPROVAL.APPROVED,
    status: USER_STATUS.ACTIVE,
  }).lean();

  const universityIds = universities.map((item) => item._id);
  const profiles = await UniversityProfile.find({
    university: { $in: universityIds },
  }).lean();

  const profileMap = new Map(profiles.map((item) => [String(item.university), item]));

  const studentProfile = await StudentProfile.findOne({ user: req.user._id }).lean();
  const studentAggregate = Math.max(
    Number(studentProfile?.interPercentage || 0),
    Number(studentProfile?.matricPercentage || 0)
  );

  const recommendations = universities
    .map((uni) => {
      const profile = profileMap.get(String(uni._id));
      const programsFromProfile = Array.isArray(profile?.programs) ? profile.programs : [];
      const parsedProgramsFromRegistration = String(uni.programsOffered || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const rawProgramEntries =
        programsFromProfile.length > 0
          ? programsFromProfile.map((item) => ({
              name: String(item?.name || "").trim(),
              requiredAggregate: Number(item?.requiredAggregate || 0),
              feeRange: String(item?.feeRange || "").trim(),
              seats: Number(item?.seats || 0),
              deadlineDate: item?.deadlineDate || null,
            }))
          : parsedProgramsFromRegistration.map((name) => ({
              name,
              requiredAggregate: 0,
              feeRange: "Contact university",
              seats: 0,
              deadlineDate: null,
            }));

      const uniqueProgramMap = new Map();
      rawProgramEntries.forEach((program) => {
        if (!program.name) return;
        const key = program.name.toLowerCase();
        if (!uniqueProgramMap.has(key)) {
          uniqueProgramMap.set(key, program);
        }
      });

      const cityBonus =
        profile?.city && studentProfile?.preferredCities?.includes(profile.city) ? 5 : 0;

      const programRecommendations = Array.from(uniqueProgramMap.values())
        .map((program) => {
          let matchScore = 70;
          if (studentAggregate > 0) {
            if (studentAggregate >= program.requiredAggregate) {
              matchScore += 20;
            } else {
              matchScore -= Math.min(20, program.requiredAggregate - studentAggregate);
            }
          }

          matchScore += cityBonus;

          if (studentProfile?.preferredPrograms?.includes(program.name)) {
            matchScore += 5;
          }

          return {
            name: program.name,
            requiredAggregate: Number(program.requiredAggregate || 0),
            seats: Number(program.seats || 0),
            feeRange: program.feeRange || "Contact university",
            matchScore: Math.max(0, Math.min(100, Math.round(matchScore))),
            deadlineDate: program.deadlineDate || null,
            deadline: formatReadableDate(program.deadlineDate),
          };
        })
        .filter((program) => program.requiredAggregate >= minAggregate)
        .sort((a, b) => b.matchScore - a.matchScore);

      if (programRecommendations.length === 0) {
        return null;
      }

      const requiredAggregate = Math.min(
        ...programRecommendations.map((item) => Number(item.requiredAggregate || 0))
      );
      const feeRange =
        programRecommendations.find((item) => String(item.feeRange || "").trim())?.feeRange ||
        "Contact university";
      const matchScore = Math.max(
        ...programRecommendations.map((item) => Number(item.matchScore || 0))
      );
      const programDeadlineValues = programRecommendations
        .map((item) => item?.deadlineDate)
        .filter(Boolean)
        .map((value) => new Date(value))
        .filter((date) => !Number.isNaN(date.getTime()))
        .sort((a, b) => a - b);
      const earliestProgramDeadline = programDeadlineValues[0] || null;

      return {
        id: uni._id,
        name: profile?.universityName || uni.name,
        location: profile?.city || uni.location || "Pakistan",
        programs: programRecommendations.map((item) => item.name),
        programRecommendations,
        feeRange,
        requiredAggregate,
        deadline: formatReadableDate(earliestProgramDeadline || profile?.applicationEndDate),
        matchScore,
        type: profile?.type || "public",
        applicationFee: Number(profile?.applicationFee || 0),
      };
    })
    .filter(Boolean)
    .filter((item) => (typeFilter === "all" ? true : item.type.toLowerCase() === typeFilter))
    .filter((item) => item.applicationFee <= maxFee)
    .sort((a, b) => b.matchScore - a.matchScore);

  return res.status(200).json({
    success: true,
    data: {
      recommendations,
      profileBasis: {
        studentAggregate,
        preferredPrograms: studentProfile?.preferredPrograms || [],
        preferredCities: studentProfile?.preferredCities || [],
      },
    },
  });
});

const ensureStudentRole = asyncHandler(async (req, _res, next) => {
  if (req.user.role !== ROLES.STUDENT) {
    throw new ApiError(403, "Only students can access this endpoint.");
  }
  next();
});

module.exports = {
  ensureStudentRole,
  getMyProfile,
  updateMyProfile,
  getRecommendations,
};
