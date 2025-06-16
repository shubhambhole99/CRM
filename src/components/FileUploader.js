import 'react-toastify/dist/ReactToastify.css';
import { triggerFunction, getPredefinedUrl } from '../components/SignedUrl';
import Swal from 'sweetalert2'



const fileUploader = (selectedFiles) => {
    return new Promise(async (resolve, reject) => {
        let urlarr = [];
        // console.log(selectedFiles)
        // Create an array of promises for file uploads
        const uploadPromises = selectedFiles.map((fileData) => {
            return new Promise((resolve, reject) => {
                // console.log(fileData)
                let fileurl = fileData[0];
                let selectedFile = fileData[2];
                console.log(selectedFile)
                console.log(selectedFile.name, selectedFile.name.replace(/\+|(\.[^\.]+)$/g, ''))
                if (selectedFile) {
                    const reader = new FileReader();
             
                    reader.onload = async () => {
                        try {
                            Swal.fire({
                                title: 'Uploading...',
                                html: 'Please wait while we upload your file.',
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                }
                            });

                            // Perform the file upload
                            const responseFile = await fetch(fileurl, {
                                method: 'PUT',
                                body: selectedFile,
                                headers: {
                                    'Content-Type': 'application/octet-stream', // Set appropriate content type
                                },
                                mode: 'cors', // Enable CORS
                            });

                            // if (!responseFile.ok) {
                            //     throw new Error('Network response was not ok');
                            // }

                            // Add file URL to the array
                            urlarr.push([
                                getPredefinedUrl(fileData[1]),
                                selectedFile.name.replace(/\+|(\.[^\.]+)$/g, ''),
                            ]);

                            Swal.fire({
                                title: 'Success!',
                                text: 'File uploaded successfully.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                            });

                            resolve(); // Resolve the promise for this file
                        } catch (error) {
                            console.error('Upload error:', error);
                            Swal.fire({
                                title: 'Error!',
                                text: 'There was a problem uploading the file.',
                                icon: 'error',
                                confirmButtonText: 'OK',
                            });
                            reject(error); // Reject the promise if upload fails
                        }
                    };

                    reader.onerror = (error) => {
                        console.error('FileReader error:', error);
                        reject(error); // Reject the promise on FileReader error
                    };

                    // Read the file as ArrayBuffer
                    reader.readAsArrayBuffer(selectedFile);
                } else {
                    resolve(); // Resolve immediately if no file is selected
                }
            });
        });

        // Wait for all upload promises to complete
        await Promise.all(uploadPromises);

        // Resolve the final array
        resolve(urlarr);
    });
};
export default fileUploader