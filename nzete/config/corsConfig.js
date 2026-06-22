// config/corsConfig.js
const allowedOrigins = [
  "https://nzete.onrender.com",
  "http://localhost:8081",
  "http://localhost:19000",
  "http://192.168.0.165:8081",
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow if:
    // 1. No origin (Mobile apps, Curl, Postman)
    // 2. Origin is 'null' (Common in some mobile environments)
    // 3. Origin is in our allowed list
    // 4. Origin is a local network IP (for Windows dev)
    if (
      !origin ||
      origin === 'null' ||
      allowedOrigins.includes(origin) ||
      origin.startsWith("http://192.168.0.1") || // Catch-all for local network
      origin.startsWith("http://localhost")
    ) {
      callback(null, true);
    } else {
      console.error(`🚫 CORS Blocked Origin: ${origin}`);
      callback(new Error("CORS policy violation"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
