'use client'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    friendID:
        typeof window !== 'undefined'
            ? localStorage.getItem('friendID') || ''
            : '',
}

const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        setFriendID: (state, action) => {
            state.friendID = action.payload
            if (typeof window !== 'undefined') {
                localStorage.setItem('friendID', action.payload)
            }
        },
        clearFriendID: (state) => {
            state.friendID = ''
            if (typeof window !== 'undefined') {
                localStorage.removeItem('friendID')
            }
        },
    },
})

export const { setFriendID, clearFriendID } = friendSlice.actions
export default friendSlice.reducer
