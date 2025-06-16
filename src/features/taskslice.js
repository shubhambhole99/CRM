// dataSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {baseurl} from "../api";
import { ToastContainer, toast } from 'react-toastify';


const initialState = {
  data: [],
  loading: false,
  error: null
};

const dataSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess(state, action) {
        //////////////////console.log("state,action")
      state.data = action.payload;
      state.loading = false;
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = dataSlice.actions;

export const deletetasks = (data) => async (dispatch) => {
//////////////////console.log(data)
  dispatch(fetchDataStart());
  try {
    const token = localStorage.getItem('token');
    // ////////////////console.log(token)
    const response = await axios.delete(`${baseurl}/task/${data}`,{
      headers: {
        Authorization: `${token}`
      }});
      toast.success("Successfully Deleted")
    dispatch(fetchDataSuccess(response.data));
  } catch (error) {
    toast.error("Error")

    dispatch(fetchDataFailure(error.message));
  }
};

export default dataSlice.reducer;


