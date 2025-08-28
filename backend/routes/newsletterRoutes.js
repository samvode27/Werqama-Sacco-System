import express from "express";
import { getNewsletterCount, subscribeNewsletter } from "../controllers/newsletterController.js";

const router = express.Router();

router.post("/", subscribeNewsletter);
router.get("/count", getNewsletterCount);

export default router;
