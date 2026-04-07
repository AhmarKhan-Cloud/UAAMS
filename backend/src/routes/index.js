const express = require("express");
const authRoutes = require("./auth.routes");
const healthRoutes = require("./health.routes");
const studentRoutes = require("../modules/student/student.routes");
const universityRoutes = require("../modules/university/university.routes");
const applicationRoutes = require("./application.routes");
const announcementRoutes = require("./announcement.routes");
const blogRoutes = require("./blog.routes");
const adminRoutes = require("../modules/admin/admin.routes");
const bloggerRoutes = require("../modules/blogger/blogger.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/universities", universityRoutes);
router.use("/applications", applicationRoutes);
router.use("/announcements", announcementRoutes);
router.use("/blogs", blogRoutes);
router.use("/admin", adminRoutes);
router.use("/blogger", bloggerRoutes);

module.exports = router;
