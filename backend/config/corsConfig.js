// config/corsConfig.js
const allowedOrigins = [
  "http://192.168.0.165:3001",
  "http://192.168.0.165:8081"
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
// This file can be imported in your main server file to apply CORS settings
// Example usage:  
// 

// import { corsOptions } from './config/corsConfig.js';
// app.use(cors(corsOptions));
