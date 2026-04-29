import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 8,
    select: false 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  profilePicture: { type: String, trim: true },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  googleId: { type: String, unique: true, sparse: true },
  // ✅ 2. Monetization Tracking
  numbersViewedCount: { type: Number, default: 0 },
  storiesReadCount: { type: Number, default: 0 },
  // ✅ 3. Premium Status Flags
  isPremiumNumbers: { type: Boolean, default: false }, // Paid £0.35
  isPremiumStories: { type: Boolean, default: false }, // Paid £0.65
  lastLogin: { type: Date, default: Date.now },
  failedLoginAttempts: { type: Number, default: 0 },
}, {
  timestamps: true
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcryptjs.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});
userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.__v;
    delete ret.verificationToken;
    delete ret.verificationExpires;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    return ret;
  }
});
userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) throw new Error("Password not set for this user");
  return bcryptjs.compare(candidate, this.password);
};
const User = mongoose.model("User", userSchema);

export default User;