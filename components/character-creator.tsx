import ImageSelector from './image-selector'
import { useMemo, useState } from 'react'

export default function CharacterCreator({ className, defaultName, defaultAvatar, onChange }: any) {
    const [name, setName] = useState<string>(defaultName)
    const [avatarFile, setAvatarFile] = useState<File>()

    useMemo(() => {
        onChange && onChange({
            name,
            avatarFile
        })
    }, [avatarFile, name, onChange])

    return (
        <div className={`flex align-items:center ${className ?? ''}`}>
            <ImageSelector className="flex 64x64 r:50% flex:0|0|auto"
                defaultImage={defaultAvatar}
                onChange={(data: any) => { setAvatarFile(data) }}
            />
            <input className="flex flex:1 w:0 mx:16 f:24 pb:8 outline:none border-width:0|0|2|0 b:solid 
                              b:white b:gray-80@light b:blue-50:focus b:sky-60:focus@light"
                   type="text" value={name} onChange={(e: any) => setName(e.target.value)} />
        </div>
    )
}