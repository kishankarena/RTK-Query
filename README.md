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


#### Writing Reducers with Immer

=> What is Immutability ?

=>Redux Toolkit's createReducer and createSlice automatically use Immer internally to let you write simpler immutable update logic using "mutating" syntax.

=> One of the primary rules of Redux is that our reducers are never allowed to mutate the original / current state values!

```js
// ❌ Illegal - by default, this will mutate the state!
state.value = 123;
```

=> Reducers can only make copies of the original values, and then they can mutate the copies.

```js
// ✅ This is safe, because we made a copy
return {
  ...state,
  value: 123,
};
```

#### Immutable Updates with Immer

Immer is a library that simplifies the process of writing immutable update logic.
Immer provides a function called produce, which accepts two arguments: your original state, and a callback function

```js
import produce from "immer";

const baseState = [
  {
    todo: "Learn typescript",
    done: true,
  },
  {
    todo: "Try immer",
    done: false,
  },
];

const nextState = produce(baseState, (draftState) => {
  // "mutate" the draft array
  draftState.push({ todo: "Tweet about it" });
  // "mutate" the nested state
  draftState[1].done = true;
});

console.log(baseState === nextState);
// false - the array was copied
console.log(baseState[0] === nextState[0]);
// true - the first item was unchanged, so same reference
console.log(baseState[1] === nextState[1]);
// false - the second item was copied and updated
```

#### Redux Toolkit and Immer

=> Redux Toolkit's createReducer API uses Immer internally automatically. So, it's already safe to "mutate" state inside of any case reducer function that is passed to createReducer:

```js
const todosSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    todoAdded(state, action) {
      state.push(action.payload);
    },
  },
});
```

#### Mutating and Returning State

```js
 reducers: {
    // ❌ ERROR: mutates state, but also returns new array size!
    brokenReducer: (state, action) => state.push(action.payload),
    // ✅ SAFE: the `void` keyword prevents a return value
    fixedReducer1: (state, action) => void state.push(action.payload),
    // ✅ SAFE: curly braces make this a function body and no return
    fixedReducer2: (state, action) => {
      state.push(action.payload)
    },
  },
```

#### Setup api Slice (for RTK Query)

- application feature
- create features folder/product
- create productApiSlice.js

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

#### Cache Behavior

=> A key feature of RTK Query is its management of cached data. When data is fetched from the server, RTK Query will store the data in the Redux store as a 'cache'. When an additional request is performed for the same data, RTK Query will provide the existing cached data rather than sending an additional request to the server.

#### Manipulating cache behaviour (Refetching)

```js
const { refetch } = useGetAllProductsQuery();
```

#### Automated Re-fetching

=>RTK Query uses a "cache tag" system to automate re-fetching for query endpoints that have data affected by mutation endpoints. This enables designing your API such that firing a specific mutation will cause a certain query endpoint to consider its cached data invalid, and re-fetch the data if there is an active subscription.

1.Tags
=> For RTK Query, tags are just a name that you can give to a specific collection of data to control caching and invalidation behavior for re-fetching purposes.

```js
tagTypes: ["Post", "User"];
```

2. Providing tags
   => A query can have its cached data provide tags. Doing so determines which 'tag' is attached to the cached data returned by the query.

```js
 providesTags: ['Post'],
```

3. Invalidating tags
   => A mutation can invalidate specific cached data based on the tags. Doing so determines which cached data will be either refetched or removed from the cache.

```js
invalidatesTags: ['Post'],
```

#### Conditional Fetching

=> Query hooks automatically begin fetching data as soon as the component is mounted. But, there are use cases where you may want to delay fetching data until some condition becomes true. RTK Query supports conditional fetching to enable that behavior.

```js
// If you want to prevent a query from automatically running, you can use the skip parameter in a hook.

const { data: singleProduct } = useGetProductQuery("Iphone", { skip });
```

=> When skip is true :

1. If the query has cached data:

- The cached data will not be used on the initial load, and will ignore updates from any identical query until the skip condition is removed
- The query will have a status of uninitialized
- If skip: false is set after the initial load, the cached result will be used

2. If the query does not have cached data:

- The query will have a status of uninitialized
- The query will not exist in the state when viewed with the dev tools
- The query will not automatically fetch on mount
- The query will not automatically run when additional components with the same query are added that do run

#### Polling
=> Polling gives you the ability to have a 'real-time' effect by causing a query to run at a specified interval. To enable polling for a query, pass a "pollingInterval" to the "useQuery" hook or action creator with an interval in milliseconds:
```js
const { data, isLoading } = useGetAllProductsQuery(null,{pollingInterval:3000});
```

=> Polling additionally has the ability to skip sending requests while the window is out of focus. To enable this behavior, pass ```js skipPollingIfUnfocused: true ```to the useQuery hook or action creator.

#### Prefetching

=> The goal of prefetching is to make data fetch before the user navigates to a page or attempts to load some known content.
=> Similar to the useMutation hook, the usePrefetch hook will not run automatically — it returns a "trigger function" that can be used to initiate the behavior.

```js
const prefetchPage = usePrefetch('getAllProducts'{ifOlderThan:35}) 

prefetchPage(page+1)
```
=> It accepts two arguments: the first is the key of a query action that you defined in your API service, and the second is an object of two optional parameters:

 1. ifOlderThan - (default: false | number) - number is value in seconds
     If specified, it will only run the query if the difference between new Date() and the last fulfilledTimeStamp is greater than the given value
 2. force
     If force: true, it will ignore the ifOlderThan value if it is set and the query will be run even if it exists in the cache.

#### Code Splitting

=> RTK Query makes it possible to trim down your initial bundle size by allowing you to inject additional endpoints after you've set up your initial service definition.

=> "injectEndpoints" accepts a collection of endpoints, as well as an optional "overrideExisting" parameter.

1.  A typical approach would be to have one empty central API slice definition

```js
// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: () => ({}),
});
```

2. and then inject the api endpoints in other files and export them from there - that way you will be sure to always import the endpoints in a way that they are definitely injected.

   ```js
   import { emptySplitApi } from "./emptySplitApi";

   const extendedApi = emptySplitApi.injectEndpoints({
     endpoints: (build) => ({
       example: build.query({
         query: () => "test",
       }),
     }),
     overrideExisting: true,
   });

    export const { useExampleQuery } = extendedApi
```


