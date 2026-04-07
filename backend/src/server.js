const app = require("./app");
const env = require("./config/env");
const connectDb = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User");
const { verifyAuthToken } = require("./utils/jwt");
const { USER_STATUS } = require("./constants/roles");
const { setSocketServer } = require("./utils/socket");

const configuredOrigins = String(env.corsOrigin || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);
const allowedOrigins = new Set(configuredOrigins);

const isLocalDevOrigin = (origin) =>
  env.nodeEnv !== "production" &&
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

const start = async () => {
  try {
    await connectDb();
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.has(origin) || isLocalDevOrigin(origin)) {
            callback(null, true);
            return;
          }
          callback(new Error(`Socket CORS blocked for origin: ${origin}`));
        },
        credentials: true,
      },
    });

    io.use(async (socket, next) => {
      try {
        const authToken = String(socket.handshake.auth?.token || "").trim();
        const header = String(socket.handshake.headers?.authorization || "").trim();
        const headerToken = header.startsWith("Bearer ") ? header.slice(7) : "";
        const token = authToken || headerToken;

        if (!token) {
          return next(new Error("Unauthorized"));
        }

        const decoded = verifyAuthToken(token);
        const user = await User.findById(decoded.userId);

        if (!user || user.status !== USER_STATUS.ACTIVE) {
          return next(new Error("Unauthorized"));
        }

        socket.user = {
          id: String(user._id),
          role: user.role,
        };

        return next();
      } catch {
        return next(new Error("Unauthorized"));
      }
    });

    io.on("connection", (socket) => {
      const userId = socket.user?.id;
      const role = socket.user?.role;

      if (userId) {
        socket.join(`user:${userId}`);
      }

      if (role) {
        socket.join(`role:${role}`);
      }
    });

    setSocketServer(io);

    server.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`[server] listening on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[server] failed to start", error);
    process.exit(1);
  }
};

start();
