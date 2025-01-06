import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '.'

const initialState = {
  isEdit: false,
}

const myAccountsSlice = createSlice({
  name: 'myAccounts',
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.isEdit = !state.isEdit
    },
  },
})

export const { toggleMode } = myAccountsSlice.actions

export const selectMyAccountsMode = (state: RootState) => state.myAccounts.isEdit

export default myAccountsSlice.reducer
