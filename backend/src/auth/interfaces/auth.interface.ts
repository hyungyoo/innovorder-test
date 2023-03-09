/**
 * Constants for error messages used in the auth service
 */
export const AUTH_UNAUTHORIZED = "User login has failed";
export const AUTH_UNPROCESSABLE_ENTITY = "Error hashing refresh token";
export const AUTH_USER_NOT_FOUND = "Could not find the user";
export const REFRESH_TOKEN_NOT_ALLOWED = "Refresh token not allowed";
export const AUTH_FAIL_REMOVE_USER_TOKEN =
  "Failed to remove refresh token from user information";

/**
 * jwt passport strategy의 validate의 파라미터의 타입.
 */
export interface PayloadType {
  id: number;
  iat: number;
  ext: number;
}
