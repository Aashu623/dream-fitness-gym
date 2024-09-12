// src/app/store.ts
'use client'
import { configureStore } from '@reduxjs/toolkit';
import membersApiSlice from '@/redux/slice/membersApiSlice';

const store = configureStore({
    reducer: {
        [membersApiSlice.reducerPath]: membersApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(membersApiSlice.middleware),
});

export default store;
