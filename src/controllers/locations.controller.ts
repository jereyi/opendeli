import { Request, Response } from "express";
import Location from "../models/location.model";
import Comment from "../models/comment.model";

export async function getLocations(req: Request, res: Response) {
  try {
    const locations = await Location.findAll({ include: Comment });

    res.status(200).json({ locations });
  } catch (error) {
    console.error("getLocations:", error);
    res.status(500).json({ error: "Error fetching locations" });
  }
}

export async function getLocation(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const location = await Location.findByPk(id, { include: Comment });

    if (location) {
      res.status(200).json({ location });
    } else {
      res.status(400).json({ message: "Location does not exist" });
    }
  } catch (error) {
    console.error("getLocation:", error);
    res.status(500).json({ error: "Error fetching location" });
  }
}
