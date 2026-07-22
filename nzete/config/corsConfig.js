export const corsOptions = {
  origin: [
    "http://localhost:8081",              // Expo local web
    /\.expo\.app$/,                       // ANY Expo Web preview URL
    "https://nzete.onrender.com",         // Your backend domain
    "https://mosisa-ya-nzete.onrender.com"
  ],

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
