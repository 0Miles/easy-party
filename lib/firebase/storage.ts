import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase/firebase'


export async function uploadImage(partyId: string, image: File) {
    const filePath = `images/${partyId}/${image.name}`;
    const newImageRef = ref(storage, filePath);
    await uploadBytesResumable(newImageRef, image);

    return await getDownloadURL(newImageRef);
}
