// src/app/store.ts
'use client'
import { configureStore } from '@reduxjs/toolkit';
import membersApiSlice from '@/redux/slice/membersApiSlice';
import { emailApiSlice } from './slice/emailApiSlice';

const store = configureStore({
    reducer: {
        [membersApiSlice.reducerPath]: membersApiSlice.reducer,
        [emailApiSlice.reducerPath]: emailApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(membersApiSlice.middleware, emailApiSlice.middleware),
});

export default store;
