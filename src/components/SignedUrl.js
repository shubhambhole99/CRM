


import AWS from 'aws-sdk'
import axios from "axios";
// let bucketName = 'bholeofficecrm';
let bucketName = 'officecrm560';
const triggerFunction = async (extension, foldername) => {
  let key1 = '';
  let earr = extension.split('.');

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure month is two digits
  
  if (foldername[foldername.length - 1] === '/') {
    key1 = `${year}/${month}/${foldername}${earr[0]}${Date.now()}.${earr[earr.length - 1]}`;
  } else if (foldername.length !== 0) {
    key1 = `${year}/${month}/${foldername}/${earr[0]}${Date.now()}.${earr[earr.length - 1]}`;
  } else {
    key1 = `${year}/${month}/${earr[0]}${Date.now()}.${earr[earr.length - 1]}`;
  }

  try {
    //Rekha
    // const response = await axios.post("https://tow8pxaaig.execute-api.ap-south-1.amazonaws.com/prod/gsu", {
    //Shubham 
    const response = await axios.post("https://jiycm07tpk.execute-api.ap-south-1.amazonaws.com/prod/gsu", {
      bucket: bucketName,
      key1,
      Expires: 300,
    });

    let arr = [response.data.signedUrl, key1];
    //////console.log(arr); // Log the array containing signedUrl and key1

    return arr; // Return the array as the result of triggerFunction
  } catch (error) {
    console.error('Error fetching signedUrl:', error);
    throw error; // Propagate the error if needed
  }
};

const getPredefinedUrl = (key1) => {
  // Replace all spaces with '+'
  //////console.log(key1)
  const modifiedKey = encodeURIComponent(key1);
  return `https://${bucketName}.s3.ap-south-1.amazonaws.com/${modifiedKey}`;
};


export { triggerFunction, getPredefinedUrl };