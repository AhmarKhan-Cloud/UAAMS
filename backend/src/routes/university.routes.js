const express = require("express");
const {
  listUniversities,
  getUniversityById,
  getUniversityFormByUniversityId,
  getMyProfile,
  updateMyProfile,
  getMyForm,
  upsertMyForm,
  listMyBloggers,
  createBlogger,
  updateMyBloggerStatus,
} = require("../controllers/university.controller");
const { protect, authorize } = require("../middleware/auth.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.get("/me/profile", protect, authorize(ROLES.UNIVERSITY), getMyProfile);
router.put("/me/profile", protect, authorize(ROLES.UNIVERSITY), updateMyProfile);
router.get("/me/form", protect, authorize(ROLES.UNIVERSITY), getMyForm);
router.put("/me/form", protect, authorize(ROLES.UNIVERSITY), upsertMyForm);
router.get("/me/bloggers", protect, authorize(ROLES.UNIVERSITY), listMyBloggers);
router.post("/me/bloggers", protect, authorize(ROLES.UNIVERSITY), createBlogger);
router.patch(
  "/me/bloggers/:bloggerId/status",
  protect,
  authorize(ROLES.UNIVERSITY),
  updateMyBloggerStatus
);

router.get("/", listUniversities);
router.get("/:id/form", getUniversityFormByUniversityId);
router.get("/:id", getUniversityById);

module.exports = router;
