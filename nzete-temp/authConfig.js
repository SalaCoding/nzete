// authConfig.js
//Optional Enhancement: Modular Auth Config
//To prevent future mismatches
// authConfig.js
export const jwtOptions = {
  sign: {
    expiresIn: '15d',
  },
  verify: {
    // You can add verify options here if needed
  },
  extractUserId: (payload) => payload.sub,
  signPayload: (userId) => ({ sub: userId }),
};
