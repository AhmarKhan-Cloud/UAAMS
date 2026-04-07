let ioInstance = null;

const SOCKET_EVENT_DATA_UPDATED = "uaams:data-updated";

const setSocketServer = (io) => {
  ioInstance = io;
};

const getSocketServer = () => ioInstance;

const emitDataUpdate = ({
  resource = "general",
  action = "updated",
  roles = [],
  userIds = [],
  roomIds = [],
  payload = {},
} = {}) => {
  if (!ioInstance) return;

  const envelope = {
    resource,
    action,
    ...payload,
    at: new Date().toISOString(),
  };

  roles.forEach((role) => {
    ioInstance.to(`role:${role}`).emit(SOCKET_EVENT_DATA_UPDATED, envelope);
  });

  userIds.forEach((userId) => {
    if (!userId) return;
    ioInstance.to(`user:${String(userId)}`).emit(SOCKET_EVENT_DATA_UPDATED, envelope);
  });

  roomIds.forEach((roomId) => {
    if (!roomId) return;
    ioInstance.to(String(roomId)).emit(SOCKET_EVENT_DATA_UPDATED, envelope);
  });
};

module.exports = {
  SOCKET_EVENT_DATA_UPDATED,
  setSocketServer,
  getSocketServer,
  emitDataUpdate,
};
