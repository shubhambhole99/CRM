import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const [pages, setPages] = useState({
    Page1: { rows: [], columns: ["A", "B", "C"], relations: {}},
  });
  const [activePage, setActivePage] = useState("Page1");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [temptext, setTempText] = useState("");

  const handleAddRow = () => {
    const updatedPages = { ...pages };
    const currentPage = updatedPages[activePage];
    currentPage.rows.push({
      // id: Date.now(),
      content: Array(currentPage.columns.length).fill(""),
      merged: [],
      mergeInput: ""
    });
    setPages(updatedPages);
  };

  const handleAddColumn = () => {
    const updatedPages = { ...pages };
    const currentPage = updatedPages[activePage];
    const nextChar = String.fromCharCode(65 + currentPage.columns.length); // ASCII for 'A'
    currentPage.columns.push(nextChar);
    currentPage.rows.forEach((row) => row.content.push(""));
    setPages(updatedPages);
  };

  const handleRemoveColumn = () => {
    const updatedPages = { ...pages };
    const currentPage = updatedPages[activePage];
    if (currentPage.columns.length > 1) {
      currentPage.columns.pop();
      currentPage.rows.forEach((row) => row.content.pop());
      setPages(updatedPages);
    }
  };

  const handleContentChange = (rowIndex, colIndex, value) => {
    // console.log(value)
    const updatedPages = { ...pages };
    // const row = currentPage.rows.find((row) => row.id === rowId);
    if (!Array.isArray(updatedPages[activePage].rows[rowIndex].content[colIndex])) {
      // If it doesn't exist, create a new array
      updatedPages[activePage].rows[rowIndex].content[colIndex] = [];
    }

    updatedPages[activePage].rows[rowIndex].content[colIndex][0] = value
    setPages(updatedPages);
  };

  const handleAddPage = () => {
    const newPageName = `Page${Object.keys(pages).length + 1}`;
    setPages({
      ...pages,
      [newPageName]: { rows: [], columns: ["A", "B", "C"], relations: {} },
    });
    setActivePage(newPageName);
  };

  const handleSwitchPage = (pageName) => {
    setActivePage(pageName);
  };

  // const handleDragEnd = (result) => {
  //   if (!result.destination) return;
  //   const updatedPages = { ...pages };
  //   const currentPage = updatedPages[activePage];
  //   const reorderedRows = Array.from(currentPage.rows);
  //   const [moved] = reorderedRows.splice(result.source.index, 1);
  //   reorderedRows.splice(result.destination.index, 0, moved);
  //   currentPage.rows = reorderedRows;
  //   setPages(updatedPages);
  // };
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updatedPages = {...pages};
    const currentPage = updatedPages[activePage];
    const reorderedRows = Array.from(currentPage.rows);
    //  //console.log(result.source.index, result.destination.index)
    const [moved] = reorderedRows.splice(result.source.index, 1);
    reorderedRows.splice(result.destination.index, 0, moved);
    currentPage.rows = reorderedRows;
    // tried
    let source = result.source.index
    let destination = result.destination.index
    console.log(source, destination)
    const updateFormula = (formula, oldIndex, newIndex) => {
      const regex = /([A-Z]+)(\d+)/g; // Match cell references (e.g., A4, B5)
      return formula.replace(regex, (match, col, row) => {
        const rowIndex = parseInt(row, 10) - 1;
        let adjustedRowIndex = rowIndex;
        // Adjust row reference based on reordering
        if (rowIndex === oldIndex) {
          adjustedRowIndex = newIndex;
        } else if (rowIndex === newIndex) {
          adjustedRowIndex = oldIndex;
        }

        return `${col}${adjustedRowIndex + 1}`; // Convert back to 1-based index
      });
    };
    // currentPage.rows.forEach((row, rowIndex) => {
    //   row.content.forEach((cell, colIndex) => {
    //     if (Array.isArray(cell) && cell[1]?.[0]) {
    //       // Adjust the formula
    //       console.log(cell[1][0])
    //       const updatedFormula = updateFormula(cell[1][0], result.source.index, result.destination.index);
    //       //console.log(updatedFormula)
    //       cell[1][0] = updatedFormula;
    //     }
    //   });
    // });
    if (source > destination) {
      for (let i = source; i > destination; i--) {
        console.log(i,i-1)
        currentPage.rows.forEach((row, rowIndex) => {
          row.content.forEach((cell, colIndex) => {
            if (Array.isArray(cell) && cell[1]?.[0]) {
              // Adjust the formula
              // console.log(cell[1][0])
              const updatedFormula = updateFormula(cell[1][0], i, i-1);
              //console.log(updatedFormula)
              cell[1][0] = updatedFormula;
            }
          });
        });
      }
    }
    else {
      for (let i = source; i < destination; i++) {
        console.log(i,i+1)
        currentPage.rows.forEach((row, rowIndex) => {
          row.content.forEach((cell, colIndex) => {
            if (Array.isArray(cell) && cell[1]?.[0]) {
              // Adjust the formula
              // console.log(cell[1][0])
              const updatedFormula = updateFormula(cell[1][0], i, i+1);
              //console.log(updatedFormula)
              cell[1][0] = updatedFormula;
            }
          });
        });
      }
    }
    // tried
    // Helper function to update row formulas


    setPages(updatedPages);
  };


  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleRemoveRow = (rowId) => {
    const updatedPages = { ...pages };
    const currentPage = updatedPages[activePage];
    currentPage.rows = currentPage.rows.filter((row) => row.id !== rowId);
    setPages(updatedPages);
  };
  const handleRelationChange1 = (rowIndex, colIndex, formula) => {
    const updatedPages = { ...pages };
    if (!Array.isArray(updatedPages[activePage].rows[rowIndex].content[colIndex])) {
      // If it doesn't exist, create a new array
      updatedPages[activePage].rows[rowIndex].content[colIndex] = [];
    }
    (updatedPages[activePage].rows[rowIndex].content[colIndex])[1] = [formula, null, null, null, null];
    setPages(updatedPages);
  }
  const handleRelationChange = (rowIndex, colIndex, formula) => {
    let func = null
    let type = null
    let variables = null
    let formulaarr = formula.split("&");
    console.log(formulaarr)
    let prefix = "";
    let postfix = "";
    let flag = false;

    for (let i = 0; i < formulaarr.length; i++) {

      const trimmedPart = formulaarr[i].trim();
      if (trimmedPart.startsWith("IF")) {
        //     //  //console.log("here1",trimmedPart);
        func = parse(trimmedPart).logic;
        type = "complex";
        variables = parse(trimmedPart).variables;
        flag = true;
      } else if (/([A-Za-z0-9_]+!)?[A-Z]+\d+|\d+|\+|\-|\*|\/|=/g.test(trimmedPart)) {
        console.log("here2");
        func = parseFormula(trimmedPart).compute();
        type = "simple";
        variables = parseFormula(trimmedPart).variables;
        flag = true;
      } else {
        if (flag) {
          // //console.log(trimmedPart)
          postfix = postfix + trimmedPart;
        } else {
          // //console.log(trimmedPart)
          prefix = prefix + trimmedPart;
        }
        // //console.log(trimmedPart,prefix,postfix)
      }
    }

    const updatedPages = { ...pages };
    const relationsKey = `${rowIndex}-${colIndex}`;

    if (!Array.isArray(updatedPages[activePage].rows[rowIndex].content[colIndex])) {
      // If it doesn't exist, create a new array
      updatedPages[activePage].rows[rowIndex].content[colIndex] = [];
    }
    (updatedPages[activePage].rows[rowIndex].content[colIndex])[1] = [formula, func, variables, prefix, postfix];
    (updatedPages[activePage].rows[rowIndex].content[colIndex])[1] = [formula, func, variables, prefix, postfix];

    const value = computeCellValue();

    setPages(updatedPages)

  };
 
  const computeCellValue = () => {
    var updatedPages = { ...pages }
    // var updatedPages1 = pages[activePage]
    let variables = []
    let obj = {}
    let keysArray = Object.keys(updatedPages);

    // Use a for loop to iterate over the keys array
    for (let i = 0; i < keysArray.length; i++) {
      let activePage = keysArray[i];
      // console.log(activePage,updatedPages[activePage]);
    for (let i = 0; i < updatedPages[activePage].rows.length; i++) {
      for (let j = 0; j < updatedPages[activePage].rows[i].content.length; j++) {
        if (updatedPages[activePage].rows[i].content[j]?.[1] !== undefined && updatedPages[activePage].rows[i].content[j]?.[1][0] != "") {
          variables = updatedPages[activePage].rows[i].content[j][1][2]
          // console.log(updatedPages[activePage].rows[i].content[j])
          if (variables) {
            for (let i = 0; i < variables.length; i++) {
              let variable = variables[i]
              let indexes = FindIndex(variable)
              let value = indexes.value
              obj[variable] = value
              // console.log(obj)
            }
            // console.log(i,j,updatedPages[activePage].rows[i].content[j])
            let func = updatedPages[activePage].rows[i].content[j][1][1]
            updatedPages[activePage].rows[i].content[j][0] = updatedPages[activePage].rows[i].content[j][1][3] + func(obj) + updatedPages[activePage].rows[i].content[j][1][4]
          }
        }
      }
    }
  }

    //     }

    // }
    setPages(updatedPages);
  }

  const FindIndex = (cell) => {
    console.log(cell);
    if (!cell) return false;
  
    // Updated regex to handle optional page (e.g., "Page1!A1" or "A1")
    const match = cell.match(/^([A-Za-z0-9_]+!)?([A-Z]+)(\d+)$/);
    if (!match) {
      console.log("Invalid format: ", cell);
      return false;
    }
    
    // If there's a page reference, parse it; otherwise, set pageNumber to null
    const pageReference = match[1]; // Page reference (e.g., "Page1!")
    const column = match[2];
    const row = parseInt(match[3], 10);
  
    // const pageNumber = pageReference ? parseInt(pageReference.slice(0, -1), 10) : null; // Remove trailing "!" if present
    const pageNumber = pageReference?pageReference.slice(0, -1):null // Remove trailing "!" if present

    // console.log("Detected pageReference:", pageReference); // Debugging step
    // console.log("Detected pageNumber:", pageNumber); // Debugging step
  
    // If pageNumber is provided, validate it
    // if (pageNumber !== null && (pageNumber < 1 || pageNumber > pages.length)) {
    //   throw new Error(`Invalid page reference: Page ${pageNumber}`);
    // }
  
    // If there's no page number, use the first page as the default (or set logic for a default page)
    const targetPage = pageNumber !== null ? pages[pageNumber] : pages[activePage]; 
  
    // Calculate column index (zero-based)
    let columnIndex = 0;
    for (let i = 0; i < column.length; i++) {
      columnIndex *= 26;
      columnIndex += column.charCodeAt(i) - 65 + 1;
    }
    columnIndex -= 1;
  
    // Calculate row index (zero-based)
    const rowIndex = row - 1;
  
    // Retrieve value from the target page
    const value = targetPage.rows[rowIndex]?.content[columnIndex]?.[0];
    console.log(value)
    // console.log("Page Number:", pageNumber, "Column:", column, "Row:", row, "Column Index:", columnIndex, "Row Index:", rowIndex);
  
    return { pageNumber, column, row, columnIndex, rowIndex,value};
  };




  const handleRemoveMerge = (rowId, mergeIndex) => {
    const updatedPages = { ...pages };
    const currentPage = updatedPages[activePage];
    const row = currentPage.rows.find((row) => row.id === rowId);

    if (row && row.merged) {
      row.merged.splice(mergeIndex, 1);
      setPages(updatedPages);
    }
  };

  const handleSavePage = async () => {
    try {
      const response = await axios.post("/savePage", { pages });
      toast.success("Page saved successfully!");
      console.log(response.data);
    } catch (error) {
      toast.error("Failed to save page.");
      console.error(error);
    }
  };

  const parseFormula = (formula) => {
    const regex = /([A-Za-z0-9_]+!)?[A-Z]+\d+|\d+|\+|\-|\*|\/|=/g; // Updated regex for sheet-scoped variables
    const tokens = formula.match(regex); // Extract all parts of the formula

    if (!tokens) {
      throw new Error("Invalid formula");
    }

    // Extract variable names (like A1, page1!A1) from tokens
    const variables = tokens.filter((token) => /^([A-Za-z0-9_]+!)?[A-Z]+\d+$/.test(token));

    return {
      variables,
      compute: () => {
        // Return a function that computes the result based on the formula
        return (input) => {
          const evaluatedFormula = tokens
            .map((token) => {
              if (/^([A-Za-z0-9_]+!)?[A-Z]+\d+$/.test(token)) {
                // If token is a variable, replace it with its value from the input
                if (input[token] === undefined) {
                  throw new Error(`Missing value for variable: ${token}`);
                }
                return input[token]; // Use the actual numeric value from input
              }
              return token; // Keep operators and numbers as is
            })
            .join(" ");

          // Evaluate the formula using `eval`
          try {
            return eval(evaluatedFormula); // Compute the result
          } catch (error) {
            throw new Error("Error evaluating formula: " + error.message);
          }
        };
      },
    };
  };



  function parse(statement) {
    // Regex to match IF conditions with optional prefixes for variables and nested blocks inside braces
    const regex = /IF\s+([A-Za-z0-9_!]+)\s*(>=|<=|=|<|>)\s*([^{}]+)\s*\{((?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*)\}\s*(ELSE\s+IF\s+.+|ELSE\s+.+)?/is;

    // Set to store all variables encountered
    let variables = new Set();

    // Base case: Handle simple values (if there are no nested statements)
    if (!statement.trim().startsWith("IF") && !statement.replace(/^\{|\}$/g, "").trim().startsWith("IF")) {
      statement = statement.replace(/^\{|\}$/g, "");
      const value = isNaN(statement.trim()) ? statement.trim() : statement.trim();
      return {
        logic: () => value,
        representation: value,
        variables: [] // No variables in this case
      };
    }

    const match = statement.trim().match(regex);
    if (!match) {
      throw new Error("Invalid statement format");
    }

    const [_, variable, operator, value, thenClause, elseClause] = match;

    // Add the current variable to the set
    variables.add(variable);

    // Normalize the value for comparison (handle strings and numbers)
    const normalizedValue = value.trim().replace(/^"|"$/g, "");

    // Comparison function with support for strings and numbers
    const comparison = (input) => {
      const variableValue = input[variable];
      if (variableValue === undefined) {
        throw new Error(`Missing value for variable: ${variable}`);
      }

      if (operator === "=") return variableValue == normalizedValue; // Loose equality to support type coercion
      if (operator === "<") return variableValue < normalizedValue;
      if (operator === ">") return variableValue > normalizedValue;
      if (operator === "<=") return variableValue <= normalizedValue;
      if (operator === ">=") return variableValue >= normalizedValue;
      throw new Error(`Unsupported operator: ${operator}`);
    };

    // Parse THEN clause (the content within the braces after THEN)
    const thenLogic = parse(thenClause.trim());
    thenLogic.variables.forEach((v) => variables.add(v));

    // Parse ELSE clause if it exists
    const elseLogic = elseClause
      ? parse(elseClause.trim().replace(/^ELSE\s+/i, ""))
      : { logic: () => 0, representation: "0", variables: [] };
    elseLogic.variables.forEach((v) => variables.add(v));

    // Generate the logic function
    const logic = (input) => (comparison(input) ? thenLogic.logic(input) : elseLogic.logic(input));

    // Format the output with the required structure
    const representation = `IF ${variable} ${operator} ${value} { ${thenLogic.representation} }` +
      (elseLogic.representation !== "0" ? ` ELSE { ${elseLogic.representation} }` : "");

    // Convert Set to an array and return
    return {
      logic,
      representation,
      variables: Array.from(variables)
    };
  }
  const handleMergeInputChange = (rowIndex, value) => {
    const updatedPages = {...pages};
    const row = updatedPages[activePage].rows[rowIndex]
    row.mergeInput = value;
    console.log(updatedPages)
    setPages(updatedPages);
  };
  const handleMergeColumns = (rowIndex, rangeInput) => {
    const [start, end] = rangeInput.split("-").map((x) => parseInt(x, 10) - 1);
    const currentPage = pages[activePage];
    console.log(currentPage)
    if (
      start >= 0 &&
      end >= start &&
      end < currentPage.columns.length &&
      !currentPage.rows.some((row) =>
        row.merged?.some(
          (range) =>
            (start >= range.start && start <= range.end) ||
            (end >= range.start && end <= range.end)
        )
      )
    ) {
      const updatedPages = {...pages};
      const row = updatedPages[activePage].rows[rowIndex]
      if (row) {
        row.merged.push({ start, end });
        row.mergeInput = "";
      }
      setPages(updatedPages);
    } else {
      alert("Invalid merge range or overlap with an existing merge.");
    }
  };

  return (
    <div className="App">
      <ToastContainer />
      <h1>Dynamic Table Generator</h1>

      {/* Page Controls */}
      <div style={{ marginBottom: "20px" }}>
        {Object.keys(pages).map((pageName) => (
          <button
            key={pageName}
            onClick={() => handleSwitchPage(pageName)}
            style={{ fontWeight: activePage === pageName ? "bold" : "normal" }}
          >
            {pageName}
          </button>
        ))}
        <button onClick={handleAddPage}>Add Page</button>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={handleAddRow}>Add Row</button>
          <button onClick={handleAddColumn}>Add Column</button>
          <button onClick={handleRemoveColumn}>Remove Column</button>
          <button onClick={togglePreviewMode}>
            {isPreviewMode ? "Edit Mode" : "Preview Mode"}
          </button>
          <button onClick={handleSavePage}>Save Page</button>
        </div>

        {/* Table */}
        <div>
          <h3>{activePage}</h3>
          <DragDropContext onDragEnd={handleDragEnd}>
            <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th>Row</th>
                  {pages[activePage].columns.map((label, index) => (
                    <th key={index}>{label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <Droppable droppableId="rows">
                {(provided) => (
                  <tbody ref={provided.innerRef} {...provided.droppableProps}>
                    {pages[activePage].rows.map((row, index) => (
                      <Draggable key={index} draggableId={String(index)} index={index}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {!isPreviewMode && <td>{` ${index + 1}`}</td>}
                            {row.content.map((cell, colIndex) => {
                              const mergeRange = row.merged?.find(
                                (range) => colIndex >= range.start && colIndex <= range.end
                              );
                              
                              if (mergeRange) {
                                if (colIndex === mergeRange.start) {
                                  const colspan = mergeRange.end - mergeRange.start + 1;
                                  return (
                                    <td key={colIndex} colSpan={colspan}>
                                      {isPreviewMode ? (
                                        <p>{cell[0]}</p>
                                      ) : (
                                        <>
                                          <textarea

                                            value={cell[0]}
                                            onChange={(e) =>
                                              handleContentChange(row.id, colIndex, e.target.value)
                                            }
                                          />
                                          <textarea
                                            type="text"
                                            value={cell[1]?.[0]}
                                            placeholder="Relation (e.g., 2*A1)"
                                            onChange={(e) =>
                                              handleRelationChange1(index, colIndex, e.target.value)}

                                            onBlur={(e) =>
                                              handleRelationChange(index, colIndex, e.target.value)
                                            }
                                          />

                                        </>
                                      )}
                                    </td>
                                  );
                                }
                                return null;
                              }
                              return(
                              <td key={colIndex}>
                                {isPreviewMode ? (
                                  <p>{cell[0]}</p>
                                ) : (<>
                                  <textarea
                                    value={cell[0]}
                                    onChange={(e) =>
                                      handleContentChange(index, colIndex, e.target.value)
                                    }
                                  />
                                  <textarea
                                    type="text"
                                    value={cell[1]?.[0]}
                                    placeholder="Relation (e.g., 2*A1)"
                                    onChange={(e) =>
                                      handleRelationChange1(index, colIndex, e.target.value)}

                                    onBlur={(e) =>
                                      handleRelationChange(index, colIndex, e.target.value)
                                    }
                                  /></>

                                )}
                              </td>
                            )})}
                            {!isPreviewMode && (
                              <td>
                                <input
                                  type="text"
                                  value={row.mergeInput}
                                  onChange={(e) => handleMergeInputChange(index, e.target.value)}
                                  placeholder="e.g., 1-3"
                                />
                                <button onClick={() => handleMergeColumns(index, row.mergeInput)}>
                                  Merge
                                </button>
                                {row.merged?.map((merge, index) => (
                                  <div key={index}>
                                    <span>{`Merged: ${merge.start + 1}-${merge.end + 1}`}</span>
                                    <button onClick={() => handleRemoveMerge(row.id, index)}>
                                      Remove Merge
                                    </button>
                                  </div>
                                ))}
                                <button onClick={() => handleRemoveRow(row.id)}>-</button>
                              </td>
                            )}
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </table>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;
