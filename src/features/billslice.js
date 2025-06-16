

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {baseurl} from "../api";
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
// import { ToastContainer, toast } from 'react-toastify';


let initialState = {
  bills: [],
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
        // console.log(state)
      state.bills = action.payload;
      state.loading = false;
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchbillsafterdisable(state,action){
      // console.log(action,state)
      // useSelector((state) => state.bill);
      //  for(let i=0;i<bills.length;i++){
      //     if(bills[i]._id===row._id){
      //       bills[i].isDisabled = !bills[i].isDisabled
      //     }
      //   }
      
      state.bills=[]
    }
  }
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure,fetchbillsafterdisable} = datasSlice.actions;

export const getbill = (bool) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    let body={
      isDisabled:bool
    }
    
    const response = await axios.put(`${baseurl}/income/`,body);
    //////////////console.log(response.data,"billlllllllllllllllllllllllls")
    // initialState.bills=response.data.data
    dispatch(fetchDataSuccess(response.data.data));
    // resolve(response.data.data)
    // console.log(response.data.data)
    return response.data.data
    
  } catch (error) {
    //////////////////console.log(error)
    dispatch(fetchDataFailure(error.message));
  }
};

export const disableBill = (body) => async (dispatch) => {
  //////////console.log(body)
  try {
    //////////////console.log(body)

    const response = await axios.delete(`${baseurl}/income/${body}`);
    toast.success('Record deleted successfully'); // Display success toast
  } catch (error) {
    toast.error('Failed to delete record');

  }
};

export default datasSlice.reducer;


