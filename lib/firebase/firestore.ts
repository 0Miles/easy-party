import {
    collection,
    onSnapshot,
    query,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    orderBy,
    Timestamp,
    runTransaction,
    where,
    addDoc,
} from 'firebase/firestore'

import { db } from '@/lib/firebase/firebase'
import { getAuth } from 'firebase/auth'


export async function addParty(newParty: any) {
    const auth = getAuth()

    if (auth.currentUser) {
        newParty.createdBy = auth.currentUser.uid

        const docRef = await addDoc(collection(db, 'party'), newParty)
        return docRef.id
    } else {
        throw 'User is not logged in'
    }
}

export async function updatePartyImage(partyId: string, imageUrl: string) {
    const partyRef = doc(collection(db, "party"), partyId);
    if (partyRef) {
        await updateDoc(partyRef, { image: imageUrl });
    }
}