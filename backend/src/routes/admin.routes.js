const express = require("express");
const {
  getDashboardStats,
  listUniversitiesForAdmin,
  reviewUniversity,
  listStudentsForAdmin,
  listBloggersForAdmin,
  updateUserStatus,
} = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get("/stats", getDashboardStats);
router.get("/universities", listUniversitiesForAdmin);
router.patch("/universities/:id/review", reviewUniversity);
router.get("/students", listStudentsForAdmin);
router.get("/bloggers", listBloggersForAdmin);
router.patch("/users/:id/status", updateUserStatus);

module.exports = router;
