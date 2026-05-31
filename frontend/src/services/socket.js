export const createSocket = (roomId) => {
  return new WebSocket(
    `ws://localhost:8000/ws/${roomId}`
  );
};