import React, { useState, useEffect } from "react";
const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id");
import { storage } from "./Firebase"
import { listAll, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 } from "uuid"

export default function FileUpload() {
    const [file, setFile] = useState(null)
    const [fileList, setFileList] = useState([])

    const fileListRef = ref(storage, "files/")
    const uploadFile = () => {
        if (file == null) return;
        const fileRef = ref(storage, `files/${file.name + v4()}`);
        uploadBytes(fileRef, file).then(() => {
            alert("Imaged Uploaded!")
        });
    }
    
    useEffect(() => {
        listAll(fileListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setFileList((prev) => [...prev, url]);
                })
            })
        })
    }, [])

    return (
        <div>
            <input 
                type="file" 
                onChange={(event) => {
                    setFile(event.target.files[0]);
                }}
            />
            <button onClick={uploadFile}>Upload File</button>
            

            {fileList.map((url) => {
                console.log(url)
            })}
        </div>
    );
}