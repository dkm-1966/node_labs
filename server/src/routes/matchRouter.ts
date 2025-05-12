import { Router } from "express";
import MatchController from "../controllers/MatchController";

const matchRouter = Router();

matchRouter.get("/matches", MatchController.getMatches);
matchRouter.get("/matches/likes", MatchController.getLikes);
matchRouter.post("/matches/new", MatchController.setLike); //Set like to unknown user
matchRouter.patch("/matches/likes", MatchController.createNewMatch); //Like the user, who liked us

export default matchRouter;