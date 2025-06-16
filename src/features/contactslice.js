// dataSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import {baseurl} from "../api";

const initialState = {
  contacts: [],
  loading: false,
  error: null
};

const datasSlice = createSlice({
  name: 'contac',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess(state, action) {
        //////////////////console.log("state,action")
      state.contacts = action.payload;
      state.loading = false;
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = datasSlice.actions;

export const getcontacts = () => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axios.put(`${baseurl}/contact/all`);
    const sortedData = (response.data).sort((a, b) => a.name.localeCompare(b.name));


    dispatch(fetchDataSuccess(sortedData));
    return sortedData
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export const deleteContact = (data) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const token = localStorage.getItem('token');
    console.log(data)
    const response = await axios.delete(`${baseurl}/contact/${data}`,{
      headers: {
        Authorization: `${token}`
      }});
     return true;
    dispatch(fetchDataSuccess(response.data));
  } catch (error) {
    // console.log(error)
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


