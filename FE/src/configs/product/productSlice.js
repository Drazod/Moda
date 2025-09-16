import { apiSlice } from "../apiSlice";

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Define your endpoints here (e.g., GET, POST requests to different routes)
    getProducts: builder.query({
      query: () => "/cake/list",
    }),
    createCake: builder.mutation({
      query: (newCake) => ({
        url: "/cake/create",
        method: "POST",
        body: newCake,
      }),
    }),
    updateCake: builder.mutation({
      query: ({ id, data }) => ({
          url: `/cake/update/${id}`, 
          method: 'PUT',
          body: data, 
      }),
    }),
    updateImg: builder.mutation({
      query: ({ id, img }) => ({
          url: `/cake/updateImage/${id}`, 
          method: 'PUT',
          body: img, 
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/cake/delete/${id}`,
        method: "DELETE",
      }),
    }),
    deleteImg: builder.mutation({
      query: ({ id, dataToSend }) => ({
          url: `/cake/deleteImage/${id}`,
          method: 'DELETE',
          body: dataToSend,
      }),
    }),

  }),
});

export const {
  useGetProductsQuery,
  useCreateCakeMutation,
  useDeleteProductMutation,
  useUpdateCakeMutation,
  useDeleteImgMutation,
  useUpdateImgMutation,
} = productSlice;
