{/*import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

async function migrateComments() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for migration.');

  try {
    const stories = await Blog.find({});

    for (const story of stories) {
      const allNewComments = [];
      const interactionsToUpdate = story.interactions.map(interaction => {
        const userId = interaction.userId;
        const username = "MIGRATED_USER"; // Use a placeholder or look up the actual username

        const newComments = interaction.comments.map(oldComment => {
          const newComment = {
            ...oldComment.toObject(),
            storyId: story._id,
            userId: userId,
            username: username,
            parentId: null, // You will need logic here if you had nested replies
          };
          allNewComments.push(newComment);
          return newComment;
        });

        // Remove the comments array from the interaction to prepare for cleanup
        interaction.comments = [];
        return interaction;
      });

      // Insert all new comments into the new collection
      if (allNewComments.length > 0) {
        await Comment.insertMany(allNewComments);
      }

      // Update the story to remove comments and set the correct count
      await Blog.updateOne(
        { _id: story._id },
        {
          $set: { interactions: interactionsToUpdate },
          commentsCount: allNewComments.length
        }
      );
    }
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    mongoose.disconnect();
  }
}

migrateComments();
*/}