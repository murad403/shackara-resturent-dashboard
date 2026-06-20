export interface GenericResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface UserLocation {
  id: string;
  remarks: string;
  latitude: number;
  longitude: number;
  addressLine1: string;
  addressLine2: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  note: string;
  updatedAt: string;
  userId: number;
}

export interface User {
  id: number;
  slug: string;
  name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  dob: string | null;
  emergencyPhone: string | null;
  publicPhone: string | null;
  publicEmail: string | null;
  profilePictureId: string | null;
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isFaceVerified: boolean;
  isVerifiedDriver: boolean;
  isOnline: boolean;
  lastOnlineAt: string;
  isActiveRiderProfile: boolean;
  isActiveRidingProfile: boolean;
  isPendingRiderProfile: boolean;
  rating: string;
  ratingCount: number;
  roles: string[];
  profilePicture: string | null;
  location: UserLocation | null;
}

export interface AuthTokens {
  accessToken: string;
  accessTokenExpiresIn: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
}

export interface SignInData {
  user: User;
  tokens: AuthTokens;
}

export type SignInResponse = GenericResponse<SignInData>;

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export type VerifyOtpResponse = GenericResponse<null>;

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
