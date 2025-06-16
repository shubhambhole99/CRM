// import React, { useEffect, useState } from 'react';
// import * as XLSX from 'xlsx';

// const ExcelSheetPreviewer = ({ conso }) => {
//     const [sheetNames, setSheetNames] = useState([]);
//     const [sheetsData, setSheetsData] = useState({});
//     const [activeSheet, setActiveSheet] = useState('');
//     let excelFileUrl
//     // console.log()
//     if (conso) {
//         const urlParts = (conso?.urls[0]?.file)?.split('/');
//         // Replace the domain part (e.g., officecrm560)
//         urlParts[2] = urlParts[2].replace(/^[^\.]+/, "officecrm560");
//         excelFileUrl = urlParts.join('/');
//     }
//     //   conso?.urls?.file
//     // 'https://officecrm560.s3.ap-south-1.amazonaws.com/Imtiaz+Bandra++41./Lucky+Realty+Bandra1717420102462.xlsx'
//     // 'https://officecrm560.s3.ap-south-1.amazonaws.com/2025/03/28.Prashantiben+(santacruz)+/Prashantiben+FAQs(Uploaded)1741106390045.xlsx';
//     useEffect(() => {
//         const loadExcelFromURL = async () => {
//             try {
//                 const response = await fetch(excelFileUrl);
//                 const blob = await response.blob();
//                 const reader = new FileReader();

//                 reader.onload = (evt) => {
//                     const bstr = evt.target.result;
//                     const wb = XLSX.read(bstr, { type: 'binary' });

//                     const allSheets = {};
//                     wb.SheetNames.forEach((name) => {
//                         const ws = wb.Sheets[name];
//                         allSheets[name] = XLSX.utils.sheet_to_json(ws, { header: 1 });
//                     });

//                     setSheetNames(wb.SheetNames);
//                     setSheetsData(allSheets);
//                     setActiveSheet(wb.SheetNames[0]); // default to first sheet
//                 };

//                 reader.readAsBinaryString(blob);
//             } catch (error) {
//                 console.error('Error loading Excel file:', error);
//             }
//         };

//         loadExcelFromURL();
//     }, [conso]);

//     return (
//         <div>
//             <a href={excelFileUrl} download>Download</a>
//             {sheetNames.length > 0 ? (
//                 <>
//                     <div style={{ marginBottom: '20px' }}>
//                         <label>Select Sheet: </label>
//                         <select onChange={(e) => setActiveSheet(e.target.value)} value={activeSheet}>
//                             {sheetNames?.map((name) => (
//                                 <option key={name} value={name}>
//                                     {name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <table border="1" cellPadding="5">
//                         <tbody>
//                             {sheetsData[activeSheet]?.map((row, rowIndex) => (
//                                 <tr key={rowIndex}>
//                                     {row.map((cell, colIndex) => (
//                                         <td key={colIndex}>{cell}</td>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </>
//             ) : (
//                 <p>Loading spreadsheet...</p>
//             )}
//         </div>
//     );
// };

// export default ExcelSheetPreviewer;
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelSheetPreviewer = ({ conso }) => {
    const [sheetNames, setSheetNames] = useState([]);
    const [sheetsData, setSheetsData] = useState({});
    const [activeSheet, setActiveSheet] = useState('');
    let [showdigits,setshowdigits]=useState(true)
    let excelFileUrl;

    if (conso) {
        const urlParts = (conso?.urls[0]?.file)?.split('/');
        // Replace the domain part (e.g., officecrm560)
        urlParts[2] = urlParts[2].replace(/^[^\.]+/, "officecrm560");
        excelFileUrl = urlParts.join('/');
    }

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
                        allSheets[name] = XLSX.utils.sheet_to_json(ws, {
                            header: 1,
                            defval: '',
                            raw: true,
                        });
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
        if(conso){
        loadExcelFromURL();
    }
    }, [conso]);


    return (
        <div>
            <a href={excelFileUrl} download>
                Download
            </a>
            <button onClick={()=>setshowdigits(!showdigits)}>
                Show Digits
            </button>

            {sheetNames?.length > 0 ? (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <label>Select Sheet: </label>
                        <select
                            onChange={(e) => setActiveSheet(e.target.value)}
                            value={activeSheet}
                        >
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
                                        showdigits ? (
                                            <td key={colIndex}>
                                                {typeof cell === 'number' ? cell.toFixed(5) : (cell || '')}
                                            </td>
                                        ) : (
                                            <td key={colIndex}>
                                                {cell}
                                            </td>
                                        )
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
