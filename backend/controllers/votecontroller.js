import Vote from "../models/Vote.js";

export const submitVote = async (req, res) => {
  try {
    const { claimId, type } = req.body;

    if (!claimId || !type) {
      return res.status(400).json({ message: "Invalid vote data" });
    }

    let voteDoc = await Vote.findOne({ claimId });

    if (!voteDoc) voteDoc = await Vote.create({ claimId });

    if (type === "real") voteDoc.realVotes++;
    if (type === "fake") voteDoc.fakeVotes++;

    await voteDoc.save();

    res.json(voteDoc);
  } catch (err) {
    res.status(500).json({ message: "Vote failed" });
  }
};

export const getVotes = async (req, res) => {
  try {
    const voteDoc = await Vote.findOne({ claimId: req.params.claimId });

    res.json(voteDoc || { realVotes: 0, fakeVotes: 0 });
  } catch (err) {
    res.status(500).json({ message: "Fetch votes failed" });
  }
};