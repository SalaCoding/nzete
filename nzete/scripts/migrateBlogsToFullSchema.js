// migrateBlogsToFullSchema.js
{/**import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { Schema, Types } = mongoose;

// --- Define your schemas exactly as in your app ---
const commentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ userId: String }]
}, { _id: true });

const interactionSchema = new Schema({
  userId: { type: String, required: true, index: true },
  score: { type: Number, min: 0, max: 5 },
  bookmarked: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  comments: [commentSchema]
}, { _id: true });

const storySchema = new Schema({
  title: { type: String, required: true, unique: true, trim: true },
  content: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  category: { type: String, enum: ["Folktale", "Legend", "Proverb"], default: "Folktale", index: true },
  image: String,
  audioUrl: String,
  interactions: [interactionSchema],
  totalRatings: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
  bookmarksCount: { type: Number, default: 0 },
  completionsCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });

storySchema.pre('save', function (next) {
  this.totalRatings = this.interactions.filter(i => i.score > 0).length;
  this.bookmarksCount = this.interactions.filter(i => i.bookmarked).length;
  this.completionsCount = this.interactions.filter(i => i.completed).length;
  this.commentsCount = this.interactions.reduce((sum, i) => sum + (i.comments?.length || 0), 0);
  next();
});

const Blog = mongoose.model('Blog', storySchema, 'blogs');

// --- Migration ---
async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const blogs = await Blog.find({});
  let updated = 0;

  for (const blog of blogs) {
    let changed = false;

    // 1. Migrate ratings → interactions if needed
    if (Array.isArray(blog.ratings) && blog.ratings.length > 0) {
      blog.interactions = blog.ratings.map(r => ({
        userId: r.userId || r.user || null,
        score: r.score ?? 0,
        bookmarked: false,
        completed: false,
        viewCount: 0,
        comments: [],
        _id: new Types.ObjectId()
      }));
      blog.set('ratings', undefined, { strict: false });
      changed = true;
    }

    // 2. Ensure every interaction has comments array
    blog.interactions = blog.interactions.map(i => ({
      ...i.toObject?.() || i,
      comments: Array.isArray(i.comments) ? i.comments : []
    }));

    // 3. Ensure counter fields exist
    ['totalRatings', 'totalViews', 'bookmarksCount', 'completionsCount', 'commentsCount']
      .forEach(field => {
        if (typeof blog[field] !== 'number') {
          blog[field] = 0;
          changed = true;
        }
      });

    // 4. Recalculate counters
    blog.totalRatings = blog.interactions.filter(i => i.score > 0).length;
    blog.bookmarksCount = blog.interactions.filter(i => i.bookmarked).length;
    blog.completionsCount = blog.interactions.filter(i => i.completed).length;
    blog.commentsCount = blog.interactions.reduce((sum, i) => sum + (i.comments?.length || 0), 0);

    if (changed) {
      await blog.save();
      updated++;
    }
  }

  console.log(`✅ Migration complete. Updated ${updated} documents.`);
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
*/}