const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES, UNIVERSITY_APPROVAL, USER_STATUS } = require("../constants/roles");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: Object.values(UNIVERSITY_APPROVAL),
      default: UNIVERSITY_APPROVAL.APPROVED,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
      index: true,
    },
    representativeName: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    establishedYear: {
      type: String,
      trim: true,
      default: "",
    },
    studentCount: {
      type: String,
      trim: true,
      default: "",
    },
    programsOffered: {
      type: String,
      trim: true,
      default: "",
    },
    managedUniversity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("validate", function setUniversityApproval(next) {
  if (this.role === ROLES.UNIVERSITY && !this.approvalStatus) {
    this.approvalStatus = UNIVERSITY_APPROVAL.PENDING;
  }
  next();
});

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(rawPassword) {
  return bcrypt.compare(rawPassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    username: this.username,
    role: this.role,
    approvalStatus: this.approvalStatus,
    status: this.status,
    representativeName: this.representativeName,
    phone: this.phone,
    location: this.location,
    website: this.website,
    establishedYear: this.establishedYear,
    studentCount: this.studentCount,
    programsOffered: this.programsOffered,
    managedUniversity: this.managedUniversity,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("User", userSchema);
