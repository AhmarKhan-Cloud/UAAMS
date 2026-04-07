const ROLES = Object.freeze({
  STUDENT: "student",
  UNIVERSITY: "university",
  BLOGGER: "blogger",
  ADMIN: "admin",
});

const UNIVERSITY_APPROVAL = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

const USER_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
});

module.exports = {
  ROLES,
  UNIVERSITY_APPROVAL,
  USER_STATUS,
};
