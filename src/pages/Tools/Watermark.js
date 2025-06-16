import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Breadcrumb, Col, Row, Form, Card, Button, Table, Container, InputGroup, Modal, Tab, Nav } from '@themesberg/react-bootstrap';


const PreviewWatermarkedPDF = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [letterheady, setletterheady] = useState(80);
  const [contenty, setcontenty] = useState(-90);

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
    setPreviewUrl(null); // Reset preview on new upload
  };

  const applyWatermark = async () => {
    if (!pdfFile) {
      alert("Please upload a PDF to apply the watermark.");
      return;
    }

    try {
      const pdfReader = new FileReader();

      pdfReader.onload = async () => {
        const pdfBytes = new Uint8Array(pdfReader.result);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Load the main watermark image
        const watermarkResponse = await fetch('./a.png');
        const watermarkBytes = await watermarkResponse.arrayBuffer();
        const watermark = await pdfDoc.embedPng(watermarkBytes);

        // Load the letterhead image
        const letterHeadResponse = await fetch('./c.png');
        const letterHeadBytes = await letterHeadResponse.arrayBuffer();
        const letterHead = await pdfDoc.embedPng(letterHeadBytes);

        // Get dimensions for scaling
        const watermarkDims = watermark.scale(0.8); // Scale down the watermark
        const letterHeadDims = letterHead.scale(0.28); // Adjust scale as needed for letterhead

        const pages = pdfDoc.getPages();

        // Add watermark and letterhead to the first page
        const firstPage = pages[0];
        const { width: firstPageWidth, height: firstPageHeight } = firstPage.getSize();

        // Add letterhead on the first page
        firstPage.drawImage(letterHead, {
          x: firstPageWidth / 2 - letterHeadDims.width / 2,
          y: firstPageHeight - letterHeadDims.height + letterheady, // 20px margin from the top
          width: letterHeadDims.width,
          height: letterHeadDims.height,
        });

        firstPage.translateContent(0, contenty); // Move content 50 units downward

        // Add watermark on the first page
        firstPage.drawImage(watermark, {
          x: firstPageWidth / 2 - watermarkDims.width / 2,
          y: firstPageHeight / 2 - watermarkDims.height / 2,
          width: watermarkDims.width,
          height: watermarkDims.height,
          opacity: 0.2,
        });

        // Add watermark to all remaining pages
        for (let i = 1; i < pages.length; i++) {
          const page = pages[i];
          const { width, height } = page.getSize();

          page.drawImage(watermark, {
            x: width / 2 - watermarkDims.width / 2,
            y: height / 2 - watermarkDims.height / 2,
            width: watermarkDims.width,
            height: watermarkDims.height,
            opacity: 0.2,
          });
        }

        const pdfDataUri = await pdfDoc.save();
        const blob = new Blob([pdfDataUri], { type: "application/pdf" });
        setPreviewUrl(URL.createObjectURL(blob));
      };

      pdfReader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      console.error("Error applying watermark:", error);
      alert("An error occurred while processing the PDF.");
    }
  };

  const applyWatermark1 = async () => {
    if (!pdfFile) {
      alert("Please upload a PDF to apply the watermark.");
      return;
    }

    try {
      const pdfReader = new FileReader();

      pdfReader.onload = async () => {
        const pdfBytes = new Uint8Array(pdfReader.result);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Fetch the image from the source
        const imageResponse = await fetch('./a.png');
        const imageBytes = await imageResponse.arrayBuffer();
        const image = await pdfDoc.embedPng(imageBytes); // Embed PNG, or use `embedJpg` for JPG

        const imageDims = image.scale(0.8); // Scale down the image
        const pages = pdfDoc.getPages();

        for (const page of pages) {
          const { width, height } = page.getSize();

          page.drawImage(image, {
            x: width / 2 - imageDims.width / 2,
            y: height / 2 - imageDims.height / 2,
            width: imageDims.width,
            height: imageDims.height,
            opacity: 0.2, // Transparency for watermark
          });
        }

        const pdfDataUri = await pdfDoc.save();
        const blob = new Blob([pdfDataUri], { type: "application/pdf" });
        setPreviewUrl(URL.createObjectURL(blob));
      };

      pdfReader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      console.error("Error applying watermark:", error);
      alert("An error occurred while processing the PDF.");
    }
  };
  const downloadPDF = () => {
    if (previewUrl) {
      saveAs(previewUrl, "watermarked_with_preview.pdf");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>PDF Watermark Preview Tool</h2>
      <div>
        <label>
          Upload PDF:{" "}
          <input type="file" accept="application/pdf" onChange={handlePdfChange} />
        </label>
      </div>
      <Form.Group className="mb-3" controlId="editHeading">
        <Form.Label>Letter Only for Watermark + Letter Head</Form.Label>
        <Form.Control type="number" value={letterheady} onChange={(e) => setletterheady(+(e.target.value))} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="editHeading">
        <Form.Label>Content Only for Watermark + Letter Head</Form.Label>
        <Form.Control type="number" value={contenty} onChange={(e) => setcontenty(+(e.target.value))} />
      </Form.Group>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={applyWatermark}
      >
        Watermark + Letter Head
      </button>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={applyWatermark1}
      >
        Watermark
      </button>


      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview:</h3>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              maxHeight: "700px",
              overflow: "auto",
            }}
          >
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
              <Viewer fileUrl={previewUrl} />
            </Worker>
          </div>
          <button
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default PreviewWatermarkedPDF;
