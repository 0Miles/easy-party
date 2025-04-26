/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

export default function ImageSelector({ className, onChange, defaultImage, placeholder, onPreviewChange }: any) {
    const [selectedImage, setSelectedImage] = useState(() => defaultImage)
    
    useEffect(() => {
        setSelectedImage(defaultImage)
    }, [defaultImage])

    const onDrop = useCallback((acceptedFiles: any[]) => {
        const file = acceptedFiles[0]
        const reader = new FileReader()

        reader.onload = (e) => {
            setSelectedImage(e.target?.result)
            onPreviewChange?.(e.target?.result)
        }
        onChange?.(file)

        reader.readAsDataURL(file)
    }, [onChange, onPreviewChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/webp': [],
            'image/png': [],
            'image/jpeg': [],
            'image/gif': []
        }
    })

    return (
        <div className={`${className} ${isDragActive ? 'b:2 bg:gray/.2!' : ''} rel ~border-color|.3s,background-color|.3s bg:gray-20@dark bg:gray-80@light b:0|dashed|gray r:5 rel overflow:clip cursor:pointer opacity:.8!:hover>.hover`}>
            {selectedImage && (
                <img className="abs object-fit:cover pointer-events:none" src={selectedImage} width="100%" height="100%" alt="Selected" referrerPolicy="no-referrer" />
            )}

            <div className="w:full h:full flex justify-content:center align-items:center " {...getRootProps()}>
                <input {...getInputProps()} />
                {placeholder}
            </div>
            <div className="hover abs flex flex:col justify-content:center align-items:center inset:0 text:white opacity:0 bg:black/.7 ~opacity|.3s pointer-events:none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                    <circle cx="12" cy="13" r="3"></circle>
                </svg>
            </div>
        </div>
    )
}
