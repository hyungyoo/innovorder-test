/**
 * When storing and searching access tokens in Redis,
 * leaving the value field empty makes it faster to search by only looking up the keys since it becomes null.
 * However, it is difficult to distinguish between null and "", so we made a constant for it.
 */
export const ACCESS_TOKEN_VALUE = "";

/**
 * Const for exception message
 */
export const ACCESS_TOKEN_BLACKLISTED =
  "The access token is blacklisted. Access is denied";
export const ACCESS_TOKEN_PAYLOAD_ERROR = "Access token has wrong payload";
export const ACCESS_TOKEN_EXPIRED = "access token is expired";

export const EXP_NOT_EXISTS = -1;
