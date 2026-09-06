import mongoose from "mongoose";
import NumberWord from "./models/NumberWord.js";
import { numbers } from "./feedNumbers/numbers.js";

// Adjust your connection string as needed
const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

async function seedNumbers() {
  await mongoose.connect(MONGODB_URI);

  let created = 0, updated = 0, skipped = 0, errors = 0;
  for (const n of numbers) {
    try {
      const existing = await NumberWord.findOne({ value: n.value });
      if (existing && existing.word === n.word && existing.group === n.group) {
        skipped++;
        continue;
      }
      const result = await NumberWord.updateOne(
        { value: n.value },
        { $set: { word: n.word, group: n.group }, $setOnInsert: { value: n.value } },
        { upsert: true }
      );
      if (result.upsertedCount === 1 || result.upsertedId) {
        created++;
      } else {
        updated++;
      }
    } catch (err) {
      errors++;
      console.error(`Failed to upsert for value ${n.value}:`, err);
    }
  }
  console.log({ created, updated, skipped, errors });
  await mongoose.disconnect();
}

seedNumbers();