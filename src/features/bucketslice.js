import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseurl } from '../api';
import { toast } from 'react-toastify';

const initialState = {
  buckets: [],
  bucket: null,
  loading: false,
  error: null,
  trigger:false,
  today:[]
};

const bucketSlice = createSlice({
  name: 'buckets',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBucketsSuccess(state, action) {
      state.buckets = action.payload;
      state.loading = false;
    },
    fetchBucketByIdSuccess(state, action) {
      state.bucket = action.payload;
      state.loading = false;
    },
    updateBucketSuccess(state, action) {
      state.buckets = state.buckets.map(bucket =>
        bucket._id === action.payload._id ? action.payload : bucket
      );
      state.loading = false;
    },
    deleteTaskSuccess(state, action) {
      state.buckets = state.buckets.map(bucket =>
        bucket._id === action.payload.bucketId
          ? { ...bucket, tasks: bucket.tasks.filter(task => task._id !== action.payload.taskId) }
          : bucket
      );
      state.loading = false;
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setTrigger(state) {
      console.log("trigger")
      state.trigger = !state.trigger; // Toggle trigger state
    },
    setToday(state,action){
      state.today = action.payload;
    }
  }
});

// Export the actions
export const {
  fetchDataStart,
  fetchBucketsSuccess,
  fetchBucketByIdSuccess,
  updateBucketSuccess,
  deleteTaskSuccess,
  fetchDataFailure,
  setTrigger,
  setToday
} = bucketSlice.actions;

// Thunks for async logic

// Fetch all buckets
// Fetch all buckets
export const getAllBuckets = () => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axios.get(`${baseurl}/bucket/buckets/all`);
    dispatch(fetchBucketsSuccess(response.data));
    return response.data; // Explicitly return the fetched data
  } catch (error) {
    // toast.error("Error fetching buckets");
    dispatch(fetchDataFailure(error.message));  // Rethrow the error to handle it in the component if necessary
  }
};


// Get a bucket by ID
export const getBucketById = (userId) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axios.get(`${baseurl}/buckets/${userId}`);
    dispatch(fetchBucketByIdSuccess(response.data));
  } catch (error) {
    toast.error("Error fetching bucket by ID");
    dispatch(fetchDataFailure(error.message));
  }
};

// Update a bucket by bucketId
export const updateBucket = (userId, bucketId, bucketData) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axios.put(`${baseurl}/bucket/buckets/${userId}/${bucketId}`, bucketData);
    toast.success("Bucket updated successfully");
    dispatch(updateBucketSuccess(response.data));
  } catch (error) {
    toast.error("Error updating bucket");
    dispatch(fetchDataFailure(error.message));
  }
};

// Delete a task from a bucket
export const deleteTaskFromBucket = (userId, bucketId, taskId) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    await axios.put(`${baseurl}/bucket/buckets/${userId}/${bucketId}/${taskId}`);
    toast.success("Task deleted successfully");
    dispatch(deleteTaskSuccess({ userId, bucketId, taskId })); 
  } catch (error) {
    console.log(error)
    toast.error("Error deleting task from bucket");
    dispatch(fetchDataFailure(error.message));
  }
};

export default bucketSlice.reducer;
