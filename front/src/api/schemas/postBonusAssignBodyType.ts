export type PostBonusAssignBodyType =
  (typeof PostBonusAssignBodyType)[keyof typeof PostBonusAssignBodyType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostBonusAssignBodyType = {
  BOOKING_POINTS: "BOOKING_POINTS",
  LOYALTY: "LOYALTY",
} as const;
