import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/apiConstans";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "products",
    }),
    getProduct: builder.query({
      query: (product) => `products/search?q=${product}`,
    }),
    createProduct: builder.mutation({
      query: (productData) => {
        return {
          url: "products/add",
          method: "POST",
          body: productData,
        };
      },
    }),
  }),
});
export const {
  useGetAllProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
} = productApi;
