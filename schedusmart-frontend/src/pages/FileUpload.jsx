import React, { useState, useEffect } from "react";
const flaskURL = "http://127.0.0.1:5000";
const userId = sessionStorage.getItem("user_id");
import { storage } from "./Firebase"
import { listAll, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 } from "uuid"

export default function FileUpload() {
    const validExtensions = [
        "txt",
        "rtf",
        "docx",
        "csv",
        "doc",
        "wps",
        "wpd",
        "msg",
        "jpg",
        "png",
        "webp",
        "gif",
        "tif",
        "bmp",
        "eps",
        "mp3",
        "wma",
        "snd",
        "wav",
        "ra",
        "au",
        "aac",
        "mp4",
        "3gp",
        "avi",
        "mpg",
        "mov",
        "wmv",
        "xlsx",
        "pdf",
      ];
      
    const [file, setFile] = useState(null)
    const [fileList, setFileList] = useState([])

    const fileListRef = ref(storage, "files/")
    const uploadFile = () => {
        if (file == null) return;
        const fileRef = ref(storage, `files/${file.name + v4()}`);
        uploadBytes(fileRef, file).then(() => {
            alert("Image Uploaded!")
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
                data-testid="test1"
                onChange={(event) => {
                    let file_exen = event.target.files[0].name
                        .split(".")
                        .pop();
                    let valid = false;
                    validExtensions.map((extension) => {
                        if (file_exen == extension) valid = true;
                    });
                    if (valid) {
                        setFile(event.target.files[0]);
                    }
                }}
            />
            <button data-testid="test2" onClick={uploadFile}>Upload File</button>
            {fileList.map((url) => {
                console.log(url)
            })}
        </div>
    );
}