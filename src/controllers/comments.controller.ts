import { Request, Response } from "express";
import Comment from "../models/comment.model";
import Merchant from "../models/merchant.model";
import Location from "../models/location.model";
import {
  CreateCommentReqBody,
  DeleteCommentReqBody,
  UpdateCommentReqBody,
} from "../reqBodies/comments";
import { ReqParams } from "../reqBodies/common";
import Courier from "../models/courier.model";

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
    const newComment = await Comment.create({
      text,
      commentableType: MerchantId ? "merchant" : "location",
      commentableId: MerchantId ?? LocationId,
      CourierId,
    });

    const courier = await Courier.findByPk(req.body.CourierId);

    if (courier) {
      courier.addComment(newComment);
    } else {
      res.status(400).json({ message: "Courier does not exist" });
      await newComment.destroy();
      return;
    }

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

    res.status(200).json({ message: "Comment created successfully" });
  } catch (error) {
    console.error("createComment:", error);
    res.status(500).json({ error: "Error creating comment" });
  }
}

export async function updateComment(
  req: Request<{ id: string }, {}, UpdateCommentReqBody>,
  res: Response
) {
  const { text, likes, CourierId } = req.body;
  if (!text && !likes) {
    res.status(400).send({
      message: "No updates to be made",
    });
    return;
  }
  const updates: any = {};
  if (text) {
    updates.text = text;
    updates.CourierId = CourierId;
  }
  if (likes) updates.likes = likes;
  try {
    const id = req.params.id;
    const [affectedRows] = await Comment.update(updates, {
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

export async function deleteComment(
  req: Request<{ id: string }, {}, DeleteCommentReqBody>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { MerchantId, LocationId } = req.body;

    if (MerchantId) {
      const merchant = await Merchant.findByPk(MerchantId);
      merchant?.removeComment(id);
    }
    if (LocationId) {
      const location = await Location.findByPk(LocationId);
      location?.removeComment(id);
    }

    const comment = await Comment.findByPk(id);
    await comment?.destroy();

    console.log("Comment deleted successfully");
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("deleteComment:", error);
    res.status(500).json({ error: "Error deleting comment" });
  }
}

// export async function likeComment(req: Request<{ id: string }>, res: Response) {
//   try {
//     const id = req.params.id;
//     const [affectedRows] = await Comment.increment("likes", {
//       where: {
//         id,
//       },
//     });

//     if (!affectedRows)
//       res.status(400).json({ message: "Comment does not exist" });
//     else res.status(200).json({ message: "Comment liked successfully" });
//   } catch (error) {
//     console.error("likeComment:", error);
//     res.status(500).json({ error: "Error liking comment" });
//   }
// }
