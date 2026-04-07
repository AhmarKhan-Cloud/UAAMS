const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    seats: { type: Number, default: 0, min: 0 },
    feeRange: { type: String, default: "" },
    requiredAggregate: { type: Number, default: 0, min: 0, max: 100 },
    deadlineDate: { type: Date, default: null },
  },
  { _id: true }
);

const notificationSchema = new mongoose.Schema(
  {
    emailOnNewApplication: { type: Boolean, default: true },
    dailySummary: { type: Boolean, default: true },
    smsUrgentUpdates: { type: Boolean, default: false },
  },
  { _id: false }
);

const universityProfileSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    universityName: { type: String, required: true, trim: true },
    shortName: { type: String, trim: true, default: "" },
    type: { type: String, enum: ["public", "private"], default: "public" },
    established: { type: String, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    province: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    about: { type: String, default: "" },
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
    totalStudents: { type: String, default: "" },
    totalPrograms: { type: String, default: "" },
    ranking: { type: String, default: "" },
    accreditation: { type: String, default: "HEC" },
    representativeName: { type: String, default: "" },
    representativePosition: { type: String, default: "" },
    representativeEmail: { type: String, default: "" },
    representativePhone: { type: String, default: "" },
    logo: { type: String, default: "" },
    applicationFee: { type: Number, default: 0, min: 0 },
    applicationStartDate: { type: Date, default: null },
    applicationEndDate: { type: Date, default: null },
    acceptApplicationsThroughUaams: { type: Boolean, default: true },
    allowAutoFillFromStudentProfile: { type: Boolean, default: true },
    programs: { type: [programSchema], default: [] },
    notifications: { type: notificationSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UniversityProfile", universityProfileSchema);
