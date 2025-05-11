import { Router } from "express";
import MatchController from "../controllers/MatchController";

const matchRouter = Router();

matchRouter.get("/matches", MatchController.getMatches);
matchRouter.get("/matches/likes", MatchController.getLikes);
matchRouter.post("/matches/likes", MatchController.setLike);// лайкаєм користувача
matchRouter.patch("/matches/likes", MatchController.createNewMatch);// лайкаєм взаємно

export default matchRouter;