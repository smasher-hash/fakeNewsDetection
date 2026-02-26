import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  type: String,
  inputData: String,
  fakeProbability: Number,
  explanation: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Result", resultSchema);