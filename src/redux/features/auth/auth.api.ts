import baseApi from "@/redux/api/api";
import {
  ChangePasswordRequest,
  GenericResponse,
  SignInResponse,
  VerifyOtpResponse
} from "./auth.type";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<SignInResponse, any>({
      query: (data) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: data
        }
      }
    }),
    signUp: builder.mutation<any, any>({
      query: (data) => {
        return {
          url: "/auth/register",
          method: "POST",
          body: data
        }
      }
    }),
    forgotPassword: builder.mutation<GenericResponse<null>, any>({
      query: (data) => {
        return {
          url: "/auth/forgot-password",
          method: "POST",
          body: data
        }
      }
    }),
    verifyOtp: builder.mutation<VerifyOtpResponse, any>({
      query: (data) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: data
        }
      }
    }),
    resetPassword: builder.mutation<GenericResponse<null>, any>({
      query: (data) => {
        return {
          url: '/auth/reset-password',
          method: "POST",
          body: data
        }
      }
    })
  })
})

export const {
  useSignInMutation,
  useSignUpMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;