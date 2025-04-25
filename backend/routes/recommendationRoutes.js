import express from "express"
import { getRecommendations } from "../controllers/recommendationController.js";
const router = express.Router();

const orderRouter = express.Router();

router.post('/recommend', getRecommendations);

module.exports = router;