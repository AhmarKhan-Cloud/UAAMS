const express = require("express");
const {
  listAnnouncements,
  listAnnouncementsByUniversity,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");
const { protect, optionalProtect, authorize } = require("../middleware/auth.middleware");
const { ROLES } = require("../constants/roles");

const router = express.Router();

router.get("/", listAnnouncements);
router.get("/university/:universityId", optionalProtect, listAnnouncementsByUniversity);

router.post("/", protect, authorize(ROLES.UNIVERSITY), createAnnouncement);
router.patch("/:id", protect, authorize(ROLES.UNIVERSITY, ROLES.ADMIN), updateAnnouncement);
router.delete("/:id", protect, authorize(ROLES.UNIVERSITY, ROLES.ADMIN), deleteAnnouncement);

module.exports = router;
