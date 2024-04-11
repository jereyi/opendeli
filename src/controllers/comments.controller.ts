import { Request, Response } from "express";
import Comment from "../models/comment.model";
import {
  CreateCommentReqBody,
  UpdateCommentReqBody,
} from "../reqBodies/comments";
import { ReqParams } from "../reqBodies/common";

export async function getComments(req: Request, res: Response) {
  try {
    const comments = await Comment.findAll();

    res
      .status(200)
      .json({ comments: comments.map((comment) => comment.dataValues) });
  } catch (error) {
    console.error("getComments:", error);
    res.status(500).json({ error: "Error fetching comments" });
  }
}

export async function getComment(req: Request<ReqParams>, res: Response) {
  try {
    const id = req.params.id;
    const comment = await Comment.findByPk(id);

    res.status(200).json({ comment: comment?.dataValues });
  } catch (error) {
    console.error("getComment:", error);
    res.status(500).json({ error: "Error fetching comment" });
  }
}

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
  if (!req.body.CourierId) {
    res.status(400).send({
      message: "Comment must be associated with a courier",
    });
    return;
  }
  if (!req.body.MerchantId && !req.body.LocationId) {
    res.status(400).send({
      message: "Comment must be associate with a merchant or a location",
    });
    return;
  }
  if (req.body.MerchantId && req.body.LocationId) {
    res.status(400).send({
      message:
        "Comment cannot be associate with both a merchant and a location",
    });
    return;
  }
  try {
    const { text, MerchantId, LocationId, CourierId } = req.body;
    const comment = await Comment.create({
      text,
      commentableType: MerchantId ? "merchant" : "location",
      commentableId: MerchantId ?? LocationId,
      CourierId,
    });
    console.log("Comment created successfully");
    res.status(200).json({ comment: comment.dataValues });
  } catch (error) {
    console.error("createComment:", error);
    res.status(500).json({ error: "Error creating comment" });
  }
}

export async function updateComment(
  req: Request<{ id: string }, {}, UpdateCommentReqBody>,
  res: Response
) {
  try {
    const { text, likes, CourierId } = req.body;
    console.log("request body", req.body);
    const id = req.params.id;
    if (!text && !likes) {
      res.status(400).send({
        message: "No updates to be made",
      });
      return;
    }
    const comment = await Comment.findByPk(id);
    if (!comment) {
      res.status(400).json({ message: "Comment does not exist" });
      return;
    }
    const updates: any = {};
    if (text) {
      updates.text = text;
      updates.CourierId = CourierId;
    }
    if (likes) {
      const newLikers = comment.likers.filter((liker) => liker != CourierId);
      newLikers.push(CourierId);
      updates.likes = newLikers.length;
      updates.likers = newLikers;
    }
    const [affectedCount, affectedRows] = await Comment.update(updates, {
      where: {
        id,
      },
      returning: true,
    });

    if (affectedCount <= 0) {
      res.status(400).json({ message: "Comment does not exist" });
    } else {
      console.log("Comment updated successfully");
      res.status(200).json({ comment: affectedRows[0].dataValues });
    }
  } catch (error) {
    console.error("updateComment:", error);
    res.status(500).json({ error: "Error updating comment" });
  }
}

export async function deleteComment(
  req: Request<{ id: string }, {}, {}>,
  res: Response
) {
  try {
    const id = req.params.id;

    const comment = await Comment.findByPk(id);
    await comment?.destroy();

    console.log("Comment deleted successfully");
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("deleteComment:", error);
    res.status(500).json({ error: "Error deleting comment" });
  }
}
