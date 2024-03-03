import io from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
  extraHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Credentials": "true",
  },
  withCredentials: true,
});
