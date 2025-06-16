// dataSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {baseurl} from "../api";

let initialState = {
  user1: [],
  loading: false,
  error: null
};

const datasSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess(state, action) {
        // //////////////////console.log(action.payload)
      state.user1 = action.payload;
      state.loading = false;
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = datasSlice.actions;

export const fetchAsyncData = () => async (dispatch) => {
  dispatch(fetchDataStart());
  try {

    const response = await axios.get(`${baseurl}/user`);
    let users=response.data
    users.sort((a, b) => a.username.localeCompare(b.username));
    dispatch(fetchDataSuccess(users));
    return users;
  } catch (error) {
    //////////////////console.log(error)
    dispatch(fetchDataFailure(error.message));
  }
};

export const checkpath=()=>async (dispatch)=>{
  try {
    const response = await axios.get(`${baseurl}/checkpath`, { path,userId });
    console.log(response.data); // Handle response
    return true
  } catch (error) {
    console.error(error.response?.data || error.message); // Handle error
  }

}

export default datasSlice.reducer;


