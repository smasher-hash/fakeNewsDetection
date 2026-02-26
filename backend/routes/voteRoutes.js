import express from "express";
import { submitVote, getVotes } from "../controllers/voteController.js";

const router = express.Router();

router.post("/", submitVote);
router.get("/:claimId", getVotes);

export default router;