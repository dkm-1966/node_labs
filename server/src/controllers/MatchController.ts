import { Request, Response } from "express";
import MatchService from "../services/matchService";

export default class MatchController {
  static async getMatches(req: Request, res: Response) {
    try {
      const id = req.query.id;
      const formattedId = parseInt(id as string);

      if (isNaN(formattedId)) {
        res.status(400).json({ message: "Bad Request: ID is required and must be a number" });
        return;
      }

      const feeds = await MatchService.getMatches(formattedId);

      res.status(200).json(feeds);
    } catch (error) {
      console.error("Error getting matches:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getLikes(req: Request, res: Response) {
    try {
      const id = req.query.id;
      const formattedId = parseInt(id as string);

      if (isNaN(formattedId)) {
        res.status(400).json({ message: "Bad Request: ID is required and must be a number" });
        return;
      }

      const feeds = await MatchService.getLikes(formattedId);

      res.status(200).json(feeds);
    } catch (error) {
      console.error("Error getting likes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async setLike(req: Request, res: Response) {
    try {
        const {id, partnerId} = req.query;

        if (!id || !partnerId) {
          res.status(400).json({ message: "Bad Request: Both 'id' and 'partnerId' are required" });
          return;
        }

        const parsedId = parseInt(id as string);
        const parsedPartnerId = parseInt(partnerId as string);

        const matchId = await MatchService.setLike(parsedId, parsedPartnerId)
        res.status(200).json({ message: "Like set", matchId });
    } catch (error) {
      console.error("Error setting like:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async createNewMatch(req: Request, res: Response) {
    try {
      const {id, partnerId} = req.query;

      const parsedId = parseInt(id as string);
      const parsedPartnerId = parseInt(partnerId as string);

      if (!id || !partnerId) {
        res.status(400).json({ message: "Bad Request: Both 'id' and 'partnerId' are required" });
        return;
      }

      const matchId = await MatchService.setMatch(parsedId, parsedPartnerId)
      res.status(200).json({ message: "Match created", matchId });
    }catch (error) {
      console.error("Error creating match:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
