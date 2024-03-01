import { Request, Response } from "express";
import Comment from "../models/comment.model";
import Merchant from "../models/merchant.model";
import Location from "../models/location.model";
import {
  CreateCommentReqBody
} from "../reqBodies/comments";
import { ReqParams } from "../reqBodies/common";

export async function getComments(res: Response) {
  try {
    const comments = await Comment.findAll();

    res.status(200).json({ comments });
  } catch (error) {
    console.error("getComments:", error);
    res.status(500).json({ error: "Error fetching comments" });
  }
}

export async function getComment(req: Request<ReqParams>, res: Response) {
  try {
    const id = req.params.id;
    const comment = await Comment.findByPk(id);

    res.status(200).json({ comment });
  } catch (error) {
    console.error("getComment:", error);
    res.status(500).json({ error: "Error fetching comment" });
  }
}

// The save() instance method is not aware of associations, so you must set the association on the
// parent object as well
// https://sequelize.org/docs/v6/core-concepts/assocs/#creating-updating-and-deleting
export async function createComment(
  req: Request<{}, {}, CreateCommentReqBody>,
  res: Response
) {
  if (!req.body.text) {
    res.status(400).send({
      message: "Comment cannot be empty",
    });
    return;
  }
  if (!req.body.MerchantId && !req.body.LocationId) {
    res.status(400).send({
      message: "Comment must be associate with a merchant or a location",
    });
    return;
  }
  try {
    const newComment = await Comment.create(req.body);

    if (req.body.MerchantId) {
      const merchant = await Merchant.findByPk(req.body.MerchantId);

      if (merchant) {
        merchant.addComment(newComment);
      } else {
        res.status(400).json({ message: "Merchant does not exist" });
        await newComment.destroy();
        return;
      }
    }

    if (req.body.LocationId) {
      const location = await Location.findByPk(req.body.LocationId);

      if (location) {
        location.addComment(newComment);
      } else {
        res.status(400).json({ message: "Location does not exist" });
        await newComment.destroy();
        return;
      }
    }

    if (req.body.CommentId) {
      const parentComment = await Comment.findByPk(req.body.CommentId);

      if (parentComment) {
        parentComment.addReply(newComment);
      } else {
        res.status(400).json({ message: "Parent comment does not exist" });
        await newComment.destroy();
        return;
      }
    }

    res.status(200).json({ message: "Comment created successfully" });
  } catch (error) {
    console.error("createComment:", error);
    res.status(500).json({ error: "Error creating comment" });
  }
}

export async function updateComment(
  req: Request<{ id: string }, {}, { text: string }>,
  res: Response
) {
  if (!req.body.text) {
    res.status(400).send({
      message: "Comment cannot be empty",
    });
    return;
  }
  try {
    const id = req.params.id;
    const [affectedRows] = await Comment.update(req.body, {
      where: {
        id,
      },
    });

    if (!affectedRows)
      res.status(400).json({ message: "Comment does not exist" });
    else res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("updateComment:", error);
    res.status(500).json({ error: "Error updating comment" });
  }
}

export async function likeComment(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const [affectedRows] = await Comment.increment("likes", {
      where: {
        id,
      },
    });

    if (!affectedRows)
      res.status(400).json({ message: "Comment does not exist" });
    else res.status(200).json({ message: "Comment liked successfully" });
  } catch (error) {
    console.error("likeComment:", error);
    res.status(500).json({ error: "Error liking comment" });
  }
}
