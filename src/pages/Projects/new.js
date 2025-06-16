<div ref={invoiceRef} style={pageStyle}>
        <img src={company.letterheadSrc} alt="Letterhead" style={letterheadStyle} />

        {/* --- Example Fields Below --- */}
        <div style={{ textAlign: 'center', border: '1px solid black', padding: '5px' }}>
          <h1>{performa.BillType}</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '75%', border: '1px solid black', padding: '10px' }}>
            <p><strong>Company Name:</strong> {performa.companyName}</p>
            <p><strong>Company Pan No.:</strong> {performa.companyPanNo}</p>
            <p><strong>State:</strong> {performa.state}</p>
            <p><strong>Invoice No.:</strong> {performa.invoiceNo}</p>
          </div>
          <div style={{ width: '38.5%', border: '1px solid black', padding: '10px' }}>
            <p><strong>GSTIN:</strong> {performa.gstin}</p>
            <p><strong>State Code:</strong> {performa.stateCode}</p>
            <p><strong>Invoice Date:</strong> {performa.invoiceDate}</p>
          </div>
        </div>
        <div style={{ border: '1px solid black', padding: '10px' }}>
          <p><strong>Receiver Name:</strong> {performa.receiverName}</p>
          <p><strong>Address:</strong> {performa.receiverAddress}</p>
          <p><strong>GSTIN:</strong> {performa.receiverGstin}</p>
          <p><strong>State:</strong> {performa.receiverState}</p>
          <p><strong>Project No.:</strong> {performa.projectNo}</p>
          <p><strong>Project Reference No.:</strong> {performa.projectReferenceNo}</p>
          <p><strong>Work Order No.:</strong> {performa.workOrderNo}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '75%', border: '1px solid black', padding: '10px' }}>
            <p><strong>SAC Code:</strong> {performa.sac_code}</p>
            <p><strong>Particulars:</strong><br />{performa.particulars}</p>
          </div>
          <div style={{ width: '38.5%', border: '1px solid black', padding: '10px' }}>
            <p><strong>AMT. (Rs):</strong> {Number(performa.amtRs).toLocaleString()}</p>
            {performa.gst && (
              <>
                <p style={{ fontSize: '12px', marginTop: '100px' }}><strong>CGST @9%:</strong> {performa.cgst.toLocaleString()}</p>
                <p style={{ fontSize: '12px' }}><strong>SGST @9%:</strong> {performa.sgst.toLocaleString()}</p>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '75%', border: '1px solid black', padding: '10px' }}>
            <p><strong>In Words:</strong> {performa.amtWords}</p>
          </div>
          <div style={{ width: '38.5%', border: '1px solid black', padding: '10px' }}>
            <p><strong>Total AMT. (Rs):</strong> {performa.tot.toLocaleString()}</p>
          </div>
        </div>
        <div style={{ display: 'flex', border:"1px solid black",justifyContent: 'space-between', marginBottom: '0',maxHeight: 'max-content'  }}>
                    <div style={{ width: '75%',  padding: '10px' }}>
                        <p>
                            <strong> Bank Details :</strong> AXIS Bank Ltd
                        </p>
                        <p>
                            <strong> A/c Name :</strong>  Vivek Bhole Consultants Pvt Ltd
                        </p>
                        <p>
                            <strong> A/C No. :</strong> 919020012575070
                        </p>
                        <p>
                            <strong>IFSC CODE :</strong> UTIB0000395
                        </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          <div style={{   padding: '10px'}}>
            <img src={company.sealSrc} alt={company.sealAlt} style={sealStyle} />
            <p style={{ marginTop: '20px', textAlign: 'center' }}><strong>Common Seal</strong></p>
          </div>
          <div style={{  padding: '10px', textAlign: 'center' }}>
            <p>
                <strong>{company.stampTitle}</strong>
                </p>
            <img src={company.stampSrc} alt={company.stampAlt} style={stampStyle} />
            <p style={{ marginTop: '10px' }}><strong>{company.stampSignatoryLabel || '(Authorised Signatory)'}</strong></p>
          </div>
        </div>
                    </div>
  
      </div>