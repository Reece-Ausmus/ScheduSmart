import React, { useState, useEffect } from "react";
const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id");


export default function FileUpload() {
    const [file, setFile] = useState()

    function handleFile(event) {
        setFile(event.target.files[0])
        console.log(event.target.files[0])
    }

    function handleUpload() {
        const formData = new FormData()
        formData.append('file', file)
        fetch(
            'url',
            {
                method: "POST",
                body: formData
            }
        ).then((response) => response.json())
        .then(
            (result) => {
                console.log('success', result)
            }
        )
        .catch(error => {
            console.error("Error:", error)
        })
    }
    
    return (
        <>
            <form onSubmit={handleUpload}>
                <input type="file" name="file" onChange={handleFile}/>
                <button>Upload</button>
            </form>    
        </>
    )
}