/* eslint-disable @next/next/no-img-element */
import { getDictionary } from '@/locales/locale'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function ImageSelector({ locale, className, onChange, defaultImage }: any) {
    const { t } = getDictionary(locale)
    const [selectedImage, setSelectedImage] = useState(defaultImage) as any

    const onDrop = useCallback((acceptedFiles: any[]) => {
        const file = acceptedFiles[0]
        const reader = new FileReader()

        reader.onload = (e) => {
            setSelectedImage(e.target?.result)
        }
        onChange && onChange(file)

        reader.readAsDataURL(file)
    }, [onChange])

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
        <div className={`${className} ${isDragActive ? 'b:2 bg:gray/.2!' : ''} ~border-color|.3s,background-color|.3s bg:gray-20@dark bg:gray-80@light b:0|dashed|gray r:5 rel overflow:clip`}>
            {selectedImage && (
                <img className="abs object-fit:cover pointer-events:none" src={selectedImage} width="100%" height="100%" alt="Selected" />
            )}

            <div className="w:full h:full flex justify-content:center align-items:center " {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="f:18 fg:gray-80 fg:gray-10@light">{t('Click or drag the image here')}</p>
            </div>

        </div>
    )
}
