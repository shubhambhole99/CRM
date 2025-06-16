
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk'; // Import Redux Thunk middleware
import userReducer from './features/userslice';
import taskReducer from './features/taskslice';
import projectReducer from './features/projectslice';
import taskhistoryslice from './features/taskhistoryslice';
import contactReducer from './features/contactslice';
import invoiceReducer from './features/invoiceSlice';
import billReducer from './features/billslice'
import consolidatedReducer from './features/consolidatedSlice';
import questionReducer from './features/questionslice';
import correspondenceReducer from './features/correspondenceSlice';
import filetemplatesReducer from './features/filetemplateslice';
import expenseInvoiceReducer from './features/expenseInvoiceSlice'
import expenseReducer from './features/expenseSlice'
import bucketReducer from './features/bucketslice';
const store = configureStore({
  reducer: {
    users: userReducer,
    task: taskReducer,
    taskhistoryslice:taskhistoryslice,
    project:projectReducer,
    contact:contactReducer,
    invoice:invoiceReducer,
    bill:billReducer,
    consolidatedSlice:consolidatedReducer,
    questionSlice:questionReducer,
    correspondence:correspondenceReducer,
    filetemplates:filetemplatesReducer,
    expenseInvoices:expenseInvoiceReducer,
    expense:expenseReducer,
    bucket: bucketReducer

  },
});


export default store;

