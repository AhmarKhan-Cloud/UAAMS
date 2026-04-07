const express = require("express");
const {
  ensureStudentRole,
  getMyProfile,
  getRecommendations,
  updateMyProfile,
} = require("../controllers/student.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(protect, authorize(ROLES.STUDENT), ensureStudentRole);

router.get("/me/profile", getMyProfile);
router.put("/me/profile", updateMyProfile);
router.get("/recommendations", getRecommendations);

module.exports = router;
