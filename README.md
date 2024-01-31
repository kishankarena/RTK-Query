# Redux Toolkit

#### Docs

[Redux Toolkit Docs](https://redux-toolkit.js.org/introduction/getting-started)

#### Install Template

```sh
npx create-react-app my-app --template redux
```

- @latest

```sh
npx create-react-app@latest my-app --template redux
```

#### Existing App

```sh
npm install @reduxjs/toolkit react-redux
```

#### Buil in behaviours for today's applications:

=>Tracking loading state in order to show UI spinners
=>Avoiding duplicate requests for the same data
=>Optimistic updates to make the UI feel faster
=>Managing cache lifetimes as the user interacts with the UI

#### Setup api Slice (for RTK Query)

- application feature
- create features folder/counter
- create counterSlice.js

```js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants/apiConstans";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "Your URL"}),
  endpoints: (builder) => ({

});
})

export const { useGetAllProductsQuery, useGetProductQuery } = productApi;

```

#### Dummy API

```sh
REACT_APP_BASE_URL = https://dummyjson.com/
```

#### SetUp API PROVIDER

```js
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { productApi } from "./features/apiSlice";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApiProvider api={productApi}>
        <App />
      </ApiProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
```

#### Configure the Store

```js
import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { productApi } from "./features/apiSlice";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [productApi.reducerPath]: productApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
```

#### Use Hooks in Components

```js
import React from "react";
import {
  useGetAllProductsQuery,
} from "../features/apiSlice";

const Data = () => {
  // Using a query hook automatically fetches data and returns query values
  const {
    data
    error,
    isError,
    isLoading,
  } = useGetAllProductsQuery();
  return <div>Data : </div>;
};

export default Data;
```

#### RTK Mutations

```js
createProduct: builder.mutation({
  query: (productData) => {url:"products/add",method:"POST",body:productData},
});
```
