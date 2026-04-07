const express = require("express");
const {
  createApplication,
  getMyApplications,
  getApplicationById,
  payApplicationFee,
  getUniversityApplications,
  updateApplicationStatus,
  assignRollNumber,
  uploadAdmissionLetter,
} = require("../controllers/application.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(protect);

router.post("/", authorize(ROLES.STUDENT), createApplication);
router.get("/me", authorize(ROLES.STUDENT), getMyApplications);
router.patch("/:id/payment", authorize(ROLES.STUDENT), payApplicationFee);

router.get(
  "/university/me",
  authorize(ROLES.UNIVERSITY, ROLES.ADMIN),
  getUniversityApplications
);
router.patch(
  "/:id/status",
  authorize(ROLES.UNIVERSITY, ROLES.ADMIN),
  updateApplicationStatus
);
router.patch(
  "/:id/roll-number",
  authorize(ROLES.UNIVERSITY, ROLES.ADMIN),
  assignRollNumber
);
router.patch(
  "/:id/admission-letter",
  authorize(ROLES.UNIVERSITY, ROLES.ADMIN),
  uploadAdmissionLetter
);

router.get("/:id", getApplicationById);

module.exports = router;
