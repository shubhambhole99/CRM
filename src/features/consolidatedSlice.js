// dataSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import {baseurl} from "../api";

const initialState = {
consolidated: [],
  loading: false,
  error: null
};

const datasSlice = createSlice({
  name: 'consolidated',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess(state, action) {
        //////////////////console.log("state,action")
      state.consolidated = action.payload;
      state.loading = false;
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = datasSlice.actions;

export const getConsolidated = () => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axios.get(`${baseurl}/consolidated/`);
    // const sortedData = (response.data).sort((a, b) => a.name.localeCompare(b.name));
    // //////console.log(response.data)
    dispatch(fetchDataSuccess(response.data));
    return response.data
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export const disableConsolidated = (id) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    //////console.log(id)
    const token = localStorage.getItem('token');
    const response = await axios.put(`${baseurl}/consolidated/disable/${id}`,{
      headers: {
        Authorization: `${token}`
      }});
     return true;
    dispatch(fetchDataSuccess(response.data));
  } catch (error) {
    return false
    dispatch(fetchDataFailure(error.message));
  }
};

// export const getcontact=(data)=>async(dispatch)=>{

//     //////////////////console.log("hello")
//     const body={
//         project:undefined,
//         type:undefined
//     }
//     //////////////////console.log(body)
//     try {
//       const response = await axios.put(`${baseurl}/contact/all`,body);
//       // setData(response.data);
//       // ////////////////console.log(response.data)
//       // initialState.contacts=response.data
//       dispatch(fetchDataSuccess(response.data));
//       // ////////////////console.log("hi")

//     } catch (error) {
//       //console.error(error);
//     }

// }

export default datasSlice.reducer;


