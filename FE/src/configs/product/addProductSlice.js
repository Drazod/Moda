import { apiSlice } from "../apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCart: builder.mutation({
      query: () => ({
        url: '/cart/create',
        method: 'POST',
        body: { },
      }),
    }),
    addProduct: builder.mutation({
      query: ({ cakeId, quantity }) => ({
        url: '/cart/add',
        method: 'POST',
        body: { cakeId, quantity },
      }),
    }),
    getCart: builder.query({
      query: () => '/cart/view',
    }),
    updateCartItem: builder.mutation({
      query: ({ cartItemId, quantity }) => ({
        url: `/cart/update`,
        method: "PUT",
        body: {cartItemId, quantity },
      }),
    }),
    deleteCartItem: builder.mutation({
      query: ({ cartItemId }) => ({
        url: `/cart/delete`,
        method: "DELETE",
        body: {cartItemId},
      }),
    }),
    deleteCart: builder.mutation({
      query: ({ cartId }) => ({
        url: `/cart/delete/${cartId}`,
        method: "DELETE",
        body: {cartId},
      }),
    }),
  }),
});

export const {useCreateCartMutation, useAddProductMutation, useGetCartQuery,useUpdateCartItemMutation,useDeleteCartItemMutation,useDeleteCartMutation } = cartApiSlice;
