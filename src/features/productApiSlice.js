import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/apiConstans";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
tagTypes:["Product"],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "products",
      providesTags:['Product']
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
      invalidatesTags:["Product"]
    }),
    deleteProduct: builder.mutation({
      query: (id) => {
        return {
          url: `products/${id}`,
          method:"DELETE"
        }
      },
      invalidatesTags:["Product"]
    })
    
  }),
});
export const {
  useGetAllProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useDeleteProductMutation
} = productApi;
