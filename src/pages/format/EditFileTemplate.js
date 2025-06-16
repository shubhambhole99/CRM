import React, { useState,useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import { baseurl,Agency } from "../../api";
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import html2pdf from 'html2pdf.js';
import { use } from "react";
import { getfiletemplates } from "../../features/filetemplateslice";
import { jsPDF } from 'jspdf';

function App() {
  let { id } = useParams();
  const dispatch = useDispatch();
  const [filetemplate,setfiletemplate]=useState([])
  const [mode, setMode] = useState("edit"); // "edit" or "preview"
  const [rawHtml, setRawHtml] = useState("<p>~name~ hello ~age~ years</p>");
  const [inputValues, setInputValues] = useState({}); // Map for placeholder values
  const [showModal, setShowModal] = useState(false);
  const [name,setname]=useState('')
  const [type,settype]=useState('')
  const { filetemplates, loading, error } = useSelector((state) => state.filetemplates);
  
useEffect(() => {
  dispatch(getfiletemplates()).then((res) => {
    setfiletemplate(res)
    let file=res.find((item) => item._id == id)
    // console.log(res,file)
    setname(file.name?file.name:"")
    settype(file.type?file.type:"")
    setRawHtml(file.html?file.html:"<p>~name~ hello ~age~ years</p>")
    setInputValues(file.inputValues);
  })
},[])

  // Extract placeholders dynamically
  const extractPlaceholders = () => {
    const matches = rawHtml.match(/~[a-zA-Z0-9_]+~/g) || [];
    const uniquePlaceholders = new Set(matches); // Ensure uniqueness by using Set
    const placeholderMap = { ...inputValues };
    uniquePlaceholders.forEach((match) => {
      if (!placeholderMap[match]) placeholderMap[match] = ""; // Initialize new placeholders
    });
    return { uniquePlaceholders, placeholderMap };
  };

  const { uniquePlaceholders, placeholderMap } = extractPlaceholders();

  // Update input values dynamically
  const handleInputChange = (placeholder, value) => {
    setInputValues((prev) => ({
      ...prev,
      [placeholder]: value,
    }));
  };

  const handleUpdate=async()=>{
    await axios.put(`${baseurl}/filetemplate/${id}`, { name,type,rawHtml,inputValues })
      .then((response) => {
        toast.success("File Updated Successfully")
        // console.log(response.data);
      })
      .catch((error) => {
        toast.error("File with Same name and type already exist")
        console.error(error);
      });
  }

  // Render dynamic HTML with placeholders showing names and values in edit mode
  const renderHtmlContent = () => {
    let html = rawHtml;

    if (mode === "edit") {
      // Highlight placeholders with names and current values
      uniquePlaceholders.forEach((placeholder) => {
        const value = placeholderMap[placeholder] || "";
        html = html.replace(
          new RegExp(placeholder, "g"),
          `<span style="background-color: #007bff; color: white; padding: 2px 4px; border-radius: 3px;">
            ${placeholder.replace(/~/g, "")}: ${value}
          </span>`
        );
      });
    } else {
      // Replace placeholders with actual values
      uniquePlaceholders.forEach((placeholder) => {
        const value = placeholderMap[placeholder] || "";
        html = html.replace(new RegExp(placeholder, "g"), value);
      });
    }

    return html;
  };
  const generateDocx = () => {
    // let watermarkUrl = './b.jpg'; // Reference the image in the current directory


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

    let final = renderHtmlContent()
    // html2pdf()
    //   .from(final).set(opt)
    //   .save('document.pdf'); // Saves the file as PDF


    html2pdf().from(final).set(opt).toPdf().get('pdf').then((pdf) => {
      // const pdfWidth = pdf.internal.pageSize.width;
      // const pdfHeight = pdf.internal.pageSize.height;

      // // Add watermark image
      // const img = new Image();
      // img.src = './a.png'; // Replace with your watermark image URL

      // const img2 = new Image();
      // img2.src = './c.png'; // Path to the second imag

      img.onload = () => {
      //   img2.onload = () => {
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
          // pdf.addImage(img2, 'PNG', 2.5, 5, 0, 0, '', 'SLOW');

        }

        // Save the PDF with watermark on all pages
        pdf.save(`{name}` + ` Report`);
    //   };
    }
    }).catch(error => console.log(error));
    
  };
 
  const handlePdfGeneration = () => {
    const doc = new jsPDF('p', 'mm', 'a4');  // 'p' for portrait orientation, 'mm' for millimeters, 'a4' for A4 size
  
    // Get the HTML content to convert
    // const content = document.getElementById('html-content'); // Replace with your target content's ID
  
    // Use jsPDF's html method to capture the content and convert it to PDF
    doc.html(renderHtmlContent(), {
      callback: function (doc) {
        // Save the generated PDF with the desired name
        doc.save('generated-pdf.pdf');
      },
      margin: [10, 10, 10, 10],  // Set margins (top, left, bottom, right)
      x: 10,  // Starting x position (adjust if needed)
      y: 10,  // Starting y position (adjust if needed)
      // autoPaging: true,  // Auto page break
      width: 1,  // Adjust the width to scale the content properly
      windowWidth: 800, // Adjust window width for better scaling
      html2canvas: {
        scale: 0.2,  // Scale down to fit content better
        useCORS: true, // If using external resources like images
      },
      // Optional: Set the default font size if needed

    });
  };
  
    // const handlePdfGeneration = () => {
    //   const doc = new jsPDF();
    
    //   // Get the HTML content to convert
    //   const content = document.getElementById('html-content'); // Replace with your target content's ID
    
    //   // Use jsPDF's html method to capture the content and convert it to PDF
    //   doc.html(content, {
    //     callback: function (doc) {
    //       // Create a canvas for the watermark
    //       const canvas = document.createElement('canvas');
    //       const ctx = canvas.getContext('2d');
    
    //       const img = new Image();
    //       img.src = './a.png'; // Replace with your watermark image URL
    
    //       img.onload = () => {
    //         // Set canvas size to the image size
    //         canvas.width = img.width;
    //         canvas.height = img.height;
    
    //         // Set opacity (0.0 to 1.0)
    //         ctx.globalAlpha = 0.2; // Set opacity to 20%
    
    //         // Draw the image onto the canvas with opacity
    //         ctx.drawImage(img, 0, 0);
    
    //         // Convert canvas to data URL (base64 image)
    //         const dataUrl = canvas.toDataURL('image/png');
    //         const pdfWidth = doc.internal.pageSize.width;
    //         const pdfHeight = doc.internal.pageSize.height;
    
    //         // Add watermark to each page of the PDF
    //         const totalPages = doc.internal.pages.length;
    
    //         for (let i = 1; i <= totalPages; i++) {
    //           doc.setPage(i); // Set the current page
    //           doc.addImage(dataUrl, 'PNG', 2.5, 5, pdfWidth - 5, pdfHeight - 5, '', 'SLOW');
    //         }
    
    //         // Save the PDF with watermark on all pages
    //         doc.save('generated-pdf-with-watermark.pdf');
    //       };
    //     },
    //     margin: [0, 0, 0, 0],  // Add margins if necessary
    //     x: 0,  // Starting x position
    //     y: 0,  // Starting y position
    //   });
    // };

  return (
    <div style={{ padding: "20px" }}>
      <h1>HTML Builder with Named Placeholders</h1>

      {/* Mode Selector */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setMode("edit")}
          style={{
            padding: "10px",
            marginRight: "10px",
            backgroundColor: mode === "edit" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Edit Mode
        </button>
        <button
          onClick={() => setMode("preview")}
          style={{
            padding: "10px",
            backgroundColor: mode === "preview" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Preview Mode
        </button>
        <button
         onClick={(e)=>setShowModal(!showModal)}
          style={{
            padding: "10px",
            marginLeft: "10px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
         onClick={(e)=>handlePdfGeneration()}
          style={{
            padding: "10px",
            marginLeft: "10px",
            backgroundColor: "cyan",
            color: "black",
            border: "none",
            cursor: "pointer",
          }}
        >
          Print
        </button>
        <br/>
        {showModal && (
           <div>
           <p style={{marginTop:"20px"}} >Enter Name:<input type="text" value={name} 
           onChange={(e)=>setname(e.target.value)}/></p>
           <p>Enter Type: <select
          value={type}
           onChange={(e)=>{settype(e.target.value)
            console.log(e.target.value)
           }}
           >
           {Agency.map((item)=><option>{item}</option>)}
           </select></p>
          <button onClick={handleUpdate}>Save</button>
           </div>
        )}
       

      </div>

      {/* Inputs for Placeholders */}
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <h3>Inputs</h3>
        <div
          style={{
            display: "grid",
            width:"40%",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          {uniquePlaceholders.size > 0 ? (
            [...uniquePlaceholders].map((placeholder, index) => (
              <div key={placeholder} style={{ marginBottom: "10px" }}>
                <label>{index + 1}. {placeholder.replace(/~/g, "")}: </label>
                <input
                  type="text"
                  value={placeholderMap[placeholder]}
                  onChange={(e) => handleInputChange(placeholder, e.target.value)}
                  style={{ padding: "5px", width: "100%" }}
                />
              </div>
            ))
          ) : (
            <p>No placeholders found.</p>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          width:"100%",
          // border:"1px solid red",
          flexDirection: mode === "edit" ? "row" : "column",
        }}
      >
        {/* Editor Section */}
        {mode === "edit" && (
          <textarea
            style={{
              display:"flex",
              width:"40%",
              border:"10px solid red",
              height: "300px",
              border: "1px solid #ccc",
              padding: "10px",
              resize: "both", // Allows resizing from corners
              overflow: "auto", // Enables scrollbars when needed
            }}
            value={rawHtml}
            onChange={(e) => setRawHtml(e.target.value)}
            placeholder="Paste your raw HTML code here..."
          />
        )}

        {/* Rendered Content */}
        <div style={{ width:"60%" }}>
          {/* <h3>Rendered Output</h3> */}
          <div
            style={{
              display:"flex",
              border: "1px solid #ccc",
              // width:"50%",
              padding: "10px",
              minHeight: "600px",
              height: mode === "edit" ? "300px" : "auto", // Keep fixed height in edit mode
              overflowY: "auto", // Enable vertical scrolling
              resize: "both", // Make it resizable by dragging the corner
              overflow: "auto", // Ensures scrollbars are enabled while resizing
              maxHeight: "500px", // Set a maximum height for better UX
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: renderHtmlContent(),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
