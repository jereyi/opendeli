export type CreateCommentReqBody = {
  text: string;
  MerchantId?: string;
  LocationId?: string;
  CourierId: string;
};

export type UpdateCommentReqBody = {
  text?: string;
  likes?: number;
  CourierId: string;
};

export type DeleteCommentReqBody = {
  MerchantId?: string;
  LocationId?: string;
};
