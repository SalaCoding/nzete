/**
 * Migration: Add 'dislikedBy' (array) and 'dislikesCount' (number) fields to all comments
 * Usage: node migrations/addDislikeFieldsToComments.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name'; // Change this to your DB

const commentSchema = new mongoose.Schema({}, { strict: false });
const Comment = mongoose.model('Comment', commentSchema);

async function migrate() {
  await mongoose.connect(MONGO_URI);

  const result = await Comment.updateMany(
    {
      $or: [
        { dislikedBy: { $exists: false } },
        { dislikesCount: { $exists: false } }
      ]
    },
    {
      $set: { dislikedBy: [], dislikesCount: 0 }
    }
  );

  console.log(`Migration complete: ${result.modifiedCount} comments updated.`);
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});