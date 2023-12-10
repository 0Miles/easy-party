import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase/firebase'


export async function uploadImage(partyId: string, image: File, path: string[] = []) {
    path.push(image.name)
    const filePath = `images/${partyId}/${path.join('/')}`;
    const newImageRef = ref(storage, filePath);
    await uploadBytesResumable(newImageRef, image);

    return await getDownloadURL(newImageRef);
}
