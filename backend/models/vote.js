import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  claimId: { type: String, required: true, unique: true },
  realVotes: { type: Number, default: 0 },
  fakeVotes: { type: Number, default: 0 },
});

export default mongoose.model("Vote", voteSchema);