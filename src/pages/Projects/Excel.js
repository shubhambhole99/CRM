

import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ResizableBox } from "react-resizable";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-resizable/css/styles.css";
import { baseurl, ProjectStatus } from "../../api";
// import { usePathname, useRouter } from "next/navigation";
import { useLocation} from "react-router-dom";
import { Navbar } from "../../components/Navbar";


// import Hero from "@/components/ui/hero"


const App=()=>{
    let [pages, setPages] = useState([{ id: 1, name: "New Page", rows: [], columns: ["A", "B", "C"], relations: {} }]);
    const [activePage, setActivePage] = useState(0);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [textinput, settextinput] = useState("")
    const [formData, setFormData] = useState({ name: "", scheme: "", description: "" });
    const [masterinput, setmasterinput] = useState([{ id: 1, page: 1, cell: "A1", row: "0", column: "0", name: "Plot Area", value: null, basic: true }])
    const [basic, setbasic] = useState(true)
    // const pathName = usePathname();
    // const id = pathName.split("/").pop();
    // const router = useRouter();

    
    const location = useLocation();
    const pathName = location.pathname;
    const id = pathName.split("/").pop(); // gets the last part of the path

    const buttonRef = useRef(null);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.altKey && event.key.toLowerCase() === "r") {
                event.preventDefault(); // Prevents any browser default action
                buttonRef.current?.click(); // Triggers the button click
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);
    useEffect(() => {
        if (id != 1) {
            axios.get(`${baseurl}/template/${id}`) // Replace with actual API URL
                .then(response => {
                    const data = response.data.template;
                    //console.log(data);
                    setFormData({ name: data.name, scheme: data.scheme, description: data.description });
                    pages = data.pages
                    setPages(data.pages);
                    setmasterinput(data.masterinput)
                    reconstuctfunction(data.pages)
                })
                .catch(() => toast.error("Failed to fetch template"));
        }
    }, []);
    const handleAddMasterinput = (e) => {
        // e.preventdefault()
        if (textinput === "") {
            toast.error("Please Enter Value")
            return
        }
        let temp = masterinput.find((data) => data.cell === textinput)
        if (temp) {
            toast.error("Value Already Exist")
            return
        }
        let temp1 = FindIndex(textinput)
        const newMasterinput = [...masterinput, { id: Math.random(), cell: textinput, row: temp1.rowIndex, column: temp1.columnIndex, page: activePage, basic: true }];
        setmasterinput(newMasterinput);

    }
    const handleMasterinputChange = (value, index) => {
        console.log(value, index)
        const updatedMasterinput = [...masterinput]
        updatedMasterinput[index].cell = value
        setmasterinput(updatedMasterinput)
        let temp = FindIndex(value)
        if (temp) {
            updatedMasterinput[index].row = FindIndex(value).rowIndex
            updatedMasterinput[index].column = FindIndex(value).columnIndex
            ////////console.log(updatedMasterinput)
            setmasterinput(updatedMasterinput)
        }

    }


    const handleContentChangeForMasterinput = (page, rowIndex, colIndex, value) => {
        // console.log(rowIndex, colIndex, value)

        const updatedPages = [...pages];
        const currentPage = updatedPages[page];
        // console.log(currentPage)
        if ((currentPage.rows).length >= rowIndex + 1) {
            // console.log(currentPage.rows)
            const row = currentPage.rows[rowIndex]
            // console.log(row)
            if (!Array.isArray(row.content[colIndex])) {
                // If it doesn't exist, create a new array
                row.content[colIndex] = [];
            }
            // Push the new value into the array
            row.content[colIndex][0] = value;
            // ////////console.log(pages)
            setPages(updatedPages);
        }
        else {
            toast.error("Cell doesn't exist")
        }

        // const row = currentPage.rows[.find((row) => row.id === rowId);]
        // if (row) {
        //   row.content[colIndex] = value;
        // }
        // ////////console.log(pages)
        // setPages(updatedPages);
    };



    const parseFormulaSum = (formula) => {
        if (!formula.toUpperCase().startsWith("SUM(") || !formula.endsWith(")")) {
            throw new Error("Invalid SUM formula");
        }

        const range = formula.slice(4, -1).trim(); // Extract the range inside SUM()
        const rangeRegex = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i; // Matches "A1:A7" or "A1:D1"

        const match = range.match(rangeRegex);
        if (!match) {
            throw new Error("Invalid range format in SUM function");
        }

        const [_, startCol, startRow, endCol, endRow] = match;
        const startRowNum = parseInt(startRow);
        const endRowNum = parseInt(endRow);

        let variables = [];

        if (startCol === endCol) {
            // **Column Sum: Vertical Range (e.g., A1:A7)**
            for (let i = startRowNum; i <= endRowNum; i++) {
                variables.push(`${startCol}${i}`);
            }
        } else if (startRow === endRow) {
            // **Row Sum: Horizontal Range (e.g., A1:D1)**
            for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
                variables.push(`${String.fromCharCode(col)}${startRow}`);
            }
        } else {
            throw new Error("SUM function must be either row-wise (A1:D1) or column-wise (A1:A7), not mixed.");
        }

        return {
            variables,
            compute: () => {
                return (input) => {
                    const roundToDecimal = (num, decimalPlaces) => Math.round(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;

                    let sum = 0;
                    for (let cell of variables) {
                        let value = input[cell];

                        // Treat non-numeric values as 0
                        if (value === undefined || isNaN(parseFloat(value))) {
                            value = 0;
                        } else {
                            value = parseFloat(value);
                        }

                        sum += value;
                    }
                    return roundToDecimal(sum, 3);
                };
            },
        };
    };
    const reconstuctfunction = async (data) => {
        var updatedElements = data || pages
        // console.log(updatedElements)
        // var updatedElements1 = pages[activePage]
        let variables = []
        let obj = {}
        for (let i = 0; i < updatedElements[activePage].rows.length; i++) {
            for (let j = 0; j < updatedElements[activePage].rows[i].content.length; j++) {
                if (updatedElements[activePage].rows[i].content[j]?.[1] !== undefined && updatedElements[activePage].rows[i].content[j]?.[1][0] != "") {
                    variables = updatedElements[activePage].rows[i].content[j][1][2]
                    //////console.log(updatedElements[activePage].rows[i].content[j])
                    if (variables) {
                        for (let i = 0; i < variables.length; i++) {
                            let variable = variables[i]
                            let indexes = FindIndex(variable)
                            let value = indexes.value
                            obj[variable] = value
                            //////console.log(value)
                        }
                    }

                    handleRelationChange0(i, j, updatedElements[activePage].rows[i].content[j][1][0])

                }

            }
        }
        // setPages(updatedElements);
    }


    // No Need To Compute Cell Value
    const handleRelationChange0 = (rowIndex, colIndex, formula) => {
        // console.log(rowIndex, colIndex, formula)
        let func = null
        let type = null
        let variables = null
        let formulaarr = formula.split("&");
        let prefix = "";
        let postfix = "";
        let flag = false;
        ////console.log(formulaarr)
        for (let i = 0; i < formulaarr.length; i++) {
            // flag=false
            // prefix=""
            // postfix=""
            const trimmedPart = formulaarr[i].trim();
            if (trimmedPart.startsWith("IF")) {
                //  ////console.log("here1",trimmedPart);
                func = parse(trimmedPart).logic;
                type = "complex";
                variables = parse(trimmedPart).variables;
                flag = true;
            } else if (trimmedPart.startsWith("=")) {
                func = parseFormulaEquals(trimmedPart).compute();
                type = "reference";
                variables = parseFormulaEquals(trimmedPart).variables;
                flag = true;
            }
            else if (/(\w\d+|\d+|\+|\-|\*|\/|=)/g.test(trimmedPart)) {
                // //////console.log("here2");
                func = parseFormula(trimmedPart).compute();
                type = "simple";
                variables = parseFormula(trimmedPart).variables;
                flag = true;
            } else {
                if (flag) {
                    // ////console.log(trimmedPart)
                    postfix = postfix + formulaarr[i];
                } else {
                    // ////console.log(trimmedPart)
                    prefix = prefix + formulaarr[i];
                }
                // ////console.log(trimmedPart,prefix,postfix)
            }
        }
        // if (formula.trim().startsWith("IF")) {
        //   func = parse(formula).logic
        //   type = "complex"
        //   variables = parse(formula).variables
        // }
        // else {
        //   func = parseFormula(formula).compute()
        //   type = "simple"
        //   variables = parseFormula(formula).variables
        // }
        const updatedElements = [...pages];
        const relationsKey = `${rowIndex}-${colIndex}`;
        // console.log(updatedElements[activePage].rows[rowIndex])
        if (!Array.isArray(updatedElements[activePage].rows[rowIndex].content[colIndex])) {
            // If it doesn't exist, create a new array
            updatedElements[activePage].rows[rowIndex].content[colIndex] = [];
        }
        (updatedElements[activePage].rows[rowIndex].content[colIndex])[1] = [formula, func, variables, prefix, postfix];
        (pages[activePage].rows[rowIndex].content[colIndex])[1] = [formula, func, variables, prefix, postfix];

        setPages(updatedElements)

    };




    const handleRelationChange = (rowIndex, colIndex, formula) => {
        // console.log(rowIndex, colIndex, formula)
        let func = null
        let type = null
        let variables = null
        let formulaarr = formula.split("&");
        let prefix = "";
        let postfix = "";
        let flag = false;
        ////console.log(formulaarr)
        for (let i = 0; i < formulaarr.length; i++) {
            // flag=false
            // prefix=""
            // postfix=""
            const trimmedPart = formulaarr[i].trim();
            if (trimmedPart.startsWith("IF")) {
                //  ////console.log("here1",trimmedPart);
                func = parse(trimmedPart).logic;
                type = "complex";
                variables = parse(trimmedPart).variables;
                flag = true;
            }
            else if (trimmedPart.toUpperCase().startsWith("SUM(")) {
                func = parseFormulaSum(trimmedPart).compute();
                type = "sum";
                variables = parseFormulaSum(trimmedPart).variables;
                flag = true;
            }
            else if (trimmedPart.startsWith("=")) {
                func = parseFormulaEquals(trimmedPart).compute();
                type = "reference";
                variables = parseFormulaEquals(trimmedPart).variables;
                flag = true;
            }
            else if (/(\w\d+|\d+|\+|\-|\*|\/|=)/g.test(trimmedPart)) {
                // //////console.log("here2");
                func = parseFormula(trimmedPart).compute();
                type = "simple";
                variables = parseFormula(trimmedPart).variables;
                flag = true;
            } else {
                if (flag) {
                    // ////console.log(trimmedPart)
                    postfix = postfix + formulaarr[i];
                } else {
                    // ////console.log(trimmedPart)
                    prefix = prefix + formulaarr[i];
                }
                // ////console.log(trimmedPart,prefix,postfix)
            }
        }
        // if (formula.trim().startsWith("IF")) {
        //   func = parse(formula).logic
        //   type = "complex"
        //   variables = parse(formula).variables
        // }
        // else {
        //   func = parseFormula(formula).compute()
        //   type = "simple"
        //   variables = parseFormula(formula).variables
        // }
        const updatedElements = [...pages];
        const relationsKey = `${rowIndex}-${colIndex}`;
        // console.log(updatedElements[activePage].rows[rowIndex])
        if (!Array.isArray(updatedElements[activePage].rows[rowIndex].content[colIndex])) {
            // If it doesn't exist, create a new array
            updatedElements[activePage].rows[rowIndex].content[colIndex] = [];
        }
        (updatedElements[activePage].rows[rowIndex].content[colIndex])[1] = [formula, func, variables, prefix, postfix];
        (pages[activePage].rows[rowIndex].content[colIndex])[1] = [formula, func, variables, prefix, postfix];
        ////console.log([formula, func, variables, prefix, postfix])
        // updatedElements[activePage].relations[relationsKey] = formula;

        // Recalculate value
        const value = computeCellValue(rowIndex, colIndex, formula);
        //////console.log(pages)
        setPages(updatedElements)
        ////console.log(pages)
        //  const value = computeCellValue();
        ////////console.log(updatedElements[activePage].rows[rowIndex])
        // updatedElements[activePage].rows[rowIndex].content[colIndex] = value;
    };
    const handleRelationChange1 = (rowIndex, colIndex, formula) => {
        const updatedElements = [...pages];
        if (!Array.isArray(updatedElements[activePage].rows[rowIndex].content[colIndex])) {
            // If it doesn't exist, create a new array
            updatedElements[activePage].rows[rowIndex].content[colIndex] = [];
        }
        (updatedElements[activePage].rows[rowIndex].content[colIndex])[1] = [formula, null, null];
        setPages(updatedElements);
    }

    const computeCellValue = () => {
        var updatedElements = [...pages]
        // var updatedElements1 = pages[activePage]
        const roundToDecimal = (num, decimalPlaces) => Math.round(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;

        let variables = []
        let obj = {}
        for (let i = 0; i < updatedElements[activePage].rows.length; i++) {
            for (let j = 0; j < updatedElements[activePage].rows[i].content.length; j++) {
                try {
                    if (updatedElements[activePage].rows[i].content[j]?.[1] !== undefined && updatedElements[activePage].rows[i].content[j]?.[1][0] != "") {
                        variables = updatedElements[activePage].rows[i].content[j][1][2]
                        //////console.log(updatedElements[activePage].rows[i].content[j])
                        if (variables) {
                            for (let i = 0; i < variables.length; i++) {
                                let variable = variables[i]
                                //console.log(variables[i])
                                // console.log(FindIndex(variable))
                                let indexes = FindIndex(variable)
                                let value = indexes.value
                                obj[variable] = value
                                //////console.log(value)
                            }
                        }

                        // console.log(i, j, updatedElements[activePage].rows[i].content[j])
                        let func = updatedElements[activePage].rows[i].content[j][1][1]
                        updatedElements[activePage].rows[i].content[j][0] = updatedElements[activePage].rows[i].content[j][1][3] + func(obj) + updatedElements[activePage].rows[i].content[j][1][4]
                    }
                } catch (err) {
                    toast.error(`Error on Formula Row:${i + 1} Column:${j + 1}`)
                    reconstuctfunction()
                    console.log(err, activePage, i, j)
                }

            }
        }
        setPages(updatedElements);

    }

    function parse(statement) {
        function tokenize(statement) {
            return statement.match(/IF|ELSE IF|ELSE|\{|\}|[A-Za-z_][A-Za-z0-9_]*|[<>]=?|=|!=|\d*\.\d+|\d+|"[^"]*"|\S+/g) || [];
        }

        function parseTokens(tokens) {
            if (tokens.length === 0) return null;

            let token = tokens.shift();
            if (token !== "IF") throw new Error("Invalid syntax: Expected IF");

            let variable = tokens.shift();
            let operator = tokens.shift();
            let value = tokens.shift();

            // Convert numeric values (including decimals) to numbers
            if (!isNaN(value) && value !== null && value !== undefined) {
                value = Number(value);
            } else if (typeof value === "string") {
                value = value.replace(/^"|"$/g, ""); // Remove quotes for strings
            }

            if (tokens.shift() !== "{") throw new Error("Invalid syntax: Expected {");

            let thenClause = extractBlock(tokens);
            let elseIfClauses = [];

            while (tokens[0] === "ELSE IF") {
                tokens.shift();
                let elseIfVariable = tokens.shift();
                let elseIfOperator = tokens.shift();
                let elseIfValue = tokens.shift();

                if (!isNaN(elseIfValue)) {
                    elseIfValue = Number(elseIfValue);
                } else {
                    elseIfValue = elseIfValue.replace(/^"|"$/g, "");
                }

                if (tokens.shift() !== "{") throw new Error("Invalid syntax: Expected {");

                let elseIfBlock = extractBlock(tokens);
                elseIfClauses.push({
                    type: "ELSE IF",
                    variable: elseIfVariable,
                    operator: elseIfOperator,
                    value: elseIfValue,
                    thenClause: typeof elseIfBlock === "string" ? { type: "VALUE", value: elseIfBlock } : elseIfBlock
                });
            }

            let elseClause = null;
            if (tokens[0] === "ELSE") {
                tokens.shift();
                if (tokens.shift() !== "{") throw new Error("Invalid syntax: Expected {");
                elseClause = extractBlock(tokens);
            }

            return {
                type: "IF",
                variable,
                operator,
                value,
                thenClause: typeof thenClause === "string" ? { type: "VALUE", value: thenClause } : thenClause,
                elseIfClauses,
                elseClause: typeof elseClause === "string" ? { type: "VALUE", value: elseClause } : elseClause
            };
        }

        function extractBlock(tokens) {
            let block = [];
            let braceCount = 1;

            while (tokens.length > 0) {
                let token = tokens.shift();
                if (token === "{") braceCount++;
                if (token === "}") braceCount--;

                if (braceCount === 0) break;
                block.push(token);
            }

            if (block.length === 1) return block[0];
            if (block.length > 1) return parseTokens(block);

            return null;
        }

        function evaluate(ast, input) {
            if (ast.type === "VALUE") return ast.value;

            let variableValue = input[ast.variable];
            if (variableValue === undefined) throw new Error(`Missing value for variable: ${ast.variable}`);

            let compareValue = ast.value;

            let comparison = false;
            if (ast.operator === "=") comparison = variableValue == compareValue;
            if (ast.operator === "!=") comparison = variableValue != compareValue;
            if (ast.operator === "<") comparison = variableValue < compareValue;
            if (ast.operator === ">") comparison = variableValue > compareValue;
            if (ast.operator === "<=") comparison = variableValue <= compareValue;
            if (ast.operator === ">=") comparison = variableValue >= compareValue;

            if (comparison) {
                return evaluate(ast.thenClause, input);
            }

            for (let elseIf of ast.elseIfClauses) {
                let elseIfVariableValue = input[elseIf.variable];
                let elseIfCompareValue = elseIf.value;
                let elseIfComparison = false;

                if (elseIf.operator === "=") elseIfComparison = elseIfVariableValue == elseIfCompareValue;
                if (elseIf.operator === "!=") elseIfComparison = elseIfVariableValue != elseIfCompareValue;
                if (elseIf.operator === "<") elseIfComparison = elseIfVariableValue < elseIfCompareValue;
                if (elseIf.operator === ">") elseIfComparison = elseIfVariableValue > elseIfCompareValue;
                if (elseIf.operator === "<=") elseIfComparison = elseIfVariableValue <= elseIfCompareValue;
                if (elseIf.operator === ">=") elseIfComparison = elseIfVariableValue >= elseIfCompareValue;

                if (elseIfComparison) {
                    return evaluate(elseIf.thenClause, input);
                }
            }

            return evaluate(ast.elseClause, input);
        }

        let tokens = tokenize(statement);
        let ast = parseTokens(tokens);
        let variables = new Set();

        function collectVariables(node) {
            if (!node) return;
            if (node.type === "IF") {
                variables.add(node.variable);
                collectVariables(node.thenClause);
                node.elseIfClauses.forEach(collectVariables);
                collectVariables(node.elseClause);
            }
        }

        collectVariables(ast);
        return {
            logic: (input) => evaluate(ast, input),
            variables: Array.from(variables)
        };
    }


    const parseFormula = (formula) => {
        const regex = /([A-Z]+[0-9]+(?:![A-Z]+[0-9]+)?|\b\d+(?:\.\d+)?\b|[+\-*/=()])/gi; // Support decimal numbers
        const tokens = formula.match(regex);

        if (!tokens) {
            throw new Error("Invalid formula");
        }

        // Extract variable names
        const variables = tokens.filter((token) => /^[A-Z]+\d+(?:![A-Z]+\d+)?$/i.test(token));

        return {
            variables,
            compute: () => {
                return (input) => {
                    let evaluatedFormula = "";
                    for (let i = 0; i < tokens.length; i++) {
                        let token = tokens[i];

                        if (/^[A-Z]+\d+(?:![A-Z]+\d+)?$/i.test(token)) {
                            let value = input[token];
                            if (value === undefined) {
                                throw new Error(`Missing value for variable: ${token}`);
                            }

                            // Convert to number explicitly
                            value = parseFloat(value);

                            // Ensure multiplication is explicit
                            if (i > 0 && !/[+\-*/=(]/.test(evaluatedFormula.slice(-1))) {
                                evaluatedFormula += " * ";
                            }

                            evaluatedFormula += value;
                        } else {
                            evaluatedFormula += token;
                        }
                    }

                    // Evaluate the formula safely
                    try {
                        return Math.round(eval(evaluatedFormula) * 100) / 100;
                    } catch (error) {
                        throw new Error("Error evaluating formula: " + error.message);
                    }
                };
            },
        };
    };
    const parseFormulaEquals = (formula) => {
        if (!formula.startsWith("=")) {
            throw new Error("Formula must start with '='");
        }

        const variable = formula.slice(1).trim(); // Extract the variable name after "="

        if (!/^[A-Z]+\d+(?:![A-Z]+\d+)?$/i.test(variable)) {
            throw new Error("Invalid variable reference");
        }

        return {
            variables: [variable], // The formula only contains a single variable
            compute: () => {
                return (input) => {
                    let value;

                    if (variable.includes("!")) {
                        const [page, cellRef] = variable.split("!");
                        value = input[`${page}!${cellRef}`];
                    } else {
                        value = input[variable];
                    }

                    if (value === undefined) {
                        throw new Error(`Missing value for variable: ${variable}`);
                    }

                    return value; // Directly return the referenced value
                };
            },
        };
    };
    const FindIndex = (cell) => {
        if (!cell || typeof cell !== "string") {
            return false;
        }

        // Extract page name and cell reference if present (e.g., "page1!A1")
        const pageMatch = cell.match(/^([a-zA-Z]+)(\d+)!(\w+\d+)$/i);
        let pageNumber = null;
        let cellRef = cell;

        if (pageMatch) {
            pageNumber = parseInt(pageMatch[2], 10) - 1; // Convert "page1" → 1
            cellRef = pageMatch[3]; // Extract cell reference (e.g., "A1")
        }

        // Extract column letters and row numbers
        const match = cellRef.match(/^([A-Z]+)(\d+)$/);
        if (!match) {
            return false; // Invalid format
        }
        // console.log(pageMatch)
        const column = match[1].toUpperCase(); // Normalize column letters
        const row = parseInt(match[2], 10); // Row number

        // Convert column letters to zero-based index
        let columnIndex = 0;
        for (let i = 0; i < column.length; i++) {
            columnIndex *= 26;
            columnIndex += column.charCodeAt(i) - 65 + 1;
        }
        columnIndex -= 1; // Adjust to zero-based index

        // Convert row number to zero-based index
        const rowIndex = row - 1;

        // If no page number is extracted, use activePage
        const page = pageNumber !== null ? pageNumber : activePage;

        // Ensure page exists
        if (!pages[page] || !pages[page].rows[rowIndex]) {
            return false; // Page or row doesn't exist
        }

        // Retrieve value from the specified cell
        const value = pages[page].rows[rowIndex].content[columnIndex]?.[0];

        return { page, column, row, columnIndex, rowIndex, value };
    };

    // Dynamically Generated Functions




    const handleSubmit = (e) => {
        if (id != 1) {
            axios.put(`${baseurl}/template/${id}`, { ...formData, pages, masterinput }) // Replace with actual API URL
                .then(() => {
                    toast.success("Template Saved Successfully");
                    setIsModalOpen(false);
                })
                .catch(() => {
                    toast.error("Error Saving Template")
                    // router.push("/dark-mode");
                });
        } else {
            axios.post(`${baseurl}/template/create`, { ...formData, pages, masterinput })
                .then((res) => {
                    toast.success("Template Saved Successfully");
                    // router.push(`/feasibility/${res.data.template._id}`);
                    setIsModalOpen(false);
                })
                .catch(() => {
                    toast.error("Error Saving Template")
                });
        }
    }

    // const handleContentChange = (rowId, colIndex, value,rowIndex) => {
    //     const updatedPages = [...pages];
    //     const currentPage = updatedPages[activePage];
    //     const row = currentPage.rows.find((row) => row.id === rowId);
    //     //console.log(value, row.content)

    //     // Convert rowId and colIndex to the respective cell notation
    //     const cellIdentifier = `${String.fromCharCode(65 + colIndex)}${rowIndex+1}`; // Convert to "A1", "B2", etc.

    //     console.log(cellIdentifier)
    //     // Check if the cell and page exist in masterinput
    //     const cellExists = masterinput.some(
    //         (entry) => entry.page === activePage + 1 && entry.cell == cellIdentifier
    //     );
    //     console.log(cellExists)
    //     if (cellExists) {
    //         console.error(`Cell ${cellIdentifier} on page ${activePage + 1} does exist in masterinput.`);
    //         return; // Exit the function if validation fails
    //     }

    //     // if (row) {
    //     //     if (!Array.isArray(row.content[colIndex])) {
    //     //         // If it doesn't exist, create a new array
    //     //         row.content[colIndex] = [];
    //     //     }
    //     //     // Push the new value into the array
    //     //     row.content[colIndex][0] = value;
    //     // }
    //     // setPages(updatedPages);
    // };
    const handleContentChange = (rowId, colIndex, value, rowIndex) => {
        setPages(prevPages => {
            const updatedPages = JSON.parse(JSON.stringify(prevPages)); // Deep copy
            const currentPage = updatedPages[activePage];
            const row = currentPage.rows.find((row) => row.id === rowId);

            // Generate cell identifier
            const cellIdentifier = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
            // console.log(masterinput)
            // Check if cell exists in masterinput
            const cellExists = masterinput.some(
                (entry) => entry.page === activePage + 1 && entry.cell === cellIdentifier
            );
            // console.log(cellExists)
            if (cellExists) {
                return
            }

            // Update only if valid
            if (row) {
                if (!Array.isArray(row.content[colIndex])) {
                    row.content[colIndex] = [];
                }
                row.content[colIndex][0] = value;
            }

            return updatedPages; // This safely updates state
        });
    };
    const handleAddRow = () => {
        const updatedPages = [...pages];
        updatedPages[activePage].rows.push({
            id: Date.now(),
            content: Array(updatedPages[activePage].columns.length).fill(""),
            merged: [],
        });
        setPages(updatedPages);
    };

    const handleRemoveRow = (rowId) => {
        const updatedPages = [...pages];
        updatedPages[activePage].rows = updatedPages[activePage].rows.filter(row => row.id !== rowId);
        setPages(updatedPages);
    };

    const handleAddColumn = () => {
        const updatedPages = [...pages];
        const nextChar = String.fromCharCode(65 + updatedPages[activePage].columns.length);
        updatedPages[activePage].columns.push(nextChar);
        updatedPages[activePage].rows.forEach(row => row.content.push(""));
        setPages(updatedPages);
    };

    const handleRemoveColumn = () => {
        if (pages[activePage].columns.length > 1) {
            const updatedPages = [...pages];
            updatedPages[activePage].columns.pop();
            updatedPages[activePage].rows.forEach(row => row.content.pop());
            setPages(updatedPages);
        }
    };

    const handleMergeinputChange = (rowId, value) => {
        const updatedPages = [...pages];
        const row = updatedPages[activePage].rows.find((row) => row.id === rowId);
        if (row) {
            row.mergeinput = value;
        }
        setPages(updatedPages);
    };
    // const handleMergeColumns = (rowId, rangeinput) => {
    //     const [start, end] = rangeinput.split("-").map((x) => parseInt(x, 10) - 1);
    //     const currentPage = pages[activePage];
    //     if (
    //         start >= 0 &&
    //         end >= start &&
    //         end < currentPage.columns.length &&
    //         !currentPage.rows.some((row) =>
    //             row.merged.some(
    //                 (range) =>
    //                     (start >= range.start && start <= range.end) ||
    //                     (end >= range.start && end <= range.end)
    //             )
    //         )
    //     ) {
    //         const updatedPages = [...pages];
    //         const row = updatedPages[activePage].rows.find((row) => row.id === rowId);
    //         if (row) {
    //             row.merged.push({ start, end });
    //             row.mergeinput = "";
    //         }
    //         setPages(updatedPages);
    //     } else {
    //         alert("Invalid merge range or overlap with an existing merge.");
    //     }
    // };
    const handleMergeColumns = (rowId, rangeinput) => {
        const [start, end] = rangeinput.split("-").map((x) => parseInt(x, 10) - 1);
        const currentPage = pages[activePage];

        if (start < 0 || end < start || end >= currentPage.columns.length) {
            alert("Invalid merge range.");
            return;
        }

        const updatedPages = [...pages];
        const row = updatedPages[activePage].rows.find((row) => row.id === rowId);

        if (row) {
            // Check overlap only within this row's merged columns
            const isOverlap = row.merged.some(
                (range) => (start >= range.start && start <= range.end) || (end >= range.start && end <= range.end)
            );

            if (isOverlap) {
                alert("Merge range overlaps with an existing merge in this row.");
            } else {
                row.merged.push({ start, end });
                row.mergeinput = "";
                setPages(updatedPages);
            }
        }
    };
    // const handleRemoveMerge = (rowId, indexToClear) => {
    //     const updatedPages = [...pages];
    //     const row = updatedPages[activePage].rows.find((row) => row.id === rowId);
    //     if (row) {
    //         row.merged.splice(indexToClear, 1);
    //     }
    //     setPages(updatedPages);
    // };
    const handleRemoveMerge = (rowId, indexToClear) => {
        const updatedPages = [...pages];
        const row = updatedPages[activePage].rows.find((row) => row.id === rowId);

        if (row && row.merged.length > indexToClear && indexToClear >= 0) {
            row.merged.splice(indexToClear, 1);
            setPages(updatedPages);
        } else {
            alert("Invalid merge index.");
        }
    };


    // const handleDragEnd = (result) => {
    //     if (!result.destination) return;
    //     const updatedPages = [...pages];
    //     const reorderedRows = [...updatedPages[activePage].rows];
    //     const [moved] = reorderedRows.splice(result.source.index, 1);
    //     reorderedRows.splice(result.destination.index, 0, moved);
    //     updatedPages[activePage].rows = reorderedRows;
    //     setPages(updatedPages);
    // };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const updatedPages = [...pages];
        const currentPage = updatedPages[activePage];
        const reorderedRows = Array.from(currentPage.rows);
        //  //console.log(result.source.index, result.destination.index)
        const [moved] = reorderedRows.splice(result.source.index, 1);
        reorderedRows.splice(result.destination.index, 0, moved);
        currentPage.rows = reorderedRows;
        // tried
        let source = result.source.index
        let destination = result.destination.index
        // console.log(source, destination)
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
                console.log(i, i - 1)
                currentPage.rows.forEach((row, rowIndex) => {
                    row.content.forEach((cell, colIndex) => {
                        if (Array.isArray(cell) && cell[1]?.[0]) {
                            // Adjust the formula
                            // console.log(cell[1][0])
                            const updatedFormula = updateFormula(cell[1][0], i, i - 1);
                            //console.log(updatedFormula)
                            cell[1][0] = updatedFormula;
                        }
                    });
                });
            }
        }
        else {
            for (let i = source; i < destination; i++) {
                console.log(i, i + 1)
                currentPage.rows.forEach((row, rowIndex) => {
                    row.content.forEach((cell, colIndex) => {
                        if (Array.isArray(cell) && cell[1]?.[0]) {
                            // Adjust the formula
                            // console.log(cell[1][0])
                            const updatedFormula = updateFormula(cell[1][0], i, i + 1);
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

    const togglePreviewMode = () => setIsPreviewMode(!isPreviewMode);
    const [clickCount, setClickCount] = useState(1);
    const clickTimeout = useRef(null); // Store the timeout ID using useRef
    const [editpageid, seteditpage] = useState(null)

    const handleClick = (index) => {
        if (clickCount === 0) {
            setClickCount((prev) => prev + 1);
            // console.log(clickCount)
            // If it's the first click, wait for a double-click
            clickTimeout.current = setTimeout(() => {
                if (clickCount === 0) {
                    console.log('Single Click');
                    setActivePage(index)
                }
                setClickCount(0); // Reset click count after timeout
            }, 300); // Delay of 300ms to check for double-click
        }
    };

    const handleDoubleClick = (id) => {
        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current); // Clear the single-click timeout
        }
        seteditpage(id)
        console.log('Double Click');
        setClickCount(0); // Reset click count after double-click
    };
    return (

        <div
        >
            <div
                style={{ marginTop: "100px", gap: "30px" }}
                className="flex overflow-visible"
            >

                <ToastContainer />
                {/* <Hero/> */}
                {/* Controls on the Left */}
                <div style={{ width: "max-content" }}>
                                {/* <img src="./c.png" alt="Image" className="w-full h-auto" /> */}
                    <div>
                        <h1 className="text-2xl font-bold mb-6">
                            {/* 📊  */}
                            Draggable table</h1>

                        <div className="mb-4 flex gap-2 flex-wrap">
                            {pages.map((page, index) => {
                                return (



                                    page.id == editpageid ? (

                                        <input
                                            value={page.name}
                                            onChange={(e) => {
                                                const newName = e.target.value;
                                                setPages(prev =>
                                                    prev.map(p =>
                                                        p.id === page.id ? { ...p, name: newName } : p
                                                    )
                                                );
                                            }}
                                            onBlur={() => seteditpage(null)}
                                        />
                                    ) : (
                                        <button key={index} variant={activePage === index ? "default" : "outline"} onClick={() => handleClick(index)} onDoubleClick={() => handleDoubleClick(page.id)}>
                                            Page {page.id} {page.name}
                                        </button>
                                    )

                                )
                            })}
                            <button onClick={() => setPages([...pages, { id: pages.length + 1, rows: [], columns: ["A", "B", "C"] }])} variant="secondary">
                                ➕ Add Page
                            </button>
                            <button onClick={() => setPages([...pages, { id: pages.length + 1, rows: [], columns: ["A", "B", "C"] }])} variant="secondary">
                                Edit Page
                            </button>

                        </div>

                        <div className="p-4">
                            <divContent className="flex flex-col gap-2">
                                <button ref={buttonRef} onClick={handleAddRow}>
                                    {/* ➕  */}
                                    Add Row</button>
                                <button onClick={handleAddColumn}>
                                    {/* ➕  */}
                                    Add Column</button>
                                <button onClick={handleRemoveColumn}>
                                    {/* 🗑 */}
                                    Remove Column</button>
                                <button
                                    className="dark:bg-white"
                                    // className="bg-white text-white dark:bg-red dark:text-black hover:shadow-lg hover:shadow-gray-400 dark:hover:shadow-white transition-all"
                                    pressed={isPreviewMode}
                                    onPressedChange={togglePreviewMode}
                                >
                                    🔄 {isPreviewMode ? "Edit Mode" : "Preview Mode"}
                                </button>
                                <button onClick={() => setIsModalOpen(true)} variant="destructive">💾 Save table</button>
                            </divContent>
                        </div>
                    </div>
                    {/* Master inputs */}
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold mb-6">Master inputs</h1>

                        {/* Basic / Advanced Toggle */}
                        <div className="mb-4 flex gap-2 flex-wrap">
                            <button variant={basic == true ? "default" : "outline"} onClick={() => setbasic(true)}>
                                Basic
                            </button>
                            <button variant={basic == false ? "default" : "outline"} onClick={() => setbasic(false)}>
                                Advanced
                            </button>
                            <button variant={basic == "no" ? "default" : "outline"} onClick={() => setbasic("no")}>
                                All
                            </button>
                        </div>

                        {/* input Field */}
                        <div className="flex gap-2">
                            <label htmlFor="terms">Enter Cell</label>
                            <input
                                className="w-1/4"
                                type="text"
                                value={textinput}
                                placeholder="Add Cells For Master input"
                                onChange={(e) => settextinput(e.target.value)}
                            />
                            <button onClick={(e) => handleAddMasterinput()}>Add</button>
                        </div>

                        <h2>Existing inputs</h2>

                        {/* Drag & Drop Context */}
                        <DragDropContext onDragEnd={(result) => {
                            if (!result.destination) return;

                            const { source, destination } = result;
                            const filteredMasterinput = masterinput.filter((row) => basic == "no" || Boolean(row.basic) == Boolean(basic))
                            // const filteredMasterinput = masterinput

                            const actualSourceIndex = masterinput.findIndex(
                                (row) => row.id === filteredMasterinput[source.index].id
                            );
                            const actualDestinationIndex = masterinput.findIndex(
                                (row) => row.id === filteredMasterinput[destination.index].id
                            );

                            const updatedMasterinput = [...masterinput];
                            const [moved] = updatedMasterinput.splice(actualSourceIndex, 1);
                            updatedMasterinput.splice(actualDestinationIndex, 0, moved);
                            setmasterinput(updatedMasterinput);
                        }}>
                            <Droppable droppableId="master-inputs">
                                {(provided) => (
                                    <div style={{ height: "800px", overflow: "scroll" }} ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                                        {masterinput.
                                            filter((row) => basic == "no" || Boolean(row.basic) === Boolean(basic))
                                            .map((row, index) => (
                                                <Draggable key={row.id} draggableId={String(row.id)} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="border-2 border-black dark:border-[#F0FFFF] rounded-lg p-4 space-y-4"
                                                        >
                                                            <div>
                                                                <label>Name:</label>
                                                                <input value={row.name} onChange={(e) => {
                                                                    const updatedMasterinput = [...masterinput];
                                                                    updatedMasterinput[masterinput.findIndex(r => r.id === row.id)].name = e.target.value;
                                                                    setmasterinput(updatedMasterinput);
                                                                }} />
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <div>
                                                                    <label>Page:</label>
                                                                    <input value={row.page} onChange={(e) => {
                                                                        const updatedMasterinput = [...masterinput];
                                                                        updatedMasterinput[masterinput.findIndex(r => r.id === row.id)].page = e.target.value;

                                                                        setmasterinput(updatedMasterinput);
                                                                    }} />
                                                                </div>
                                                                <div>
                                                                    <label>Cell:</label>
                                                                    <input value={row.cell} onChange={(e) => {
                                                                        const updatedMasterinput = [...masterinput];
                                                                        updatedMasterinput[masterinput.findIndex(r => r.id === row.id)].cell = e.target.value;
                                                                        setmasterinput(updatedMasterinput);
                                                                        handleMasterinputChange(e.target.value, index)

                                                                    }} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label>Enter Value:</label>
                                                                <input value={row.value} onChange={(e) => {
                                                                    if (!row || !e?.target?.value) {
                                                                        console.error("Row or event value is missing", row, e?.target?.value);
                                                                        return;
                                                                    }
                                                                    const updatedMasterinput = [...masterinput];
                                                                    let temp = masterinput.find(r => r.id == row.id)
                                                                    updatedMasterinput[masterinput.findIndex(r => r.id === row.id)].value = e.target.value;
                                                                    handleContentChangeForMasterinput(temp.page - 1, temp.row, temp.column, e.target.value)
                                                                    setmasterinput(updatedMasterinput);

                                                                }}
                                                                    onBlur={computeCellValue} />
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <checkbox checked={!row.basic} onCheckedChange={() => {
                                                                    const updatedMasterinput = [...masterinput];
                                                                    updatedMasterinput[masterinput.findIndex(r => r.id === row.id)].basic = !row.basic;
                                                                    setmasterinput(updatedMasterinput);
                                                                }} />
                                                                <label>Advanced</label>
                                                                <p
                                                                    onClick={() => navigator.clipboard.writeText(`Page${row.page}!${row.cell}`)}
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    {`Page${row.page}!${row.cell}`}
                                                                </p>                                                        </div>
                                                            <button
                                                                variant="destructive"
                                                                onClick={() => {
                                                                    const updatedMasterinput = masterinput.filter((item) => item.id !== row.id);
                                                                    setmasterinput(updatedMasterinput);
                                                                }}
                                                                className="ml-2"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>



                {/* table on the Right with Overflow */}
                <div style={{ height: "70vw", overflowY: "scroll" }} className="pl-6">

                    <h3 className="text-xl font-semibold">Page {pages[activePage].id}</h3>
                    <DragDropContext onDragEnd={() => handleDragEnd}>
                        <table
                            className="mt-4 border w-full"
                        >
                            <th>
                                <tr className=" text-black dark:bg-black dark:text-white">
                                    <th className="border p-2 w-12">#</th>
                                    {pages[activePage].columns.map((col, index) => (
                                        <th key={index} className="border p-2">
                                            <ResizableBox
                                                handle={(h, ref) => (
                                                    <div
                                                        ref={ref} // Important to keep resizing functionality!
                                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-ew-resize"
                                                    >
                                                        <span style={{ cursor: "pointer" }} className="text-green-500 text-xl hover:text-green-700 transition-all">
                                                            &gt;
                                                        </span>
                                                    </div>
                                                )}

                                                className=" " width={150} height={40} axis="x" resizeHandles={["e"]}>
                                                <div style={{ color: "green" }} className="p-2 text-center">{col}</div>
                                            </ResizableBox>
                                        </th>
                                    ))}
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </th>
                            <Droppable droppableId="rows">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {pages[activePage].rows.map((row, index) => (
                                            <Draggable key={row.id} draggableId={String(row.id)} index={index}>
                                                {(provided) => (
                                                    <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border">
                                                        <td className="border p-2 w-12">{index + 1}</td>
                                                        {row.content.map((cell, colIndex) => {
                                                            const mergeRange = row.merged.find(
                                                                (range) => colIndex >= range.start && colIndex <= range.end
                                                            );
                                                            if (mergeRange) {
                                                                if (colIndex === mergeRange.start) {
                                                                    const colspan = mergeRange.end - mergeRange.start + 1;
                                                                    return (
                                                                        <td key={colIndex} colSpan={colspan}>
                                                                            {isPreviewMode ? (
                                                                                <p style={{ textAlign: "center" }}>{cell[0]}</p>
                                                                            ) : (
                                                                                <>
                                                                                    {(() => {
                                                                                        // Generate cell identifier
                                                                                        const cellIdentifier = `${String.fromCharCode(65 + colIndex)}${index + 1}`;

                                                                                        // Check if cell exists in masterinput
                                                                                        const cellExists = masterinput.some(
                                                                                            (entry) => entry.page == activePage + 1 && entry.cell == cellIdentifier
                                                                                        );

                                                                                        return (
                                                                                            <>
                                                                                                <textarea
                                                                                                    value={cell[0]}
                                                                                                    onChange={(e) => handleContentChange(row.id, colIndex, e.target.value, index)}
                                                                                                    disabled={cellExists} // Disable if cell exists in masterinput
                                                                                                />
                                                                                                <textarea
                                                                                                    type="text"
                                                                                                    value={cell[1]?.[0]}
                                                                                                    placeholder=""
                                                                                                    onChange={(e) =>
                                                                                                        handleRelationChange1(index, colIndex, e.target.value)}
                                                                                                    onBlur={(e) =>
                                                                                                        handleRelationChange(index, colIndex, e.target.value)
                                                                                                    }
                                                                                                    disabled={cellExists} // Disable if cell exists in masterinput

                                                                                                />
                                                                                            </>
                                                                                        );
                                                                                    })()}
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                }
                                                                return null;
                                                            }
                                                            // what is the above code for
                                                            return (
                                                                <td className="border p-2" key={colIndex}>
                                                                    {isPreviewMode ? (
                                                                        <p style={{ whiteSpace: "pre-wrap" }}>{cell[0]}</p>
                                                                    ) : (
                                                                        <>

                                                                            {(() => {
                                                                                // Generate cell identifier
                                                                                const cellIdentifier = `${String.fromCharCode(65 + colIndex)}${index + 1}`;

                                                                                // Check if cell exists in masterinput
                                                                                const cellExists = masterinput.some(
                                                                                    (entry) => entry.page == activePage + 1 && entry.cell === cellIdentifier
                                                                                );

                                                                                return (
                                                                                    <>
                                                                                        <textarea
                                                                                            value={cell[0]}
                                                                                            onChange={(e) => handleContentChange(row.id, colIndex, e.target.value, index)}
                                                                                            disabled={cellExists} // Disable if cell exists in masterinput
                                                                                        />
                                                                                        <textarea
                                                                                            type="text"
                                                                                            value={cell[1]?.[0]}
                                                                                            placeholder=""
                                                                                            onChange={(e) =>
                                                                                                handleRelationChange1(index, colIndex, e.target.value)}
                                                                                            onBlur={(e) =>
                                                                                                handleRelationChange(index, colIndex, e.target.value)
                                                                                            }
                                                                                            disabled={cellExists} // Disable if cell exists in masterinput

                                                                                        />
                                                                                    </>
                                                                                );
                                                                            })()}

                                                                        </>
                                                                    )}
                                                                </td>
                                                            );




                                                            // return(
                                                            //     <td key={colIndex} className="border p-2">
                                                            //         {isPreviewMode ? <span>{cell[0]}</span> : (
                                                            //             <>
                                                            //                 <input value={cell[0]} onChange={(e) => handleContentChange(row.id, colIndex, e.target.value)} />
                                                            //                 <textarea
                                                            //                     type="text"
                                                            //                     value={cell[1]?.[0]}
                                                            //                     placeholder="Relation (e.g., 2*A1)"
                                                            //                     onChange={(e) =>
                                                            //                         handleRelationChange1(index, colIndex, e.target.value)
                                                            //                     }
                                                            //                     onBlur={(e) =>
                                                            //                         handleRelationChange1(index, colIndex, e.target.value)
                                                            //                     }
                                                            //                 />
                                                            //             </>)}
                                                            //     </td>
                                                            // )


                                                        })}
                                                        {!isPreviewMode && (
                                                            <td className="border p-2">
                                                                <input
                                                                    type="text"
                                                                    value={row.mergeinput}
                                                                    onChange={(e) => handleMergeinputChange(row.id, e.target.value)}
                                                                    placeholder="e.g., 1-3"
                                                                />
                                                                <button onClick={() => handleMergeColumns(row.id, row.mergeinput)}>
                                                                    Merge
                                                                </button >
                                                                {row.merged.map((merge, index) => (
                                                                    <div key={index}>
                                                                        <button onClick={() => handleRemoveMerge(row.id, index)}>
                                                                            Remove Merge
                                                                        </button>
                                                                        <span>{`Merged: ${merge.start + 1}-${merge.end + 1}`}</span>
                                                                    </div>
                                                                ))}
                                                                <button className="" onClick={() => handleRemoveRow(row.id)} variant="destructive">🗑 Remove Row</button>
                                                            </td>
                                                        )}

                                                    </tr>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </table>
                    </DragDropContext>
                </div>
                {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <span></span>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Save Template</DialogTitle>
                        <DialogDescription>Enter details for saving the template.</DialogDescription>
                        <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <input placeholder="Scheme" value={formData.scheme} onChange={(e) => setFormData({ ...formData, scheme: e.target.value })} />
                        <input placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        <button onClick={(e) => handleSubmit(e)}>Save</button>
                    </DialogContent>
                </Dialog> */}
            </div>
        </div>
    );
}

export default App;