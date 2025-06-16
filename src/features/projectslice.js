// dataSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseurl } from "../api";
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import { triggerFunction, getPredefinedUrl } from '../components/SignedUrl';

const initialState = {
  projects: [],
  stories: [],
  loading: false,
  error: null
};

const datasSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess(state, action) {
      state.projects = action.payload;
      state.loading = false;
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    DISABLE_FILE_SUCCESS(state, action) {
      state.projects = state.projects.map(project => ({
        ...project,
        files: project.files.map(file =>
          file._id === action.payload ? { ...file, disabled: true } : file
        ),
      }));
    },
    ORDER_UPDATE_SUCCESS(state, action) {
      state.projects = state.projects.map(project => ({
        ...project,
        files: action.payload,
      }));
    },
    // Reducer to handle fetching stories
    // Add success reducer for fetching stories
    fetchStoriesSuccess(state, action) {
      state.stories = action.payload;
      state.loading = false;
    },
    createStorySuccess(state, action) {
      state.stories.push(action.payload);
    },
    DISABLE_FILE_STORY_SUCCESS(state, action) {
      state.projects = state.projects.map(project => ({
        ...project,
        stories: project.stories.map(story =>
          story._id === action.payload ? { ...story, disabled: true } : story
        ),
      }));
    },

  }
});

export const {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  DISABLE_FILE_SUCCESS,
  ORDER_UPDATE_SUCCESS,
  fetchStoriesSuccess,
  createStorySuccess,
  DISABLE_FILE_STORY_SUCCESS
} = datasSlice.actions;

export const fetchProjects = (body) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    // ////////console.log(body)
    if (body.isDisabled == undefined) {
      body.isDisabled = false
    }
    const response = await axios.put(`${baseurl}/project/`, body);
    dispatch(fetchDataSuccess(response.data));
    let proj = []
    for (let i = 0; i < (response.data).length; i++) {
      proj[i] = (response.data)[i]
    }
    // proj.sort((a1, b1) => a1.name?.localeCompare(b1.name));
    proj.sort((a1, b1) => {
      return a1.name?.localeCompare(b1.name, undefined, { numeric: true });
    });
    // console.log(proj)
    return proj

  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};


export const importquestions = (id) => async (dispatch) => {
  // dispatch(fetchDataStart());
  try {
    //console.log(id)

    await axios.put(`${baseurl}/project/imquestion/${id}`);
    // window.location.reload();


  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export const addfiles = (body) => async (dispatch) => {
  // dispatch(fetchDataStart());

  if (body.file.length != 0) {
    //////console.log("hi")
    let filearr = body.file
    let selectedFile = filearr[0][2]
    body.url = getPredefinedUrl((body.file)[0][1])
    //console.log(body.file)
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
        // Perform your upload logic here
        // For demonstration, let's just log the file extension and content
        //////////////////////console.log('Selected File Extension:', fileExtension);
        //////console.log('File Content:', fileContent);

        try {
          // Example: Uploading file content using Fetch
          const responseFile = await fetch(filearr[0][0], {
            method: 'PUT',
            body: filearr[0][2],
            headers: {
              'Content-Type': 'application/octet-stream', // Set appropriate content type
            },
            mode: 'cors', // Enable CORS
          });
          if (!responseFile.ok) {
            throw new Error('Network response was not ok');
          }
          toast.success("File Uploaded Succesfully")
          //////console.log('File uploaded successfully:');
        } catch (error) {
          console.error('Error:', error);
          toast.error('Failed to add image'); // Display error toast if addition fails
        }
      }

      reader.readAsArrayBuffer(selectedFile);
    }
  }
  (async () => {
    //  //////console.log((body.file)[0][2])
    try {
      let bodyu = {
        filename: body.filename,
        id: body.id,
        date: body.date,
        url: body.url != "" ? body.url : undefined
      }
      // //////console.log(bodyu,body.url)
      await axios.put(`${baseurl}/project/addfiles/${body.id}`, bodyu);
      //////////////////////console.log(responseFormData);
      toast.success('Image added successfully'); // Call toast.success after successful addition


      // Clear form data after submission
    } catch (error) {
      //console.error('mongo db error', error);
      toast.error('Failed to add image'); // Display error toast if addition fails
    }
  })();

};

export const deletefiles = (pid, fid) => async (dispatch) => {
  //////console.log(pid, fid);
  try {
    await axios.delete(`${baseurl}/project/files/${pid}/${fid}`);
    dispatch({ type: 'DISABLE_FILE_SUCCESS', payload: fid });
    toast.success('File disabled successfully!');
  } catch (err) {
    toast.error('Failed to disable file. Please try again.');
    console.error('Error disabling file:', err);
  }
};

export const OrderUpdate = (pid, files) => async (dispatch) => {
  try {
    let filesArray = Array.isArray(files) ? files : [];
    let body = {
      files: filesArray.map(file => ({
        ...file,
        fid: file._id.toString()
      }))
    };

    const response = await axios.put(`${baseurl}/project/update-order/${pid}`, body);
    let sortedFiles = response.data.files.sort((a, b) => a.orderNumber - b.orderNumber);
    dispatch(ORDER_UPDATE_SUCCESS(sortedFiles));
    window.location.reload();
  } catch (err) {
    console.error('Error while updating order:', err);
  }
};

export const getStories = (pid) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axios.get(`${baseurl}/project/stories/${pid}`);
    dispatch(fetchStoriesSuccess(response.data.stories));
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export const createStory = (pid, storyData) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const response = await axios.post(`${baseurl}/project/stories/${pid}`, storyData);
    dispatch(createStorySuccess(response.data.story));
    toast.success('Story created successfully!');
    // window.location.reload();
  } catch (error) {
    console.log(error)
    dispatch(fetchDataFailure(error.message));
    toast.error('Failed to create story.');
  }
};

export const deleteStory = (pid, sid) => async (dispatch) => {
  try {
    //////console.log(`Deleting story with pid: ${pid} and sid: ${sid}`);
    const response = await axios.delete(`${baseurl}/project/stories/${pid}/${sid}`);
    
    // Check the response status and data
    //////console.log("API response status:", response.status);
    //////console.log("API response data:", response.data);
    
    if (response.status === 200) {
      dispatch({ type: 'DISABLE_FILE_STORY_SUCCESS', payload: sid });
      //////console.log("Story disabled successfully, sid:", sid);
      toast.success('File disabled successfully!');
    } else {
      throw new Error('Unexpected response status');
    }
  } catch (err) {
    console.error('Error disabling file:', err);
    toast.error('Failed to disable file. Please try again.');
  }
};




export const OrderUpdateStory = (pid, stories) => async (dispatch) => {
  try {
    let storiesArray = Array.isArray(stories) ? stories : [];
    let body = {
      stories: storiesArray.map(story => ({
        ...story,
        sid: story._id.toString() // Convert _id to string and assign to sid
      }))
    };

    //////console.log('Request body sent to backend:', body); // Log body for verification

    const response = await axios.put(`${baseurl}/project/stories/${pid}`, body);
    let sortedStories = response.data.stories.sort((a, b) => a.orderNumber - b.orderNumber);
    dispatch(ORDER_UPDATE_SUCCESS(sortedStories));
    // window.location.reload();
  } catch (err) {
    console.error('Error while updating order:', err);
  }
};






export default datasSlice.reducer;


