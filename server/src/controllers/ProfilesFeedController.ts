import { Request, Response } from "express";
import feedService from "../services/feedService";

export default class ProfilesFeedController {
  static async getProfiles(req: Request, res: Response) {
    try {
      const { limit, offset, id } = req.query;
      
      let interestsRaw = req.query.interest; 
      let interests: string[] = [];

      if (interestsRaw) {
        if (Array.isArray(interestsRaw)) {
          interests = interestsRaw.map(i => String(i));
        } else {
          interests.push(interestsRaw as string)
        }
      }
      
      const formattedLimit = parseInt(limit as string)
      const formattedOffset = parseInt(offset as string)
      const formattedId = parseInt(id as string)

      if (isNaN(formattedLimit) || isNaN(formattedOffset) || isNaN(formattedId)) {
        res.status(400).json({ message: "Bad Request: 'limit', 'offset', and 'id' must be valid numbers" });
        return;
      }

      const feeds = await feedService.get(formattedLimit, formattedOffset, formattedId, interests);
      res.status(200).json(feeds);
      console.log('Get profiles: ', feeds)
    } catch (error) {
      console.error("Error while getting profiles:", error);
      res.status(500).json({
        message: "Internal Server Error: Failed to retrieve profiles"
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = req.query.id;
      const formattedId = parseInt(id as string);

      if (isNaN(formattedId)) {
        res.status(400).json({ message: "Bad Request: 'id' must be a valid number" });
        return;
      }

      const profile = await feedService.getById(formattedId);

      if (!profile) {
        res.status(404).json({ message: "Not Found: Profile does not exist" });
        return;
      }

      res.status(200).json(profile);
    } catch (error) {
      console.error("Error while getting profile:", error);
      res.status(500).json({
        message: "Internal Server Error: Failed to retrieve profile"
      });
    }
  }
}
