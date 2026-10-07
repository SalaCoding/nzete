// authConfig.js
//Optional Enhancement: Modular Auth Config
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