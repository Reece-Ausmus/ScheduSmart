import React, { useState, useEffect } from "react";
const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id");


export default function FileUpload() {
    const [file, setFile] = useState()

    function handleFile(event) {
        setFile(event.target.files[0])
        console.log(event.target.files[0])
    }
    
    return (
        <>
            <form>
                <input type="file" name="file" onChange={handleFile}/>
                <button>Upload</button>
            </form>    
        </>
    )
}