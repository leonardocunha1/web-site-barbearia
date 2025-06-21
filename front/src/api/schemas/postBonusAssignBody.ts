import type { PostBonusAssignBodyType } from "./postBonusAssignBodyType";

export type PostBonusAssignBody = {
  userId: string;
  bookingId?: string;
  type: PostBonusAssignBodyType;
  description?: string;
};
