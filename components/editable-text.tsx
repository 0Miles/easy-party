'use client'

import { useState, useRef, useEffect } from 'react'

interface EditableTextProps {
    text: string
    isEditable?: boolean
    onSave?: (newText: string) => void | Promise<void>
    editButtonTitle?: string
    saveButtonTitle?: string
}

export default function EditableText({ 
    text, 
    isEditable = false, 
    onSave, 
    editButtonTitle = 'Edit',
    saveButtonTitle = 'Save'
}: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [newText, setNewText] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            setNewText(text)
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing, text])

    const handleEditClick = () => {
        setIsEditing(true)
    }

    const handleSave = async () => {
        if (!onSave || newText.trim() === '' || newText === text) {
            setIsEditing(false)
            return
        }

        setIsSaving(true)
        try {
            await Promise.resolve(onSave(newText.trim()))
        } finally {
            setIsSaving(false)
            setIsEditing(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave()
        } else if (e.key === 'Escape') {
            setIsEditing(false)
        }
    }

    return (
        <div className="flex align-items:center">
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    className="p:4 border:1|solid|black border:1|solid|gray-90@dark f:16 outline:none"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSaving}
                />
            ) : (
                <span>{text}</span>
            )}
            {isEditable && !isEditing && (
                <div 
                    className="ml:4 cursor:pointer p:2 color:gray-60 color:gray-40@dark"
                    onClick={handleEditClick}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.keyCode === 32) {
                            e.preventDefault()
                            handleEditClick()
                        }
                    }}
                    tabIndex={0}
                    title={editButtonTitle}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </div>
            )}
            {isEditing && (
                <div 
                    className={`
                        ml:4 cursor:pointer p:2 color:gray-40 color:gray-60@dark
                        ${isSaving ? 'opacity:70 cursor:wait' : ''}
                    `}
                    onClick={isSaving ? undefined : handleSave}
                    tabIndex={0}
                    title={saveButtonTitle}
                >
                    {isSaving ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                            <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" strokeDasharray="32" strokeDashoffset="8" fill="none" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    )}
                </div>
            )}
        </div>
    )
}