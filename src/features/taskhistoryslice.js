// dataSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {baseurl} from "../api";

const initialState = {
  taskhist: [],
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
      state.taskhist = action.payload;
      state.loading = false;
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = dataSlice.actions;

export const addtaskhistory = (data) => async (dispatch) => {
//////////////////console.log(data)
toast.success("History added successfully");
//   const token = localStorage.getItem('token');
//     const editData = {
//       taskDescription: texthistory,
//     };
//     ////////////////////console.log(editData)

//     try {
//       const response = await axios.post(`${baseurl}/history/create/${taskid}`, editData, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       ////////////////////console.log(response.data);
//       toast.success("History added successfully");
//       dispatch(fetchDataSuccess(response.data));
//       setShowModal2(false);
//       setaddtexthistory("")
//     } catch (error) {
//       //console.error(error);
//       dispatch(fetchDataFailure(error.message));
//       toast.error("Failed to add history");
//     }



};

export default dataSlice.reducer;


