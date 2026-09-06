import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const commentSchema = new Schema({
  text: { type: String, required: true, trim: true },
  storyId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true, index: true },
  userId: { type: String, required: true, index: true },
  username: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
  likes: [{ userId: String }],
  likesCount: { type: Number, default: 0 },
  dislikedBy: [{ type: String }],
  dislikesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
});

const Comment = model('Comment', commentSchema);
export default Comment;
