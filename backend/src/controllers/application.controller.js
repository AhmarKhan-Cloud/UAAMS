const mongoose = require("mongoose");
const Application = require("../models/Application");
const User = require("../models/User");
const UniversityProfile = require("../models/UniversityProfile");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const getPagination = require("../utils/pagination");
const { emitDataUpdate } = require("../utils/socket");
const { ROLES, UNIVERSITY_APPROVAL } = require("../constants/roles");

const ensureObjectId = (id, message = "Invalid resource id.") => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, message);
  }
};

const canAccessApplication = (application, user) => {
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.STUDENT && String(application.student) === String(user._id)) return true;
  if (user.role === ROLES.UNIVERSITY && String(application.university) === String(user._id)) return true;
  return false;
};

const createApplication = asyncHandler(async (req, res) => {
  const { universityId, program, formData = {}, payment } = req.body;

  ensureObjectId(universityId, "Invalid university id.");

  if (!program) {
    throw new ApiError(400, "Program is required.");
  }

  const university = await User.findOne({
    _id: universityId,
    role: ROLES.UNIVERSITY,
    approvalStatus: UNIVERSITY_APPROVAL.APPROVED,
  });

  if (!university) {
    throw new ApiError(404, "University is not available for application.");
  }

  const profile = await UniversityProfile.findOne({ university: university._id });
  const applicationFee = Number(profile?.applicationFee || 0);

  const matricMarks = Number(formData["7"] || formData.matric || 0);
  const interMarks = Number(formData["8"] || formData.fsc || 0);
  const aggregate =
    Number(formData.aggregate || 0) ||
    (matricMarks > 0 && interMarks > 0 ? Number((((matricMarks + interMarks) / 2200) * 100).toFixed(2)) : 0);

  const paymentPayload = {
    status: "unpaid",
    amount: applicationFee,
    method: String(payment?.method || "card"),
    accountLast4: "",
    transactionReference: "",
    paidAt: null,
  };

  let status = "not-submitted";

  if (payment?.transactionReference) {
    paymentPayload.status = "paid";
    paymentPayload.transactionReference = String(payment.transactionReference).trim();
    paymentPayload.accountLast4 = String(payment.accountNumber || "").slice(-4);
    paymentPayload.paidAt = new Date();
    status = "pending";
  }

  const application = await Application.create({
    student: req.user._id,
    university: university._id,
    studentName: String(formData["1"] || req.user.name || "Student"),
    email: String(formData["2"] || req.user.email || "").toLowerCase(),
    cnic: String(formData["4"] || formData.cnic || ""),
    program: String(program),
    formData,
    aggregate,
    matricMarks,
    interMarks,
    testScore: Number(formData.testScore || 0),
    payment: paymentPayload,
    status,
  });

  emitDataUpdate({
    resource: "applications",
    action: "created",
    userIds: [String(req.user._id), String(university._id)],
    payload: {
      applicationId: String(application._id),
      universityId: String(university._id),
      status: application.status,
    },
  });

  return res.status(201).json({
    success: true,
    message:
      status === "pending"
        ? "Application created and payment marked as completed."
        : "Application draft created. Complete payment to submit.",
    data: { application },
  });
});

const getMyApplications = asyncHandler(async (req, res) => {
  const query = { student: req.user._id };

  if (req.query.status) {
    query.status = String(req.query.status);
  }

  const applications = await Application.find(query)
    .sort({ createdAt: -1 })
    .populate("university", "name")
    .lean();

  return res.status(200).json({
    success: true,
    data: { applications },
  });
});

const getApplicationById = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, "Invalid application id.");

  const application = await Application.findById(req.params.id)
    .populate("student", "name email")
    .populate("university", "name email")
    .lean();

  if (!application) {
    throw new ApiError(404, "Application not found.");
  }

  if (!canAccessApplication(application, req.user)) {
    throw new ApiError(403, "You do not have permission to view this application.");
  }

  return res.status(200).json({
    success: true,
    data: { application },
  });
});

const payApplicationFee = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, "Invalid application id.");

  const { method, accountNumber, transactionReference } = req.body;

  if (!transactionReference || !accountNumber) {
    throw new ApiError(400, "Account/Card number and transaction reference are required.");
  }

  const application = await Application.findById(req.params.id);
  if (!application) {
    throw new ApiError(404, "Application not found.");
  }

  if (String(application.student) !== String(req.user._id)) {
    throw new ApiError(403, "You can only pay for your own applications.");
  }

  application.payment.status = "paid";
  application.payment.method = method || "card";
  application.payment.accountLast4 = String(accountNumber).slice(-4);
  application.payment.transactionReference = String(transactionReference).trim();
  application.payment.paidAt = new Date();
  application.status = "pending";

  await application.save();

  emitDataUpdate({
    resource: "applications",
    action: "updated",
    userIds: [String(application.student), String(application.university)],
    payload: {
      applicationId: String(application._id),
      universityId: String(application.university),
      status: application.status,
      paymentStatus: application.payment.status,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Payment recorded and application submitted successfully.",
    data: { application },
  });
});

const getUniversityApplications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const query = {};

  if (req.user.role === ROLES.UNIVERSITY) {
    query.university = req.user._id;
  } else if (req.user.role !== ROLES.ADMIN) {
    throw new ApiError(403, "Only universities and admins can access this endpoint.");
  }

  if (req.query.status) {
    query.status = String(req.query.status);
  }

  if (req.query.program) {
    query.program = String(req.query.program);
  }

  if (req.query.search) {
    const search = String(req.query.search).trim();
    query.$or = [
      { studentName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { applicationCode: { $regex: search, $options: "i" } },
    ];
  }

  const [total, applications] = await Promise.all([
    Application.countDocuments(query),
    Application.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("student", "name email")
      .populate("university", "name")
      .lean(),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, "Invalid application id.");

  const { status } = req.body;
  const allowedStatuses = [
    "not-submitted",
    "pending",
    "under-review",
    "accepted",
    "rejected",
    "assigned",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value.");
  }

  const application = await Application.findById(req.params.id);
  if (!application) {
    throw new ApiError(404, "Application not found.");
  }

  if (req.user.role === ROLES.UNIVERSITY && String(application.university) !== String(req.user._id)) {
    throw new ApiError(403, "You can only update your university applications.");
  }

  application.status = status;
  await application.save();

  emitDataUpdate({
    resource: "applications",
    action: "updated",
    userIds: [String(application.student), String(application.university)],
    payload: {
      applicationId: String(application._id),
      universityId: String(application.university),
      status: application.status,
    },
  });
  if (["accepted", "rejected", "assigned"].includes(status)) {
    emitDataUpdate({
      resource: "merit-lists",
      action: "updated",
      roles: ["student"],
      payload: {
        universityId: String(application.university),
        applicationId: String(application._id),
      },
    });
  }

  return res.status(200).json({
    success: true,
    message: "Application status updated successfully.",
    data: { application },
  });
});

const assignRollNumber = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, "Invalid application id.");

  const { number, slipFileUrl, slipFileName } = req.body;

  if (!number) {
    throw new ApiError(400, "Roll number is required.");
  }

  const application = await Application.findById(req.params.id);
  if (!application) {
    throw new ApiError(404, "Application not found.");
  }

  if (req.user.role === ROLES.UNIVERSITY && String(application.university) !== String(req.user._id)) {
    throw new ApiError(403, "You can only assign roll numbers for your own university.");
  }

  application.rollNumber = {
    assigned: true,
    number: String(number).trim(),
    slipFileUrl: String(slipFileUrl || ""),
    slipFileName: String(slipFileName || ""),
    assignedAt: new Date(),
    assignedBy: req.user._id,
  };
  application.status = "assigned";
  await application.save();

  emitDataUpdate({
    resource: "applications",
    action: "updated",
    userIds: [String(application.student), String(application.university)],
    payload: {
      applicationId: String(application._id),
      universityId: String(application.university),
      status: application.status,
    },
  });
  emitDataUpdate({
    resource: "merit-lists",
    action: "updated",
    roles: ["student"],
    payload: {
      universityId: String(application.university),
      applicationId: String(application._id),
    },
  });

  return res.status(200).json({
    success: true,
    message: "Roll number assigned successfully.",
    data: { application },
  });
});

const uploadAdmissionLetter = asyncHandler(async (req, res) => {
  ensureObjectId(req.params.id, "Invalid application id.");

  const { letterNumber, fileUrl, fileName, remarks, sentToStudent } = req.body;

  if (!letterNumber || !fileUrl) {
    throw new ApiError(400, "Letter number and file URL are required.");
  }

  const application = await Application.findById(req.params.id);
  if (!application) {
    throw new ApiError(404, "Application not found.");
  }

  if (req.user.role === ROLES.UNIVERSITY && String(application.university) !== String(req.user._id)) {
    throw new ApiError(403, "You can only upload admission letters for your own university.");
  }

  application.admissionLetter = {
    issued: true,
    letterNumber: String(letterNumber).trim(),
    fileUrl: String(fileUrl).trim(),
    fileName: String(fileName || "").trim(),
    remarks: String(remarks || ""),
    sentToStudent: Boolean(sentToStudent),
    uploadedAt: new Date(),
    uploadedBy: req.user._id,
    sentAt: sentToStudent ? new Date() : null,
  };
  await application.save();

  emitDataUpdate({
    resource: "applications",
    action: "updated",
    userIds: [String(application.student), String(application.university)],
    payload: {
      applicationId: String(application._id),
      universityId: String(application.university),
      status: application.status,
      letterIssued: true,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Admission letter uploaded successfully.",
    data: { application },
  });
});

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationById,
  payApplicationFee,
  getUniversityApplications,
  updateApplicationStatus,
  assignRollNumber,
  uploadAdmissionLetter,
};
