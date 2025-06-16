
// Shubham
const baseurl="https://shmy0ykpgi.execute-api.ap-south-1.amazonaws.com/prod"
// Devoffice
// const baseurl="https://n8i73ay4q0.execute-api.ap-south-1.amazonaws.com/prod"
// Rekha New 
// const baseurl="https://i5aigtsqzf.execute-api.ap-south-1.amazonaws.com/prod"
// Local
// const baseurl = "http://192.168.5.235:8000"
// const baseurl ="http://localhost:8000"
const toi = ["Fees", "Services"]
const toe=["Loan","Tax","Maintenance","Other","Insurance"]
const types = ["Lumpsum", "Percentage", "On Sqft"]
const banknames = ['Misc', 'Bandhan-20100018657972', 'Bharat-612100014610', 'Bharat-610100084505', 'DNS-29010100001263', 'HDFC-1451050122678', 'HDFC-501000174801181','SBI-00000020520920801']
const ProjectStatus = ["Active", "Inactive", "Working", "Working Active","Pitch", "Pre-Appointment", "Completed"]
const Agency = ['SRA', 'Mhada', 'General', 'PMC','Accounts']
const companies = ["Neo", "BZ", "PMC", "VBCPL", "VBAPL", "None of the Above"]
const tds = ['No TDS Cut', 'TDS cut but not Paid',"TDS cut and Paid", "TDS Claimed"]
const gst = ['GST not Charged', "GST Charged Unpaid", "GST Paid"]
const wards = ["A", "B", "C", "D", "E", "F/N", "F/S", "G/N", "G/S", "H/E", "H/W", "K/E", "K/W", "L", "M/E", "M/W", "N", "P/N", "P/S", "R/N", "R/S", "R/C", "S", "T"]
let Acknowledgement = ["Not Required", "Uploaded", "Yet to Upload"]
let Forward = ["Not Required", "Forwarded", "Yet to Forwarded"]
let Type = ["Circular", "Letter"]
let database="officecrm560"
export { baseurl, toi, ProjectStatus, banknames, types, Agency, tds, gst, wards, companies, Acknowledgement, Forward, Type,database,toe}

// https://jiycm07tpk.execute-api.ap-south-1.amazonaws.com/prod