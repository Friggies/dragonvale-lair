'use client'
import { configureStore } from '@reduxjs/toolkit'
import friendReducer from './friendSlice'

export const store = configureStore({
    reducer: {
        friend: friendReducer,
    },
})
