import React, { useState, useEffect } from "react";


export default function FileUpload() {
    const formHandler = (e) => {
        e.preventDefault();
        const file = e.target[0].files[0]
        console.log(file);
    }

    return (
        <>
        <form onSubmit={formHandler}>
            <input type="file" className="input"/>
            <button type="submit">Upload</button>
        </form>
        </>
    )
}