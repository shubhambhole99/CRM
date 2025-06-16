// const jwt = require('jsonwebtoken');
import axios from "axios";
import { baseurl, ProjectStatus,database } from "./api";
const check=()=>{
    const token = localStorage.getItem('token');

    // Decode the JWT to extract details
    if (token) {
      // Split the token into its three parts: header, payload, signature
      // console.log(token)
      const tokenParts = token.split('.');
      // console.log(tokenParts )
      // Decode the payload (second part of the token)
      const payload = JSON.parse(atob(tokenParts[1]));
      // console.log(payload)
      // Extract user details from the payload
      const userId = payload.userId;
      const username = payload.username;
      const role=payload.role
      // const paths=payload.paths
      ////////////////////console.log(role)
      const userPermissions = {
        canViewProjects: true,
        canCreateTasks: true,
        canViewTasks: true, // Example of a permission that the user doesn't have
      };
      const adminPermissions = {
        canViewProjects: true,
        canCreateTasks: true,
        canViewTasks: true, // Example of a permission that the user doesn't have
      };
      const permission=role=='user'?userPermissions:adminPermissions
      ////////////////////console.log(userId)
      // You can use the extracted details as needed
      return [userId,username,role,permission,token]
      ////////////////////console.log("User ID:", userId);
      ////////////////////console.log("Username:", username);
    } else {
      ////////////////////console.log("Token not found in local storage");
    }

}
const checkloginvailidity=async ()=>{
//////console.log(check())
let body={
  id:check()[4]
}
try{
const res=await axios.put(`${baseurl}/user/check`, body,{
  headers: {
  Authorization: `${check()[4]}`
}})
return (res.data.data)
}
catch{
  return false
}
}
const checkpermission= (user)=>{
  // console.log(check()[0]==user)
  return check()[1]=="john_doe"||check()[0]==user
}
const geturl=(originalUrl)=>{
  if(originalUrl){
  const urlParts = originalUrl.split('/');
  // Replace the domain part (e.g., officecrm560)
  urlParts[2] = urlParts[2].replace(/^[^\.]+/, database);
  // console.log(urlParts.join('/'))
  return urlParts.join('/');
  }
}  
const timeinIndia = (date) => {
  const utcTime = new Date(date);
  const istTime = utcTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  // const istTime = utcTime.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

  // console.log(istTime)
  return (istTime);
  // const utcTime = new Date(); // Gets the current UTC time
  // const istTime = utcTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  // // console.log(istTime)
  // return istTime;
  
}
const dateinIndia = (date) => {
  const utcTime = new Date(date);
  // const istTime = utcTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const istTime = utcTime.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

  // console.log(istTime)
  return (istTime);
  // const utcTime = new Date(); // Gets the current UTC time
  // const istTime = utcTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  // // console.log(istTime)
  // return istTime;
  
}


const downloadFile = async (fileUrl, fileName) => {
  try {
      // Fetch the file
      const urlParts = fileUrl.split('/');
      // Replace the domain part (e.g., officecrm560)
      urlParts[2] = urlParts[2].replace(/^[^\.]+/, "officecrm560");
      fileUrl = urlParts.join('/');
      // console.log(fileUrl)
      const response = await fetch(fileUrl);
      if (!response.ok) {
          throw new Error("Failed to fetch file");
      }
      const blob = await response.blob();

      // Create a link element and download the file with a custom name
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // Specify the custom file name here
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
  } catch (error) {
      console.error("Error downloading the file:", error);
  }
}
export { check,checkloginvailidity,geturl,timeinIndia,dateinIndia,checkpermission,downloadFile };

