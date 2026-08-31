import mongoose from 'mongoose';

const numberWordSchema = new mongoose.Schema({
  value: { type: Number, required: true, unique: true },
  word: { type: String, required: true },
  group: { type: String }, // e.g. '1-10', '11-20', etc.
},
{ timestamps: true }
);

const NumberWord = mongoose.model('NumberWord', numberWordSchema);

export default NumberWord;
