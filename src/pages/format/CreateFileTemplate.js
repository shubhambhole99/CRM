import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import { baseurl,Agency } from "../../api";
function App() {
  const [mode, setMode] = useState("edit"); // "edit" or "preview"
  const [rawHtml, setRawHtml] = useState("<p>~name~ hello ~age~ years</p>");
  const [inputValues, setInputValues] = useState({}); // Map for placeholder values
  const [showModal, setShowModal] = useState(false);
  const [name,setname]=useState('')
  const [type,settype]=useState('SRA')
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

  const handleSave=()=>{
    axios.post(`${baseurl}/filetemplate/`, { name,type,rawHtml,inputValues })
      .then((response) => {
        toast.success("File Saved Successfully")
        // window.location.href = `${window.location.origin}/#/projects/createProjects`;
        console.log(response.data.fileTemplate._id);
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
          <button onClick={handleSave}>Save</button>
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
          flexDirection: mode === "edit" ? "row" : "column",
        }}
      >
        {/* Editor Section */}
        {mode === "edit" && (
          <textarea
            style={{
              width:"40%",
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
        <div style={{ flex: 1 }}>
          {/* <h3>Rendered Output</h3> */}
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              minHeight: "300px",
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
