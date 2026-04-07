// config/corsConfig.js
const allowedOrigins = [
  "http://192.168.0.165:3001",
  "http://192.168.0.165:8081",
  process.env.EXPO_PUBLIC_API_URL
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.startsWith("http://192.168.0.165:")
    ) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation"));
    }
  },
  credentials: true,
};
