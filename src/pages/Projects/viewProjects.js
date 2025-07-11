import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
import { baseurl, ProjectStatus } from "../../api";
import { useSelector, useDispatch } from 'react-redux';
import { triggerFunction, getPredefinedUrl } from '../../components/SignedUrl';
import { useHistory } from 'react-router-dom';
import { fetchProjects, importquestions, addfiles, deletefiles, OrderUpdate, createStory, getStories, deleteStory, OrderUpdateStory } from "../../features/projectslice";
import Multiselect from "../../components/Multiselect";
import { check, checkloginvailidity, geturl, timeinIndia } from '../../checkloggedin.js';
import { useParams } from 'react-router-dom';
import { getquestions } from '../../features/questionslice.js'
import { current } from "@reduxjs/toolkit";
import Swal from 'sweetalert2';
import { Rings } from 'react-loader-spinner';
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import FAQS from "./FAQS.js";
import FAQComponent from "./FAQS.js";
import Files from "./Files.js";
import AddFiles from "./AddFiles.js";
import History from "./History.js";
// import Excel from "./Excel.js";
import { getConsolidated, disableConsolidated } from "../../features/consolidatedSlice";
import ExcelSheetPreviewer from "./ExcelPreviewer.js";
import ViewBills from "../Billing/viewBills.js";
import CreateBill from "./Invoice/createBills.js"

const Comp = () => {

  // common for all
  const dispatch = useDispatch();

  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")

  const [projectName, setProjectName] = useState('');


  const [filename, setfilename] = useState('')
  const [createdate, setCreateDate] = useState('')
  let [editmode, seteditmode] = useState(false)

  const [developer, setDeveloper] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [area, setArea] = useState(0)
  const [company, setCompany] = useState('')
  const [pstage, setpstage] = useState('')
  let [filearr, setfilearr] = useState('')
  const [storyDate, setStoryDate] = useState('');
  const [storyText, setStoryText] = useState('');

  const [imageUrl, setImageUrl] = useState(null);
  const [isActive, setIsActive] = useState('false');
  let [companyname, setCompanyName] = useState("")
  let [feactive, setfeactive] = useState("")
  const [users, setUsers] = useState([])
  const [selectedusers, setSelectedusers] = useState([])

  const [currentPage, setCurrentPage] = useState(0);
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [selectedBill, setSelectedBill] = useState(null);


  const itemsPerPage = 5; //Define itemsPerPage

  // State variables for edit modal





  let [files, setfiles] = useState(null)


  const [ptype, setPtype] = useState('');
  const [arr, setArr] = useState([]);
  const [pstatus, setPstatus] = useState('')

  ////mine
  let [key, setKey] = useState("");
  let [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  let [selectedFiles, setSelectedFiles] = useState([])
  const [fileExtension, setFileExtension] = useState('');
  const [isFileSelected, setIsFileSelected] = useState(false);

  const [folderName, setFolderName] = useState(''); // State for folder name
  const [folders, setFolders] = useState([]); // State for storing folder names



  // For table
  let [regu, setregu] = useState(null)
  let { id } = useParams();



  //For FAQS
  let [question, setquestions] = useState([])
  let [selectedquestion, setselectedquestion] = useState([])
  let [selectedquestions, setselectedquestions] = useState([])
  let [existingquestion, setexistingquestion] = useState([])
  let [thisproject, setthisproject] = useState(null)
  let [editorder, seteditorder] = useState(false)
  ///for disabled

  let [isDisabled, setIsDisabled] = useState(false)
  let [isD, setIsD] = useState(false)
  let [isD1, setIsD1] = useState(false)
  const [bills, setBills] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [contact, setContact] = useState([]);
  const { id: projectId } = useParams();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const Today = new Date().toISOString().split("T")[0];
  const [createsdate, setCreatesDate] = useState(Today)
  const [formData, setFormData] = useState([{
    date: Today,
    orderNumber: '0',
    description: ''
  }]);

  let [stories, setStories] = useState([]);
  let [createdoption, setCreatedoption] = useState(0)
  const [type, setType] = useState("")
  const [pname, setPname] = useState(""); // Example for pname state
  const [nameofproject, setnameofproject] = useState("")
  const [enable, setenable] = useState(false)

let [conso,setConso]=useState(null)

  let history = useHistory();
  const types = ["Developer", "Financer", "MEP", "Structural", "Architect", "Land Owner", "Agent", "Miscellaneous Consultant", "Society Member"]
  //For Type,Consolidated
  useEffect(() => {

    dispatch(getConsolidated()).then((res) => {
      // console.log(res)
      // setConso(res)
      let temp=res.find((item)=>item.project==id)
      setConso(temp)
    }).catch(err => {
      //////console.log(err)
    })

    // Hello
    axios.get(`${baseurl}/question`)
      .then(response => {
        let arr = response.data
        arr.sort((a, b) => a.order - b.order);
        // //console.log(question)
        question = arr
        setquestions(arr)
      })
      .catch(error => {
        //console.error(error);
      })
    const fetchOptions = async () => {
      try {
        // Example asynchronous operation fetching data
        // const response = await fetch('your/api/endpoint');
        // const data = await response.json();
        // // Assuming the data received is an array of options
        const arr = ["Reg 30B", "33(1)", ...Array.from({ length: 31 }, (_, i) => `33(${i + 1})`)];
        setArr(arr);


      } catch (error) {
        //console.error('Error fetching options:', error);
      }
    };

    // Call the fetchOptions function to set the value of arr
    fetchOptions();
  }, [question.length]);

  /// for bill
  useEffect(() => {
    if (projectId) {
      axios.get(`${baseurl}/income/${projectId}`)
        .then(response => {
          // //////console.log('API response:', response.data); // Log the response to see its structure
          const data = response.data;

          // Check the structure of `data`
          // //////console.log('Data:', data);

          // Set bills based on the API response structure
          if (Array.isArray(data)) {
            setBills(data);
          } else if (data.data && Array.isArray(data.data)) {
            setBills(data.data);
          } else {
            setBills([]);
          }
        })
        .catch(error => console.error('Error fetching bills:', error));
    }
  }, [projectId, baseurl]);


  /// for task
  useEffect(() => {
    if (projectId) {
      axios.get(`${baseurl}/task/${projectId}`)
        .then(response => {
          // //////console.log('API response:', response.data); // Log the response to see its structure
          const data = response.data;

          // Check the structure of `data`
          // //////console.log('Data:', data);

          // Set bills based on the API response structure
          if (Array.isArray(data)) {
            setTasks(data);
          } else if (data.data && Array.isArray(data.data)) {
            setTasks(data.data);
          } else {
            setTasks([]);
          }
        })
        .catch(error => console.error('Error fetching task:', error));
    }
  }, [projectId, baseurl]);

  // for contact
  const handleFetch = async () => {
    const body = {
      project: pname,
      type: type,
    };

    try {
      const response = await axios.put(`${baseurl}/contact/all`, body);
      setData(response.data); // Store the fetched data in the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleFetch(); // Call the fetch function inside useEffect
  }, [pname, type]); // Optionally, trigger on changes to pname and type

  const filteredData = data.filter(item => item.projects.includes(projectId));

  const handleprojectFetch = async (e) => {
    ////////////////////////console.log(companyname)
    //////console.log(typeof (isDisabled))

    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: feactive ? feactive : null,
      isDisabled: isDisabled == 'true' ? true : false,
      type: regu ? regu : null,
    })).then((resp) => {
      setData(resp)
      //////console.log(resp)
    }).catch(error => {

    })
  }

  const getfiles = async (e) => {
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: feactive ? feactive : null,
      isDisabled: isDisabled === 'true' ? true : false,
      id: id
    })).then((resp) => {
      setthisproject(resp[0]);
      let currentProject = resp[0];
      console.log(currentProject)
      // Handle Files
      let tempFiles = currentProject.files;
      let finalFiles = tempFiles.filter((val) => !val.isDisabled);
      // console.log(tempFiles)
      setfiles(finalFiles);
      // console.log(finalFiles)
      // setmidfiles(finalFiles)

      // Handle Stories (similar to files)
      let tempStories = currentProject.stories;
      let finalStories = tempStories.filter((story) => !story.isDisabled);
      setStories(finalStories);
      setexistingquestion(currentProject.questions)

      // Handle FAQS
      //console.log(currentProject.questions)

    }).catch(error => {
      console.error("Error fetching projects:", error);
    });
  }


  useEffect(() => {
    // Fetch Projects
    dispatch(fetchProjects({
      company: companyname ? companyname : null,
      status: feactive ? feactive : null,
      isDisabled: isDisabled === 'true' ? true : false,
      id: id
    })).then((resp) => {
      setthisproject(resp[0]);
      let currentProject = resp[0];
      console.log(currentProject)
      // Handle Files
      let tempFiles = currentProject.files;
      let finalFiles = tempFiles.filter((val) => !val.isDisabled);
      // console.log(tempFiles)
      setfiles(finalFiles);
      // console.log(finalFiles)
      // setmidfiles(finalFiles)

      // Handle Stories (similar to files)
      let tempStories = currentProject.stories;
      let finalStories = tempStories.filter((story) => !story.isDisabled);
      setStories(finalStories);

      // Handle FAQS
      //console.log(currentProject.questions)
      setexistingquestion(currentProject.questions)

    }).catch(error => {
      console.error("Error fetching projects:", error);
    });

    // Fetch Users
    axios.get(`${baseurl}/user/`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [companyname, feactive, isDisabled, id]); // Add relevant dependencies for re-renders





  const handleimport = (e) => {
    e.preventDefault()
    dispatch(importquestions(id)).then((res) => {
      //   dispatch(fetchProjects({
      //     id
      //   })).then((resp) => {
      //     setthisproject(resp[0])
      //     thisproject = resp[0]
      //     //////console.log(thisproject)
      //     setexistingquestion(resp[0].questions)
      //   }).catch((err)=>{
      //     //console.log(err,"err1")
      //   })
    }).catch((err) => {
      //console.log(err, "err2")
    })
  }



  const handleEditSubmit = async (e) => {
    // s3
    e.preventDefault()
    // //////console.log("here")
    // //////console.log(selectedquestions)
    //////console.log(existingquestion)
    // let newquestions = []
    // for (let i = 0; i < existingquestion.length; i++) {
    //   newquestions.push(existingquestion[i])
    // }


    // for (let i = 0; i < selectedquestions.length; i++) {
    //   let flag = true
    //   for (let j = 0; j < existingquestion.length; j++) {
    //     if (existingquestion[i].question == selectedquestions[i]) {
    //       flag = false
    //       break
    //     }
    //   }
    //   //////console.log(flag)
    //   if (flag == true) {
    //     newquestions.push({ question: selectedquestions[i], answer: "" })
    //     //////console.log("pushing")
    //   }
    // }
    // //////console.log(newquestions)

    const token = localStorage.getItem('token');

    const editData = {
      questions: existingquestion
    };
    //////////////////////console.log(clickedImage)


    try {
      //////////////////////console.log(editselectedusers)
      const response = await axios.put(`${baseurl}/project/addquestions/${id}`, editData, {
        headers: {
          Authorization: `${token}`
        }
      });
      // //////////////////////console.log('Updated data:', response.data);
      toast.success('Data updated successfully');

      // Refresh
      dispatch(importquestions(id)).then((res) => {
        dispatch(fetchProjects({
          id
        })).then((resp) => {
          setthisproject(resp[0])
          thisproject = resp[0]
          //console.log(resp[0].questions)
          setexistingquestion(resp[0].questions)
        })
      })

      setShowModal(false);
      // window.location.reload()
      // setData(prevData => prevData.map(item => item._id === editItemId ? { ...item, ...editData } : item));
    } catch (error) {
      //console.error('Error updating record:', error);
      toast.error('Failed to update record');
    }
  }

  // redirect to projects page
  const handleRedirect = (id) => {
    history.push(`/projects/${id}`)
  }


  let startIndex = currentPage * itemsPerPage;
  let endIndex = (currentPage + 1) * itemsPerPage;
  // let currentItems = data.slice(startIndex, endIndex);
  const findprojectname = (project) => {
    //////////////////console.log(project,"Find project name")
    // //////////////////////console.log(pnamearr)
    let str = ""
    for (let i = 0; i < data.length; i++) {
      // //////////////////console.log(pnamearr[i])
      if (data[i]._id == project) {
        str = data[i].name
        break
      }

    }
    return str
  }

  const handleeditmode = async (e) => {
    try {
      const isValid = await checkloginvailidity();
      //////console.log(isValid)
      if (isValid) {
        seteditmode(!editmode);
      } else {
        toast.error("Not Verified Account");
      }
    } catch (error) {
      console.error("Error checking validity:", error);
      toast.error("An error occurred while checking validity");
    }
  };

  const findinexistingquestion = () => {

  }
  const findQuestion = (id) => {
    if (!id || question.length === 0) {
      return "";
    }

    const foundQuestion = question.find((item) => item._id === id);
    return foundQuestion ? foundQuestion.question : "";
  };
  const findQuestionType = (id) => {
    if (!id || question.length === 0) {
      return "";
    }

    const foundQuestion = question.find((item) => item._id === id);
    // //console.log(foundQuestion)
    return foundQuestion ? foundQuestion.type : "";
  };
  const findfile = (id) => {
    let temp = files.find((option) => option._id == id)
    return temp
  }

  const handlesubmit = (e) => {
    e.preventDefault()
    //////console.log("hello")

  }
  const handleAnswerChange = (index, newValue) => {
    // Create a copy of existingquestion array
    //console.log(index, newValue)
    const updatedQuestions = [...existingquestion];
    // Update the answer property for the specified index
    updatedQuestions[index] = { ...updatedQuestions[index], answer: newValue };
    // Update the state with the new array
    setexistingquestion(updatedQuestions);
  };
  const handleInputChange = (e, questionId) => {
    const updatedAnswers = existingquestion.map(answer =>
      answer.question === questionId
        ? { ...answer, answer: e.target.value }
        : answer
    );
    setexistingquestion(updatedAnswers);
  };






  // Function to filter and display stories based on `isDisabled` status







  const handleeditorder1 = (id, value) => {
    //////console.log(id, value);
    // Create a copy of the stories array
    let updatedStory = [...stories];

    // Loop through the array to find the story with the matching id
    for (let i = 0; i < updatedStory.length; i++) {
      if (updatedStory[i]._id === id) {
        //////console.log("found");
        // Update the order value
        updatedStory[i] = { ...updatedStory[i], order: Number(value) };
        break; // Exit the loop once the file is found and updated
      }
    }

    // Use setStories to update the state directly, which will trigger a re-render
    setStories(updatedStory);
    //////console.log(updatedStory);
  };



  const updateorder = () => {
    //////console.log(id)
  }






  const handleView = (bill) => {
    setSelectedBill(bill);
    setShowModal1(true);
  };

  const handleClose = () => setShowModal1(false);

  const handleViewTask = (tasks) => {
    setSelectedTask(tasks);
    setShowModal2(true);
  };
  const handleViewClick = (bill) => {
    setSelectedBill(bill);
    setShowModal5(true);
  };

  const handleCloseModal = () => {
    setShowModal2(false);
    setSelectedTask(null);
    setShowModal5(false);
  };

  const handleShowModalStory = () => setShowModal3(true);
  const handleCloseModalStory = () => setShowModal3(false);













  const sortByDateStory = () => {
    // Increment the createdoption to toggle through sorting states
    let temp = createdoption + 1;
    if (temp > 2) {
      temp = 1; // Reset to 1 if it exceeds the number of sorting options
    }
    setCreatedoption(temp);

    // Make sure formData is an array before sorting
    // if (!Array.isArray(formData)) {
    //   console.error('formData is not an array:', formData);
    //   return;
    // }

    // Make a copy of the data array to avoid mutating the state directly
    let sortedData = [...stories];

    // Sort the data based on created date
    if (temp === 1) {
      // Ascending order: Oldest first
      sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (temp === 2) {
      // Descending order: Newest first
      sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setStories(sortedData); // Update the state with the sorted data
  };
  // Files Section




  // Files Section Ends here
  const downloadFile = async (e, fileUrl, fileName) => {
    e.preventDefault()
    try {
      // Fetch the file
      const urlParts = fileUrl.split('/');
      // Replace the domain part (e.g., officecrm560)
      urlParts[2] = urlParts[2].replace(/^[^\.]+/, "officecrm560");
      fileUrl = urlParts.join('/');
      console.log(fileUrl)
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
  const generateDocx = () => {
    let watermarkUrl = './b.jpg'; // Reference the image in the current directory
    let htmlContent = ``
    let start = `  <html>
    <head>
        <style>
            .watermark {
                border:1px solid red;
                 top: 5%;
                transform: translate(-12%%, -30%); /* Proper centering */
                opacity:1;
                z-index: -1;
                pointer-events: none;
            }
           #example1 {
                border: 2px solid black;
                padding: 25px;
                position:relative
                
              }
                
            #example1 .background-image {
              width:95%;
              position: absolute;
    
            }
              
        </style>
    </head>
    <body>
    
    <div id="example1">
            <div class="background-image"></div>
             <img  class="background-image" src="./c.png" width="60%" />
             <br><br><br><br><br><br><br><br><br><br>
            <h1>Project:${nameofproject}</h1>
            `
    let end = `
                 </div>
    </body>
    </html>
    `;



    let count = 0
    question.forEach((option, index) => {
      const questionText = option.question || "Unknown Question";
      let currentAnswer = existingquestion.find(data => data.question === option._id);
      let tempfile;
      let flag = false;

      // if(count%10==0||count==0){
      //   console.log("here")
      //   htmlContent +=`<img class="watermark" src="./a.jpg" width="130%" />
      //     `
      // }
      // console.log(count)
      console.log(questionText, currentAnswer)
      if ((/XL/i.test(questionText) && /Feasibility/i.test(questionText)) || /pitched/i.test(questionText) || (currentAnswer?.answer == "")) {
        flag = true; // Skip this iteration if both words are found in the question text

      }
      else {
        count++
        // console.log(count,questionText,flag,currentAnswer.answer)
        // Handle "Text" type answer
        if (option.type === "Text") {
          htmlContent += `
            <p style="border:1px solid black;padding:2px"><strong>${count}. ${questionText}</strong></p>
            <pre style="white-space: pre-wrap;">${flag == true ? ("NA") : (currentAnswer?.answer || "NA")}</pre>
            <br>
          `;
        }
        // Handle "Link" type answer
        else if (option.type === "Link") {
          tempfile = currentAnswer ? findfile(currentAnswer.answer) : null; // Find corresponding file if available
          htmlContent += `
            <p style="border:1px solid black;padding:2px"><strong>${count}. ${questionText}</strong></p>
            <a style="color: blue; text-decoration: underline;" href="${flag == true ? (null) : (geturl(tempfile?.current) || '#')}" download>
              ${flag == true ? ("NA") : (tempfile?.filename || "NA")}
            </a>
            <br>
          `;
        }
      }

    });

    var opt = {
      margin: 0.5,
      // filename: 'myfile.pdf',
      // image:        { type: 'jpeg', quality: 0.98 },
      // html2canvas:  { scale: 2 },
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 3,  // High quality rendering
        // letterRendering: true, // Ensure letters are rendered properly

      },
      jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' },
      // jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // Create a PDF from the HTML content with the watermark

    let final = start + htmlContent + end
    // html2pdf()
    //   .from(final).set(opt)
    //   .save('document.pdf'); // Saves the file as PDF


    html2pdf().from(final).set(opt).toPdf().get('pdf').then((pdf) => {
      const pdfWidth = pdf.internal.pageSize.width;
      const pdfHeight = pdf.internal.pageSize.height;

      // Add watermark image
      const img = new Image();
      img.src = './a.png'; // Replace with your watermark image URL


      img.onload = () => {
        // Canvas
        // Create a canvas to adjust opacity
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to the image size
        canvas.width = img.width;
        canvas.height = img.height;

        // Set opacity (0.0 to 1.0)
        ctx.globalAlpha = 0.2; // Set opacity to 20%

        // Draw the image onto the canvas with opacity
        ctx.drawImage(img, 0, 0);

        // Convert canvas to data URL (base64 image)
        const dataUrl = canvas.toDataURL('image/png');
        const scale = 0.5; // Scale the watermark image
        const x = (pdfWidth - img.width * scale) / 2; // Center horizontally
        const y = (pdfHeight - img.height * scale) / 2; // Center vertically

        // Add watermark image to every page
        const totalPages = pdf.internal.pages.length;
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i); // Set the current page
          pdf.addImage(dataUrl, 'PNG', 2.5, 5, 0, 0, '', 'SLOW');
        }

        // Save the PDF with watermark on all pages
        pdf.save(`${nameofproject}` + ` Report`);
      };
    });
  };
  //   const doc = new jsPDF();
  //   doc.html(final, {
  //     callback: function (doc) {
  //         doc.save('output.pdf');
  //     },
  //     x: 10,
  //     y: 10,
  // });

  const [pdfFile, setPdfFile] = useState(null);

  const handleFilesChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };




  return (
    <>
      <ToastContainer />
      <Card border="light" className="shadow-sm">

      </Card>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Projects</Breadcrumb.Item>
            <Breadcrumb.Item active>Create Projects</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <h1>Project:{thisproject ? (<h1>{thisproject.name}</h1>) : (<p>Loading</p>)}</h1>
      <Tab.Container defaultActiveKey="clstory">
        <Nav fill variant="pills" className="flex-column flex-sm-row">

          <Nav.Item>
            <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">FAQS</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="clstory" className="mb-sm-3 mb-md-0">Client Story</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">Files</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Add" className="mb-sm-3 mb-md-0">Add Files</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="stagesofpayment" className="mb-sm-3 mb-md-0">Stages of Payment</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="bills" className="mb-sm-3 mb-md-0">Bills/Invoice</Nav.Link>
          </Nav.Item>
          {(check()[1]=="john_doe"||check()[1]=="riteshk") && (
          <Nav.Item>
            <Nav.Link eventKey="makebill" className="mb-sm-3 mb-md-0">Create Bill</Nav.Link>
          </Nav.Item>
       )}
          <Nav.Item>
            <Nav.Link eventKey="task" className="mb-sm-3 mb-md-0">Task</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="contact" className="mb-sm-3 mb-md-0">Conatct</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          {/* FAQ Section */}

          <Tab.Pane eventKey="stagesofpayment" className="py-4">

          <ExcelSheetPreviewer conso={conso}/>

          </Tab.Pane>


          <Tab.Pane eventKey="home" className="py-4">

            {/* no <Button  variant="secondary" size="sm" onClick={handleeditmode}>Edit</Button> */}
            {/* <div>
      <h1>Upload PDF and Apply Watermark</h1>
      <input type="file" accept="application/pdf" onChange={handleFilesChange} />
      {pdfFile && (
        <div>
          <p>Selected PDF: {pdfFile.name}</p>
          <button onClick={applyWatermark}>Apply Watermark</button>
        </div>
      )}
    </div> */}
            {/* <div style={{border:"1px solid red",display:"flex"}}>
  <img style={{width:"100%"}} src="./c.png"></img>
  <div style={{fontSize:"80px",alignContent:"flex-end"}}>
  <h1 style={{fontSize:"80px",alignContent:"flex-end"}}>BZ CONSULTANTS</h1>
  </div>
</div>
<hr style={{border:"3px solid black"}}/> */}


            {/* faqs */}
            <section>
              {/*  no <Button style={{minHeight:"10000px"}} variant="secondary" size="sm" onClick={handleeditmode}>Edit</Button> */}

              <Container >

                <Row>
                  <Col style={{ border: "0px solid red", maxWidth: "5%" }} className="mx-auto">
                    <Button style={{ minHeight: "100%" }} variant="secondary" size="sm" onClick={handleeditmode}>
                      <p>Edit</p>
                    </Button>
                  </Col>
                  <Col style={{ border: "0px solid red", maxWidth: "5%" }} className="mx-auto">
                    <Button style={{ minHeight: "100%" }} variant="secondary" size="sm" onClick={(e) => handleimport(e)}>
                      <p>Import</p>
                    </Button>
                  </Col>
                  <Col className="mx-auto">
                    <Card style={{ border: "5px solid red" }} border="light" className="shadow-sm text-start">

                      <Card.Header>

                        <Col className="text-start">
                          <Button variant="secondary" size="sm" onClick={handleeditmode}>Edit</Button>
                          {/* {editmode && ( */}
                          <Button variant="secondary" size="sm" onClick={(e) => handleimport(e)}>Import</Button>
                          {/* )} */}
                          <Button variant="secondary" size="sm" onClick={(e) => setenable(!enable)}>Create Public</Button>
                          <Button variant="secondary" size="sm" onClick={(e) => generateDocx(e)}>Generate Without Project Name</Button>

                          {/* )} */}
                          {enable && (<>
                            <Form.Control
                              type="text"
                              name="date"
                              value={nameofproject}
                              onChange={(e) => {
                                setnameofproject(e.target.value)
                                // console.log("hi")
                              }}
                              required
                            />
                            <Button variant="secondary" size="sm" onClick={(e) => generateDocx(e)}>Submit</Button>

                          </>
                          )

                          }
                        </Col>
                      </Card.Header>
                      {
                        existingquestion && question && question.map((option, index) => {
                          let currentAnswer = existingquestion.find(data => data.question === option._id);
                          let tempfile;
                          // //console.log(option.type)
                          if (option.type == "Link") {
                            tempfile = currentAnswer ? findfile(currentAnswer.answer) : null;
                            // //console.log(tempfile)
                          }

                          return (

                            <>

                              <div style={{ backgroundColor: currentAnswer?.answer == "" ? "black" : "none" }}>
                                <React.Fragment key={option._id}>
                                  <p style={{ border: "1px solid black" }}>{index + 1}.{option.question}</p>
                                  {editmode ? (
                                    option.type === "Text" ? (
                                      <>
                                        <textarea
                                          value={currentAnswer?.answer || ''}
                                          onChange={(e) => handleInputChange(e, option._id)}
                                          style={{ width: "100%", minHeight: "60px" }}
                                        />
                                        <Form.Select
                                          required
                                          value=""
                                          onChange={(e) => handleInputChange(e, option._id)}
                                        >
                                          <option value={""}>Nothing</option>
                                          {currentAnswer.prevanswer.map((prevOption, idx) => (
                                            <option key={idx} value={prevOption}>{prevOption}</option>
                                          ))}
                                        </Form.Select>
                                      </>

                                    ) : (
                                      <>
                                        <a
                                          onClick={(e) => {
                                            let pawan = (tempfile?.current).split(".")
                                            downloadFile(e, tempfile?.current, tempfile?.filename + "." + pawan[pawan.length - 1])
                                          }}
                                          style={{ color: "blue", textDecoration: "underline" }}>
                                          {tempfile?.filename || "File not found"}
                                        </a>
                                        <Form.Select
                                          required
                                          value=""
                                          onChange={(e) => handleInputChange(e, option._id)}
                                        >

                                          <option value="">Select File</option>
                                          <option value="">Null</option>
                                          {files.map((file, idx) => (
                                            <option key={idx} value={file._id}>{file.filename}</option>
                                          ))}
                                        </Form.Select>
                                        <Form.Select
                                          required
                                          value=""
                                          onChange={(e) => handleInputChange(e, option._id)}
                                        >
                                          {currentAnswer?.prevanswer.map((prevOption, idx) => (
                                            <option key={idx} value={prevOption}>{prevOption}</option>
                                          ))}
                                        </Form.Select>

                                      </>
                                    )
                                  ) : (
                                    option.type === "Text" ? (
                                      <pre style={{ whiteSpace: "pre-wrap" }}>{currentAnswer?.answer}</pre>
                                    ) : (
                                      <a
                                        onClick={() => {
                                          const extension = (tempfile?.current).split(".").pop();
                                          downloadFile(e, tempfile?.current, `${tempfile?.filename}.${extension}`)
                                        }}
                                        style={{ color: "blue", textDecoration: "underline" }}
                                      >
                                        {tempfile?.filename || "File not found"}
                                      </a>
                                    )
                                  )}

                                </React.Fragment>
                              </div>
                            </>

                          );

                        })
                      }
                      <Col className="text-start">
                        <Button variant="secondary" size="sm" onClick={handleEditSubmit}>Submit</Button>
                      </Col>

                    </Card>
                  </Col>
                  <Col style={{ border: "0px solid red", maxWidth: "5%" }} className="mx-auto">
                    <Button style={{ minHeight: "100%" }} variant="secondary" size="sm" onClick={handleEditSubmit}>Submit</Button>
                  </Col>
                </Row>
              </Container>
            </section>
            {/* faqs */}
          </Tab.Pane>
          {/* Client Section */}
          <Tab.Pane eventKey="clstory" className="py-4">
            {thisproject && <History project={thisproject} />}
          </Tab.Pane>


          {/* Files Section */}
          <Tab.Pane eventKey="profile" className="py-4">

            {files && <Files files={files} id={id} setfiles={setfiles} thisproject={thisproject} />

            }
          </Tab.Pane>


          {/* Add Files Section */}
          <Tab.Pane eventKey="Add" className="py-4">
            <AddFiles thisproject={thisproject} id={id} getfiles={getfiles} files={files} />
          </Tab.Pane>
          {/* Bills Section */}
          <Tab.Pane eventKey="bills" className="py-4">
           <ViewBills ptbf={id}/>
          </Tab.Pane>

          <Tab.Pane eventKey="makebill" className="py-4">
           <CreateBill ptbf={id}/>
          </Tab.Pane>

          {/* Modal for viewing bill details */}
          {selectedBill && (
            <Modal show={showModal5} onHide={() => setShowModal5(false)} style={{ backgroundColor: "transparent" }}>
              <Modal.Header closeButton>
                <Modal.Title>Bill Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p><strong>Company:</strong> {selectedBill.company}</p>
                <p><strong>Amount:</strong> Rs {selectedBill.amount}</p>
                <p><strong>Date:</strong> {new Date(selectedBill.createdAt).toLocaleDateString()}</p>
                <p><strong>Subject:</strong> {selectedBill.subject}</p>
                <p><strong>Type:</strong> {selectedBill.type}</p>
                <p><strong>GST:</strong> {selectedBill.gst}</p>
                <p><strong>TDS:</strong> {selectedBill.tds}</p>
                <p><strong>Bank:</strong> {selectedBill.bank}</p>
                <p><strong>Person:</strong> {selectedBill.person}</p>
                <p><strong>Description:</strong> {selectedBill.description}</p>
                <p><strong>Previous:</strong> {selectedBill.previous.map((item, idx) => (
                  <span key={idx}>{item.name}{idx < selectedBill.previous.length - 1 ? ', ' : ''}</span>
                ))}</p>
                <p><strong>URLs:</strong> {selectedBill.urls.map((url, idx) => (
                  <a key={idx} href={url.link} target="_blank" rel="noopener noreferrer">
                    {url.name}
                  </a>
                ))}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}

          {/* Task Section */}
          <Tab.Pane eventKey="task" className="py-4">
            <section>
              <Container>
                <Row>
                  <Col xs={12}>
                    <Card>
                      <Card.Header>Task Management</Card.Header>
                      <Card.Body>
                        {tasks && tasks.length > 0 ? (
                          <Table responsive>
                            <thead>
                              <tr>
                                <th scope="col">Task No.</th>
                                <th scope="col">Project ID</th>
                                <th scope="col">Task Details</th>
                                <th scope="col">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tasks.map((task) => (
                                <tr key={task._id}>
                                  <td>{task.nooftask}</td>
                                  <td>{task.projectid}</td>
                                  <td>
                                    <p>{task.taskname || 'No task name provided'}</p>
                                    <p>{task.description || 'No description provided'}</p>
                                  </td>
                                  <td>
                                    <Button variant="primary" onClick={() => handleViewTask(task)}>
                                      View
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p>No tasks available.</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>

              {/* Task Details Modal */}
              <Modal show={showModal2} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedTask ? (
                    <div>
                      <p><strong>Task No:</strong> {selectedTask.nooftask}</p>
                      <p><strong>Project ID:</strong> {selectedTask.projectid}</p>
                      <p><strong>Task Subject:</strong> {selectedTask.taskSubject || 'No subject provided'}</p>
                      <p><strong>Task Description:</strong> {selectedTask.taskDescription || 'No description provided'}</p>
                      <p><strong>Assigned To:</strong> {selectedTask.assignTaskTo.join(', ') || 'No assignees'}</p>
                      <p><strong>Task Completed:</strong> {selectedTask.taskCompleted ? 'Yes' : 'No'}</p>
                      <p><strong>Task URL:</strong> {selectedTask.taskUrl || 'No URL provided'}</p>
                      <p><strong>Created At:</strong> {new Date(selectedTask.CreatedAt).toLocaleString()}</p>
                      <p><strong>Completed At:</strong> {selectedTask.CompletedAt ? new Date(selectedTask.CompletedAt).toLocaleString() : 'Not completed'}</p>
                      <p><strong>Task History:</strong> {selectedTask.taskHistory.length > 0 ? selectedTask.taskHistory.join(', ') : 'No history available'}</p>
                    </div>
                  ) : (
                    <p>Loading task details...</p>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </section>
          </Tab.Pane>

          {/* Contact Section */}
          <Tab.Pane eventKey="contact" className="py-4">
            <section>
              <Container>
                <Form.Group id="people" className="mb-4">
                  <Form.Label>Consultants</Form.Label>
                  <InputGroup>
                    <InputGroup.Text></InputGroup.Text>
                    <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="">Select Option</option>
                      {types.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
                <Row>
                  <Col xs={12}>
                    <Card>
                      <Card.Header>Conatct Information</Card.Header>
                      <Card.Body>
                        <p>Here you can view your contact.</p>
                        <Table responsive>
                          <thead>
                            <tr>
                              <th scope="col">Name</th>
                              <th scope="col">Contact No</th>
                              <th scope="col">Email</th>
                              <th scope="col">Type</th>
                              <th scope="col">Description</th>
                              <th scope="col">Project</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.length > 0 ? (
                              filteredData.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.name}</td>
                                  <td>{item.phone}</td>
                                  <td>{item.email}</td>
                                  <td>{item.type}</td>
                                  <td>{item.description}</td>
                                  <td>
                                    {item.projects && item.projects.length > 0 ? (
                                      <ul>
                                        {item.projects.map((project, idx) => (
                                          <li key={idx}>{project}</li> // Map through the projects array
                                        ))}
                                      </ul>
                                    ) : (
                                      "No projects"
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6">No data found for this project</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </section>
          </Tab.Pane>

        </Tab.Content>
      </Tab.Container >

      {/* <Modal show={showModal && !editMode} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>{data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={clickedImage} alt="Zoomed Image" style={{ maxWidth: "100%" }} onClick={() => setEditMode(true)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
      {/* Edit file modal */}

    </>
  );
};


export default Comp;