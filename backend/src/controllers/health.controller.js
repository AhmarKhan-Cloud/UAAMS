const getHealth = (_req, res) => {
  res.status(200).json({
    success: true,
    message: "UAAMS backend is healthy.",
    data: {
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = {
  getHealth,
};
