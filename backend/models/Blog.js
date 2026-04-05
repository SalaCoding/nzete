//import mongoose, { Schema, model, Types } from 'mongoose';
import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const interactionSchema = new Schema({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ["rating", "bookmark", "complete", "view"], default: "rating", index: true },
  score: { type: Number, min: 0, max: 5 },
  bookmarked: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 }, //done
}, { _id: true, timestamps: true });

const storySchema = new Schema({
  title: { type: String, required: true, unique: true, trim: true }, // Done
  content: { type: String, required: true, trim: true }, // Done
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true }, // Done
  category: { type: String, enum: ["Folktale", "Legend", "Proverb"], default: "Folktale", index: true }, // Done
  image: String, // Done
  audioUrl: String,
  interactions: [interactionSchema], // Done
  totalRatings: { type: Number, default: 0 }, // Done
  totalViews: { type: Number, default: 0 }, // Done
  bookmarksCount: { type: Number, default: 0 },
  completionsCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 }, //Done
  likes: [{ userId: String }], // Done
  likesCount: { type: Number, default: 0 }, // Done
  dislikes: [{ userId: String }], // Done
  dislikesCount: { type: Number, default: 0 }, // Done
}, { timestamps: true });

const Blog = model('Blog', storySchema);
export default Blog;
