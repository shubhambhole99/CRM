// import React, { useEffect, useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import "./App.css";
// import axios from "axios";
// import { baseurl } from "../../api";
// import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
// import jsonfunction from 'json-function';
// import { useParams } from 'react-router-dom';
// import jsonFunction from "json-function";


// function App() {
//   let [pages, setPages] = useState([
//     { id: 1, rows: [], columns: ["Column 1", "Column 2", "Column 3"], relations: {}, },
//   ]);
//   const [activePage, setActivePage] = useState(0);
//   const [isPreviewMode, setIsPreviewMode] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [name, setName] = useState('')
//   const [scheme, setScheme] = useState('')
//   const [rulebook, setRulebook] = useState('')
//   const [temptext, settemptext] = useState("")
//   const [masterinput, setmasterinput] = useState([{ id: 1, cell: "A1", row: "0", column: "0" }])

//   let { id } = useParams();
//   const handleSave = () => {
//     axios.put(`${baseurl}/template/${id}`, { pages, name, scheme, rulebook })
//       .then((response) => {
//         toast.success("File Saved Successfully")
//         // window.location.href = `${window.location.origin}/#/projects/createProjects`;
//         // ////console.log(response.data.fileTemplate._id);
//       })
//       .catch((error) => {
//         toast.error("File with Same name and type already exist")
//         console.error(error);
//       });
//   }


//   useEffect(() => {
//     const getTemplate = async () => {
//       // let body=
//       await axios.get(`${baseurl}/template/${id}`).then(response => {
//         setName(response.data.template?.name)
//         setScheme(response.data.template?.scheme)
//         setRulebook(response.data.template?.rulebook)
//         pages = response.data.template?.pages
//         setPages(response.data.template?.pages);
//         //console.log(response.data.template?.pages)

//         ////console.log(response.data,"templates")
//         const reconstuctfunction = async () => {
//           var updatedElements = response.data.template?.pages
//           // var updatedElements1 = pages[activePage]
//           let variables = []
//           let obj = {}
//           for (let i = 0; i < updatedElements[activePage].rows.length; i++) {
//             for (let j = 0; j < updatedElements[activePage].rows[i].content.length; j++) {
//               if (updatedElements[activePage].rows[i].content[j]?.[1] !== undefined && updatedElements[activePage].rows[i].content[j]?.[1][0] != "") {
//                 variables = updatedElements[activePage].rows[i].content[j][1][2]
//                 ////console.log(updatedElements[activePage].rows[i].content[j])
//                 if (variables) {
//                   for (let i = 0; i < variables.length; i++) {
//                     let variable = variables[i]
//                     let indexes = FindIndex(variable)
//                     let value = indexes.value
//                     obj[variable] = value
//                     ////console.log(value)
//                   }
//                 }

//                 handleRelationChange0(i, j, updatedElements[activePage].rows[i].content[j][1][0])

//               }

//             }
//           }
//           // setPages(updatedElements);
//         }
//         reconstuctfunction()
//       })
//     }
//     getTemplate();


//   }, [])


//   // Masterinput
//   const handleAddMasterInput = () => {
//     if (temptext === "") {
//       toast.error("Please Enter Value")
//       return
//     }
//     let temp = masterinput.find((data) => data.cell === temptext)
//     if (temp) {
//       toast.error("Value Already Exist")
//       return
//     }
//     setmasterinput([...masterinput, { id: masterinput.length + 1, cell: temptext }])
//   }
//   const handleMasterInputChange = (value, index) => {
//     const updatedMasterInput = [...masterinput]
//     updatedMasterInput[index].cell = value
//     setmasterinput(updatedMasterInput)
//     let temp = FindIndex(value)
//     if (temp) {
//       updatedMasterInput[index].row = FindIndex(value).rowIndex
//       updatedMasterInput[index].column = FindIndex(value).columnIndex
//       //////console.log(updatedMasterInput)
//       setmasterinput(updatedMasterInput)
//     }
//   }
//   const handleMasterValueChange = (value, index) => {
//     const updatedMasterInput = [...masterinput]
//     let temp = updatedMasterInput[index]
//     // //////console.log(temp)
//     if (temp) {
//       updatedMasterInput[index].value = value
//       setmasterinput(updatedMasterInput)
//       handleContentChangeForMasterInput(temp.row, temp.column, value)
//     }
//   }
//   const handleContentChangeForMasterInput = (rowIndex, colIndex, value) => {
//     // //////console.log(rowIndex,colIndex,value)

//     // //////console.log(rowId, colIndex)
//     const updatedPages = [...pages];
//     const currentPage = updatedPages[activePage];
//     //////console.log(currentPage.rows,rowIndex,colIndex,value)
//     if ((currentPage.rows).length >= rowIndex + 1) {
//       //////console.log(currentPage.rows)
//       const row = currentPage.rows[rowIndex]
//       // //////console.log(row)
//       row.content[colIndex] = value;
//       // //////console.log(pages)
//       setPages(updatedPages);
//     }
//     else {
//       toast.error("Cell doesn't exist")
//     }

//     // const row = currentPage.rows[.find((row) => row.id === rowId);]
//     // if (row) {
//     //   row.content[colIndex] = value;
//     // }
//     // //////console.log(pages)
//     // setPages(updatedPages);
//   };
//   const handleRelationChange0 = (rowIndex, colIndex, formula) => {
//     // //console.log(formula)
//     let func = null
//     let type = null
//     let variables = null
//     let formulaarr = formula.split("&");
//     let prefix = "";
//     let postfix = "";
//     let flag = false;
//     // //console.log(formulaarr)
//     for (let i = 0; i < formulaarr.length; i++) {
//       // flag=false
//       // prefix=""
//       // postfix=""
//       const trimmedPart = formulaarr[i].trim();
//       if (trimmedPart.startsWith("IF")) {
//         //  //console.log("here1",trimmedPart);
//         func = parse(trimmedPart).logic;
//         type = "complex";
//         variables = parse(trimmedPart).variables;
//         flag = true;
//       } else if (/(\w\d+|\d+|\+|\-|\*|\/|=)/g.test(trimmedPart)) {
//         // ////console.log("here2");
//         func = parseFormula(trimmedPart).compute();
//         type = "simple";
//         variables = parseFormula(trimmedPart).variables;
//         flag = true;
//       } else {
//         if (flag) {
//           // //console.log(trimmedPart)
//           postfix = postfix + trimmedPart;
//         } else {
//           // //console.log(trimmedPart)
//           prefix = prefix + trimmedPart;
//         }
//         // //console.log(trimmedPart,prefix,postfix)
//       }
//     }
//     // if (formula.trim().startsWith("IF")) {
//     //   func = parse(formula).logic
//     //   type = "complex"
//     //   variables = parse(formula).variables
//     // }
//     // else {
//     //   func = parseFormula(formula).compute()
//     //   type = "simple"
//     //   variables = parseFormula(formula).variables
//     // }
//     const updatedElements = [...pages];
//     const relationsKey = `${rowIndex}-${colIndex}`;

//     if (!Array.isArray(updatedElements[activePage].rows[rowIndex].content[colIndex])) {
//       // If it doesn't exist, create a new array
//       updatedElements[activePage].rows[rowIndex].content[colIndex] = [];
//     }
//     (updatedElements[activePage].rows[rowIndex].content[colIndex])[1] = [formula, func, variables, prefix, postfix];
//     (pages[activePage].rows[rowIndex].content[colIndex])[1] = [formula, func, variables, prefix, postfix];
//     // //console.log([formula, func, variables, prefix, postfix])
//     // updatedElements[activePage].relations[relationsKey] = formula;

//     // Recalculate value
//     // const value = computeCellValue(rowIndex, colIndex, formula);
//     ////console.log(pages)
//     setPages(updatedElements)
//     // //console.log(pages)
//     //  const value = computeCellValue();
//     //////console.log(updatedElements[activePage].rows[rowIndex])
//     // updatedElements[activePage].rows[rowIndex].content[colIndex] = value;
//   };
//   const handleRelationChange = (rowIndex, colIndex, formula) => {
//     //console.log(formula)
//     let func = null
//     let type = null
//     let variables = null
//     let formulaarr = formula.split("&");
//     let prefix = "";
//     let postfix = "";
//     let flag = false;
//     //console.log(formulaarr)
//     for (let i = 0; i < formulaarr.length; i++) {
//       // flag=false
//       // prefix=""
//       // postfix=""
//       const trimmedPart = formulaarr[i].trim();
//       if (trimmedPart.startsWith("IF")) {
//         //  //console.log("here1",trimmedPart);
//         func = parse(trimmedPart).logic;
//         type = "complex";
//         variables = parse(trimmedPart).variables;
//         flag = true;
//       } else if (/(\w\d+|\d+|\+|\-|\*|\/|=)/g.test(trimmedPart)) {
//         // ////console.log("here2");
//         func = parseFormula(trimmedPart).compute();
//         type = "simple";
//         variables = parseFormula(trimmedPart).variables;
//         flag = true;
//       } else {
//         if (flag) {
//           // //console.log(trimmedPart)
//           postfix = postfix + trimmedPart;
//         } else {
//           // //console.log(trimmedPart)
//           prefix = prefix + trimmedPart;
//         }
//         // //console.log(trimmedPart,prefix,postfix)
//       }
//     }
//     // if (formula.trim().startsWith("IF")) {
//     //   func = parse(formula).logic
//     //   type = "complex"
//     //   variables = parse(formula).variables
//     // }
//     // else {
//     //   func = parseFormula(formula).compute()
//     //   type = "simple"
//     //   variables = parseFormula(formula).variables
//     // }
//     const updatedElements = [...pages];
//     const relationsKey = `${rowIndex}-${colIndex}`;

//     if (!Array.isArray(updatedElements[activePage].rows[rowIndex].content[colIndex])) {
//       // If it doesn't exist, create a new array
//       updatedElements[activePage].rows[rowIndex].content[colIndex] = [];
//     }
//     (updatedElements[activePage].rows[rowIndex].content[colIndex])[1] = [formula, func, variables, prefix, postfix];
//     (pages[activePage].rows[rowIndex].content[colIndex])[1] = [formula, func, variables, prefix, postfix];
//     //console.log([formula, func, variables, prefix, postfix])
//     // updatedElements[activePage].relations[relationsKey] = formula;

//     // Recalculate value
//     const value = computeCellValue(rowIndex, colIndex, formula);
//     ////console.log(pages)
//     setPages(updatedElements)
//     //console.log(pages)
//     //  const value = computeCellValue();
//     //////console.log(updatedElements[activePage].rows[rowIndex])
//     // updatedElements[activePage].rows[rowIndex].content[colIndex] = value;
//   };
//   const handleRelationChange1 = (rowIndex, colIndex, formula) => {
//     const updatedElements = [...pages];
//     if (!Array.isArray(updatedElements[activePage].rows[rowIndex].content[colIndex])) {
//       // If it doesn't exist, create a new array
//       updatedElements[activePage].rows[rowIndex].content[colIndex] = [];
//     }
//     (updatedElements[activePage].rows[rowIndex].content[colIndex])[1] = [formula, null, null];
//     setPages(updatedElements);
//   }

//   const computeCellValue = () => {
//     var updatedElements = [...pages]
//     // var updatedElements1 = pages[activePage]
//     let variables = []
//     let obj = {}
//     for (let i = 0; i < updatedElements[activePage].rows.length; i++) {
//       for (let j = 0; j < updatedElements[activePage].rows[i].content.length; j++) {
//         if (updatedElements[activePage].rows[i].content[j]?.[1] !== undefined && updatedElements[activePage].rows[i].content[j]?.[1][0] != "") {
//           variables = updatedElements[activePage].rows[i].content[j][1][2]
//           ////console.log(updatedElements[activePage].rows[i].content[j])
//           if (variables) {
//             for (let i = 0; i < variables.length; i++) {
//               let variable = variables[i]
//               let indexes = FindIndex(variable)
//               let value = indexes.value
//               obj[variable] = value
//               ////console.log(value)
//             }
//           }

//           console.log(i,j,updatedElements[activePage].rows[i].content[j])
//           let func = updatedElements[activePage].rows[i].content[j][1][1]
//           updatedElements[activePage].rows[i].content[j][0] = updatedElements[activePage].rows[i].content[j][1][3] + func(obj) + updatedElements[activePage].rows[i].content[j][1][4]
//         }

//       }
//     }
//     setPages(updatedElements);

//   }



//   function parse(statement) {
//     // Updated regex to include >= and <=
//     const regex = /IF\s+(\w+)\s*(>=|<=|=|<|>)\s*([^{}]+)\s*\{((?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*)\}\s*(ELSE\s+IF\s+.+|ELSE\s+.+)?/is;

//     // Set to store all variables encountered
//     let variables = new Set();

//     // Base case: Handle simple values (if there are no nested statements)
//     if (!statement.trim().startsWith("IF") && !statement.replace(/^\{|\}$/g, '').trim().startsWith("IF")) {
//       statement = statement.replace(/^\{|\}$/g, '');
//       const value = isNaN(statement.trim()) ? statement.trim() : statement.trim();
//       return {
//         logic: () => value,
//         representation: value,
//         variables: [] // No variables in this case
//       };
//     }

//     const match = statement.trim().match(regex);
//     if (!match) {
//       throw new Error("Invalid statement format");
//     }

//     const [_, variable, operator, value, thenClause, elseClause] = match;

//     // Add the current variable to the set
//     variables.add(variable);

//     // Normalize the value for comparison (handle strings and numbers)
//     const normalizedValue = value.trim().replace(/^"|"$/g, "");

//     // Comparison function with support for strings and numbers
//     const comparison = (input) => {
//       const variableValue = input[variable];
//       if (operator === "=") return variableValue == normalizedValue; // Loose equality to support type coercion
//       if (operator === "<") return variableValue < normalizedValue;
//       if (operator === ">") return variableValue > normalizedValue;
//       if (operator === "<=") return variableValue <= normalizedValue;
//       if (operator === ">=") return variableValue >= normalizedValue;
//       throw new Error(`Unsupported operator: ${operator}`);
//     };

//     // Parse THEN clause (the content within the braces after THEN)
//     const thenLogic = parse(thenClause.trim());
//     thenLogic.variables.forEach(v => variables.add(v));

//     // Parse ELSE clause if it exists
//     const elseLogic = elseClause ? parse(elseClause.trim().replace(/^ELSE\s+/i, "")) : { logic: () => 0, representation: "0", variables: [] };
//     elseLogic.variables.forEach(v => variables.add(v));

//     // Generate the logic function
//     const logic = (input) => (comparison(input) ? thenLogic.logic(input) : elseLogic.logic(input));

//     // Format the output with the required structure
//     const representation = `IF ${variable} ${operator} ${value} { ${thenLogic.representation} }` +
//       (elseLogic.representation !== "0" ? ` ELSE { ${elseLogic.representation} }` : "");

//     // Convert Set to an array and return
//     return {
//       logic,
//       representation,
//       variables: Array.from(variables)
//     };
//   }

//   const parseFormula = (formula) => {
//     const regex = /(\w\d+|\d+|\+|\-|\*|\/|=)/g; // Match variables (e.g., A1, B2), numbers, and operators
//     const tokens = formula.match(regex); // Extract all parts of the formula

//     if (!tokens) {
//       throw new Error("Invalid formula");
//     }

//     // Extract variable names (like A1, B2) from tokens
//     const variables = tokens.filter((token) => /^[A-Z]+\d+$/.test(token));

//     return {
//       variables,
//       compute: () => {
//         // Return a function that computes the result based on the formula
//         return (input) => {
//           const evaluatedFormula = tokens
//             .map((token) => {
//               if (/^[A-Z]+\d+$/.test(token)) {
//                 // If token is a variable (like "A1"), replace it with its value from the input
//                 if (input[token] === undefined) {
//                   throw new Error(`Missing value for variable: ${token}`);
//                 }
//                 return input[token]; // Use the actual numeric value from input
//               }
//               return token; // Keep operators and numbers as is
//             })
//             .join(" ");

//           // Evaluate the formula using `eval`
//           try {
//             return eval(evaluatedFormula); // Compute the result
//           } catch (error) {
//             throw new Error("Error evaluating formula: " + error.message);
//           }
//         };
//       },
//     };
//   };

//   const FindIndex = (cell) => {
//     if (cell == "") {
//       return false
//     }
//     // //////console.log(cell)
//     // Separate the column letters and row numbers using a regex
//     const match = cell.match(/^([A-Z]+)(\d+)$/);
//     if (!match) {
//       return false
//       // throw new Error("Invalid cell reference format");
//     }
//     // //////console.log(match)
//     const column = match[1]; // Column part (letters)
//     const row = parseInt(match[2], 10); // Row part (numbers)

//     // Calculate column index (zero-based)
//     let columnIndex = 0;
//     for (let i = 0; i < column.length; i++) {
//       columnIndex *= 26;
//       columnIndex += column.charCodeAt(i) - 65 + 1;
//     }
//     columnIndex -= 1; // Adjust to zero-based index

//     // Calculate row index (zero-based)
//     const rowIndex = row - 1;
//     //console.log(rowIndex ,columnIndex)
//     //console.log(pages[activePage].rows[rowIndex])
//     const value = pages[activePage].rows[rowIndex].content[columnIndex]?.[0]
//     return { column, row, columnIndex, rowIndex, value };
//   }
//   // Dynamically Generated Functions

//   const handleAddRow = () => {
//     const updatedPages = [...pages];
//     const currentPage = updatedPages[activePage];
//     currentPage.rows.push({
//       id: Date.now(),
//       content: Array(currentPage.columns.length).fill(""),
//       merged: [],
//       mergeInput: "",
//     });
//     //////console.log(updatedPages)
//     setPages(updatedPages);
//   };

//   const handleRemoveRow = (rowId) => {
//     const updatedPages = [...pages];
//     const currentPage = updatedPages[activePage];
//     currentPage.rows = currentPage.rows.filter((row) => row.id !== rowId);
//     setPages(updatedPages);
//   };

//   const handleAddColumn = () => {
//     const updatedPages = [...pages];
//     const currentPage = updatedPages[activePage];
//     // currentPage.columns.push(`Column ${currentPage.columns.length + 1}`);
//     const nextChar = String.fromCharCode(65 + currentPage.columns.length); // 65 is the ASCII code for 'A'
//     currentPage.columns.push(`${nextChar}`);
//     currentPage.rows.forEach((row) => row.content.push(""));
//     setPages(updatedPages);
//   };

//   const handleRemoveColumn = () => {
//     const updatedPages = [...pages];
//     const currentPage = updatedPages[activePage];
//     if (currentPage.columns.length > 1) {
//       currentPage.columns.pop();
//       currentPage.rows.forEach((row) => {
//         row.content.pop();
//         row.merged = row.merged
//           .map((merge) =>
//             merge.end === currentPage.columns.length
//               ? { ...merge, end: merge.end - 1 }
//               : merge.start >= currentPage.columns.length
//                 ? null
//                 : merge
//           )
//           .filter(Boolean);
//       });
//       setPages(updatedPages);
//     }
//   };

//   // const handleContentChange = (rowId, colIndex, value) => {
//   //   //////console.log(rowId, colIndex)
//   //   const updatedPages = [...pages];
//   //   const currentPage = updatedPages[activePage];
//   //   const row = currentPage.rows.find((row) => row.id === rowId);
//   //   if (row) {
//   //     row.content[colIndex][1] = value;
//   //   }
//   //   //////console.log(pages)
//   //   setPages(updatedPages);
//   // };
//   const handleContentChange = (rowId, colIndex, value) => {
//     const updatedPages = [...pages];
//     const currentPage = updatedPages[activePage];
//     const row = currentPage.rows.find((row) => row.id === rowId);

//     if (row) {
//       if (!Array.isArray(row.content[colIndex])) {
//         // If it doesn't exist, create a new array
//         row.content[colIndex] = [];
//       }
//       // Push the new value into the array
//       row.content[colIndex][0] = value;
//     }
//     ////console.log(updatedPages)
//     setPages(updatedPages);
//   };

//   const handleMergeColumns = (rowId, rangeInput) => {
//     const [start, end] = rangeInput.split("-").map((x) => parseInt(x, 10) - 1);
//     const currentPage = pages[activePage];
//     if (
//       start >= 0 &&
//       end >= start &&
//       end < currentPage.columns.length &&
//       !currentPage.rows.some((row) =>
//         row.merged.some(
//           (range) =>
//             (start >= range.start && start <= range.end) ||
//             (end >= range.start && end <= range.end)
//         )
//       )
//     ) {
//       const updatedPages = [...pages];
//       const row = updatedPages[activePage].rows.find((row) => row.id === rowId);
//       if (row) {
//         row.merged.push({ start, end });
//         row.mergeInput = "";
//       }
//       setPages(updatedPages);
//     } else {
//       alert("Invalid merge range or overlap with an existing merge.");
//     }
//   };

//   const handleRemoveMerge = (rowId, indexToClear) => {
//     const updatedPages = [...pages];
//     const row = updatedPages[activePage].rows.find((row) => row.id === rowId);
//     if (row) {
//       row.merged.splice(indexToClear, 1);
//     }
//     setPages(updatedPages);
//   };

//   const handleMergeInputChange = (rowId, value) => {
//     const updatedPages = [...pages];
//     const row = updatedPages[activePage].rows.find((row) => row.id === rowId);
//     if (row) {
//       row.mergeInput = value;
//     }
//     setPages(updatedPages);
//   };

//   const handleAddPage = () => {
//     setPages([
//       ...pages,
//       { id: pages.length + 1, rows: [], columns: ["Column 1", "Column 2", "Column 3"] },
//     ]);
//   };

//   const handleSwitchPage = (pageIndex) => {
//     setActivePage(pageIndex);
//   };

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;
//     const updatedPages = [...pages];
//     const currentPage = updatedPages[activePage];
//     const reorderedRows = Array.from(currentPage.rows);
//     //  //console.log(result.source.index, result.destination.index)
//     const [moved] = reorderedRows.splice(result.source.index, 1);
//     reorderedRows.splice(result.destination.index, 0, moved);
//     currentPage.rows = reorderedRows;
//     // tried
//     let source = result.source.index
//     let destination = result.destination.index
//     console.log(source, destination)
//     const updateFormula = (formula, oldIndex, newIndex) => {
//       const regex = /([A-Z]+)(\d+)/g; // Match cell references (e.g., A4, B5)
//       return formula.replace(regex, (match, col, row) => {
//         const rowIndex = parseInt(row, 10) - 1;
//         let adjustedRowIndex = rowIndex;
//         // Adjust row reference based on reordering
//         if (rowIndex === oldIndex) {
//           adjustedRowIndex = newIndex;
//         } else if (rowIndex === newIndex) {
//           adjustedRowIndex = oldIndex;
//         }

//         return `${col}${adjustedRowIndex + 1}`; // Convert back to 1-based index
//       });
//     };
//     // currentPage.rows.forEach((row, rowIndex) => {
//     //   row.content.forEach((cell, colIndex) => {
//     //     if (Array.isArray(cell) && cell[1]?.[0]) {
//     //       // Adjust the formula
//     //       console.log(cell[1][0])
//     //       const updatedFormula = updateFormula(cell[1][0], result.source.index, result.destination.index);
//     //       //console.log(updatedFormula)
//     //       cell[1][0] = updatedFormula;
//     //     }
//     //   });
//     // });
//     if (source > destination) {
//       for (let i = source; i > destination; i--) {
//         console.log(i,i-1)
//         currentPage.rows.forEach((row, rowIndex) => {
//           row.content.forEach((cell, colIndex) => {
//             if (Array.isArray(cell) && cell[1]?.[0]) {
//               // Adjust the formula
//               // console.log(cell[1][0])
//               const updatedFormula = updateFormula(cell[1][0], i, i-1);
//               //console.log(updatedFormula)
//               cell[1][0] = updatedFormula;
//             }
//           });
//         });
//       }
//     }
//     else {
//       for (let i = source; i < destination; i++) {
//         console.log(i,i+1)
//         currentPage.rows.forEach((row, rowIndex) => {
//           row.content.forEach((cell, colIndex) => {
//             if (Array.isArray(cell) && cell[1]?.[0]) {
//               // Adjust the formula
//               // console.log(cell[1][0])
//               const updatedFormula = updateFormula(cell[1][0], i, i+1);
//               //console.log(updatedFormula)
//               cell[1][0] = updatedFormula;
//             }
//           });
//         });
//       }
//     }
//     // tried
//     // Helper function to update row formulas


//     setPages(updatedPages);
//   };







//   const togglePreviewMode = () => {
//     setIsPreviewMode(!isPreviewMode);
//   };



//   return (
//     <div className="App">
//       <ToastContainer />
//       <h1>Dynamic Table Generator with Pages</h1>

//       {/* Page Controls */}
//       <div style={{ marginBottom: "20px" }}>
//         {pages.map((page, index) => (
//           <button key={index} onClick={() => handleSwitchPage(index)}>
//             Page {page.id}
//           </button>
//         ))}
//         <button onClick={handleAddPage}>Add Page</button>
//       </div>

//       {/* Controls */}
//       <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
//         <div style={{ display: 'flex', flexDirection: 'column' }}>
//           <button onClick={handleAddRow}>Add Row</button>
//           <button onClick={handleAddColumn}>Add Column</button>
//           <button onClick={handleRemoveColumn}>
//             Remove Column
//           </button>
//           <button onClick={togglePreviewMode}>
//             {isPreviewMode ? "Edit Mode" : "Preview Mode"}
//           </button>
//           <h3>Add Master Input</h3>
//           <div>
//             <input
//               type="text"
//               value={temptext}
//               placeholder="Add Cells For Master Input"
//               onChange={(e) => settemptext(e.target.value)}
//             />
//             <button onClick={handleAddMasterInput}>Add</button>
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               {masterinput.map((row, index) => {
//                 return (
//                   <>
//                     <div style={{ border: "1px solid black" }} key={index}>

//                       Cell:<input value={row.cell} onChange={(e) => {
//                         // handleContentChangeForMasterInput(e.target.value)
//                         handleMasterInputChange(e.target.value, index)
//                       }} />
//                       <br />
//                       Value:<input value={row.value} onChange={(e) => {
//                         // handleContentChangeForMasterInput(e.target.value)
//                         handleMasterValueChange(e.target.value, index)
//                       }} />
//                       {/* <button>Submit</button> */}
//                     </div>

//                   </>
//                 )


//               })}
//             </div>
//           </div>
//           <button onClick={(e) => setShowModal(!showModal)}>Save</button>
//           {showModal && (<>
//             <input
//               type="text"
//               placeholder="Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="Scheme"
//               value={scheme}
//               onChange={(e) => setScheme(e.target.value)}
//             />
//             <input
//               type="text"
//               placeholder="RuleBook"
//               value={rulebook}
//               onChange={(e) => setRulebook(e.target.value)}
//             />
//             <button
//               onClick={(e) => handleSave(e)}
//               style={{
//                 padding: "10px",
//                 marginLeft: "10px",
//                 backgroundColor: "green",
//                 color: "white",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               Save
//             </button>
//           </>

//           )}


//           <br />

//         </div>

//         {/* Table */}
//         <div>
//           <h3>Page {pages[activePage].id}</h3>
//           <DragDropContext onDragEnd={handleDragEnd}>
//             <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
//               <thead>
//                 {/* {!isPreviewMode && (
//                    <tr>
//                      {pages[activePage].columns.map((label, index) => (
//                        <th key={index}>{label}</th>
//                      ))}
//                    </tr>
//                  )} */}
//                 {!isPreviewMode && (
//                   <tr>
//                     <th>Row</th>
//                     {pages[activePage].columns.map((label, index) => (
//                       <th key={index}>{label}</th>
//                     ))}
//                     <th>Actions</th>
//                   </tr>
//                 )}
//               </thead>
//               <Droppable droppableId="rows">
//                 {(provided) => (
//                   <tbody ref={provided.innerRef} {...provided.droppableProps}>
//                     {pages[activePage].rows.map((row, index) => (
//                       <Draggable key={row.id} draggableId={String(row.id)} index={index}>
//                         {(provided) => (

//                           <tr
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                           >
//                             {!isPreviewMode && <td>{` ${index + 1}`}</td>}

//                             {row.content.map((cell, colIndex) => {
//                               const mergeRange = row.merged.find(
//                                 (range) => colIndex >= range.start && colIndex <= range.end
//                               );
//                               if (mergeRange) {
//                                 if (colIndex === mergeRange.start) {
//                                   const colspan = mergeRange.end - mergeRange.start + 1;
//                                   return (
//                                     <td key={colIndex} colSpan={colspan}>
//                                       {isPreviewMode ? (
//                                         <p>{cell[0]}</p>
//                                       ) : (
//                                         <>
//                                           <textarea
//                                             value={cell[0]}
//                                             onChange={(e) =>
//                                               handleContentChange(row.id, colIndex, e.target.value)
//                                             }
//                                           />
//                                           <textarea
//                                             type="text"
//                                             value={cell[1]?.[0]}
//                                             placeholder="Relation (e.g., 2*A1)"
//                                             onChange={(e) =>
//                                               handleRelationChange1(index, colIndex, e.target.value)}

//                                             onBlur={(e) =>
//                                               handleRelationChange(index, colIndex, e.target.value)
//                                             }
//                                           />

//                                         </>
//                                       )}
//                                     </td>
//                                   );
//                                 }
//                                 return null;
//                               }
//                               // what is the above code for
//                               return (
//                                 <td key={colIndex}>
//                                   {isPreviewMode ? (
//                                     <p>{cell[0]}</p>
//                                   ) : (
//                                     <>
//                                       <textarea
//                                         // type="textarea"
//                                         value={cell[0]}
//                                         onChange={(e) =>
//                                           handleContentChange(row.id, colIndex, e.target.value)
//                                         }
//                                       />
//                                       <textarea
//                                         type="text"
//                                         value={cell[1]?.[0]}
//                                         placeholder="Relation (e.g., 2*A1)"
//                                         onChange={(e) =>
//                                           handleRelationChange1(index, colIndex, e.target.value)}
//                                         onBlur={(e) =>
//                                           handleRelationChange(index, colIndex, e.target.value)
//                                         }
//                                       />
//                                     </>
//                                   )}
//                                 </td>
//                               );
//                             })}
//                             {!isPreviewMode && (
//                               <td>
//                                 <input
//                                   type="text"
//                                   value={row.mergeInput}
//                                   onChange={(e) => handleMergeInputChange(row.id, e.target.value)}
//                                   placeholder="e.g., 1-3"
//                                 />
//                                 <button onClick={() => handleMergeColumns(row.id, row.mergeInput)}>
//                                   Merge
//                                 </button>
//                                 {row.merged.map((merge, index) => (
//                                   <div key={index}>
//                                     <span>{`Merged: ${merge.start + 1}-${merge.end + 1}`}</span>
//                                     <button onClick={() => handleRemoveMerge(row.id, index)}>
//                                       Remove Merge
//                                     </button>
//                                   </div>
//                                 ))}
//                                 <button onClick={() => handleRemoveRow(row.id)}>-</button>
//                               </td>
//                             )}
//                           </tr>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </tbody>
//                 )}
//               </Droppable>
//             </table>
//           </DragDropContext>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelSheetPreviewer = () => {
  const [sheetNames, setSheetNames] = useState([]);
  const [sheetsData, setSheetsData] = useState({});
  const [activeSheet, setActiveSheet] = useState('');

  const excelFileUrl =
    'https://officecrm560.s3.ap-south-1.amazonaws.com/2025/03/28.Prashantiben+(santacruz)+/Prashantiben+FAQs(Uploaded)1741106390045.xlsx';

  useEffect(() => {
    const loadExcelFromURL = async () => {
      try {
        const response = await fetch(excelFileUrl);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onload = (evt) => {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });

          const allSheets = {};
          wb.SheetNames.forEach((name) => {
            const ws = wb.Sheets[name];
            allSheets[name] = XLSX.utils.sheet_to_json(ws, { header: 1 });
          });

          setSheetNames(wb.SheetNames);
          setSheetsData(allSheets);
          setActiveSheet(wb.SheetNames[0]); // default to first sheet
        };

        reader.readAsBinaryString(blob);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    };

    loadExcelFromURL();
  }, []);

  return (
    <div>
      {sheetNames.length > 0 ? (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label>Select Sheet: </label>
            <select onChange={(e) => setActiveSheet(e.target.value)} value={activeSheet}>
              {sheetNames?.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <table border="1" cellPadding="5">
            <tbody>
              {sheetsData[activeSheet]?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading spreadsheet...</p>
      )}
    </div>
  );
};

export default ExcelSheetPreviewer;