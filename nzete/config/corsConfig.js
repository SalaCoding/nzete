const allowedOrigins = [
  "http://localhost:8081",                 // Expo local web
  "https://nzete.onrender.com",            // Backend
  "https://mosisa-ya-nzete.onrender.com"   // Your other domain
];

// Regex for ANY Expo Web preview domain
const expoRegex = /^https:\/\/.*\.expo\.app$/;

export const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||                                 // mobile apps (no origin)
      origin === "null" ||                       // some webviews
      allowedOrigins.includes(origin) ||         // exact matches
      expoRegex.test(origin) ||                  // ANY expo.app domain
      origin.startsWith("http://localhost")      // local dev
    ) {
      callback(null, true);
    } else {
      console.error("🚫 CORS Blocked Origin:", origin);
      callback(new Error("CORS policy violation"));
    }
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
    "*"
  ],

  preflightContinue: false,
  optionsSuccessStatus: 200
};
