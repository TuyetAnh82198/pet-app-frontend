import io from "socket.io-client";

export const socket = io(process.env.REACT_APP_BACKEND, {
  autoConnect: false,
  extraHeaders: {
    "Access-Control-Allow-Origin": process.env.REACT_APP_FRONTEND,
    "Access-Control-Allow-Credentials": "true",
  },
  withCredentials: true,
});
