import baseApi from "@/redux/api/api";
import { Food, PaginatedResponse, GenericResponse } from "./app.type";

const appApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // food*****************************************************************
        getAllFoods: builder.query<PaginatedResponse<Food[]>, any>({
            query: (params) => {
                return {
                    url: "/foods",
                    method: "GET",
                    params
                }
            },
            providesTags: ["Food"]
        }),
        getFoodDetails: builder.query<GenericResponse<Food>, number | string>({
            query: (productId) => {
                return {
                    url: `/foods/${productId}`,
                    method: "GET"
                }
            },
            providesTags: ["Food"]
        }),
        addFood: builder.mutation<GenericResponse<Food>, any>({
            query: (data) => {
                return {
                    url: `/foods`,
                    method: "POST",
                    body: data
                }
            },
            invalidatesTags: ["Food"]
        }),
        updateFood: builder.mutation<GenericResponse<Food>, { productId: number | string; data: any }>({
            query: ({ productId, data }) => {
                return {
                    url: `/foods/${productId}`,
                    method: "PATCH",
                    body: data
                }
            },
            invalidatesTags: (result, error, { productId }) => ["Food", { type: "Food", id: productId }]
        }),
        deleteFood: builder.mutation<GenericResponse<any>, number | string>({
            query: (productId) => {
                return {
                    url: `/foods/${productId}`,
                    method: "DELETE",
                }
            },
            invalidatesTags: ["Food"]
        }),
        uploadImage: builder.mutation<GenericResponse<any>, FormData>({
            query: (data) => {
                return {
                    url: `/media/upload/images`,
                    method: "POST",
                    body: data
                }
            }
        }),
        toggleFoodAvailability: builder.mutation({
            query: (id) => {
                return {
                    url: `/foods/${id}/toggle-availability`,
                    method: "PATCH"
                }
            },
            invalidatesTags: ["Food"]
        }),
    })
})

export const {
    useGetAllFoodsQuery,
    useGetFoodDetailsQuery,
    useAddFoodMutation,
    useUpdateFoodMutation,
    useDeleteFoodMutation,
    useUploadImageMutation,
    useToggleFoodAvailabilityMutation
} = appApi;