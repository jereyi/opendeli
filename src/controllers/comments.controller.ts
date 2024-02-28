import { Request, Response } from "express";
import Comment from "../models/comment.model";
import Merchant from "../models/merchant.model";
import Location from "../models/location.model";
import { CommentReqBody } from "../reqBodies/comments";

export async function getComments(req: Request, res: Response) {
  try {
    const comments = await Comment.findAll();

    res.status(200).json({ comments });
  } catch (error) {
    console.error("getComments:", error);
    res.status(500).json({ error: "Error fetching comments" });
  }
}

export async function getComment(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const comment = await Comment.findByPk(id);

    res.status(200).json({ comment });
  } catch (error) {
    console.error("getComment:", error);
    res.status(500).json({ error: "Error fetching comment" });
  }
}

//Courier ID needs to be saved as a request cookie
export async function createComment(
  req: Request<{}, {}, CommentReqBody>,
  res: Response
) {
  try {
    const { text, merchantId, locationId, commentId } = req.body;
    const comment = await Comment.create({ text });

    if (merchantId) {
      const merchant = await Merchant.findByPk(merchantId);

      if (merchant) {
        comment.setMerchant(merchant);
        merchant.addComment(comment);
      } else res.status(400).json({ message: "Merchant does not exist" });
    }

    if (locationId) {
      const location = await Location.findByPk(locationId);

      if (location) {
        comment.setLocation(location);
        location.addComment(comment);
      } else res.status(400).json({ message: "Location does not exist" });
    }

    if (commentId) {
      const parentComment = await Comment.findByPk(commentId);

      if (parentComment) {
        comment.setComment(parentComment);
        parentComment.addReply(comment);
      } else res.status(400).json({ message: "Parent comment does not exist" });
    }

    res.status(200).json({ message: "Comment created successfully" });
  } catch (error) {
    console.error("createComment:", error);
    res.status(500).json({ error: "Error creating comment" });
  }
}

// TODO: MAKE SURE FUNCTION ENDS AFTER ERROR MESSAGE
export async function updateComment(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const id = req.params.id;
    const { text, merchantId, locationId } = req.body;
    const [affectedRows, comments] = await Comment.update(
      { text },
      {
        where: {
          id,
        },
        returning: true,
      }
    );

    if (!affectedRows)
      res.status(400).json({ message: "Comment does not exist" });

    if (merchantId) {
      // If `MerchantId` already set, unassociate comment with old merchant
      if (comments[0].MerchantId) {
        const oldMerchant = await Merchant.findByPk(comments[0].MerchantId);
        oldMerchant?.removeComment(id);
      }
      const newMerchant = await Merchant.findByPk(merchantId);
      if (newMerchant) {
        newMerchant?.addComment(comments[0]);
        comments[0].setMerchant(newMerchant);
      } else {
        res.status(400).json({ message: "Merchant does not exist" });
      }
    }

    if (locationId) {
      // If `LocationId` already set, unassociate comment with old merchant
      if (comments[0].LocationId) {
        const oldLocation = await Location.findByPk(comments[0].LocationId);
        oldLocation?.removeComment(id);
      }
      const newLocation = await Location.findByPk(locationId);
      if (newLocation) {
        newLocation?.addComment(comments[0]);
        comments[0].setLocation(newLocation);
      } else {
        res.status(400).json({ message: "Location does not exist" });
      }
    }

    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("getComments:", error);
    res.status(500).json({ error: "Error fetching comments" });
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

    if (affectedRows)
      res.status(200).json({ message: "Comment liked successfully" });
    else res.status(400).json({ message: "Comment does not exist" });
  } catch (error) {
    console.error("getComments:", error);
    res.status(500).json({ error: "Error fetching comments" });
  }
}
