import { Request, Response } from "express";
import userService from "../services/userService";

//CRUD Controller for User Profile
class UserProfileController {
  static async getUserProfile(req: Request, res: Response): Promise<void> {
    console.log("getUserProfile")
    try {
      const userId = req.query.id;
      const parsedId = parseInt(userId as string);

      if (isNaN(parsedId)) {
        res.status(400).json({ status: "error", message: "Bad Request: 'id' must be a valid number" });
        return;
      } 

      const profile = await userService.get(parsedId);

      if (!profile) {
        res.status(404).json({ status: "error", message: "Not Found: User profile does not exist" });
        return;
      }

      res.status(200).json({
        status: "success",
        profile,
      });
      return;
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error: Failed to fetch user profile",
      });
    }
  }

  static async createUserProfile(req: Request, res: Response): Promise<void> {
    console.log("createUserProfile")
    try {
      const id = parseInt(req.query.id as string);

      if (isNaN(id)) {
        res.status(400).json({ status: "error", message: "Bad Request: 'id' must be a valid number" });
        return;
      }

      const data = req.body;

      const profileId = await userService.create(data, id);

      res.status(201).json({
        status: "success",
        message: "User created successfully",
        profileId,
      });
      return;
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error: Failed to create user profile",
      });
    }
  }

  static async updateUserProfile(req: Request, res: Response): Promise<void> {
    console.log("updateUserProfile")
    try {
      const userId = req.query.id;
      const parsedId = parseInt(userId as string);

      if (isNaN(parsedId)) {
        res.status(400).json({ status: "error", message: "Bad Request: 'id' must be a valid number" });
        return;
      }

      const data = req.body;

      const id = await userService.update(parsedId, data);

      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        id,
      });
      return;
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error: Failed to update user profile",
      });
    }
  }

  static async deleteUserProfile(req: Request, res: Response): Promise<void> {
    console.log("deleteUserProfile")
    try {
      const userId = req.query.id;
      const parsedId = parseInt(userId as string);

      if (isNaN(parsedId)) {
        res.status(400).json({ status: "error", message: "Bad Request: 'id' must be a valid number" });
        return;
      }

      const id = await userService.delete(parsedId);

      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        id,
      });
      return;
    } catch (error) {
      console.error("Error deleting user profile:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error: Failed to delete user profile",
      });
    }
  }
}

export default UserProfileController;
