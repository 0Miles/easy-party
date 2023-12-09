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
    Transaction,
    DocumentReference,
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

export async function getParty(partyId: any): Promise<any> {
    const docRef = doc(db, 'party', partyId)
    const docSnap = await getDoc(docRef)
    if (docSnap.data()) {
        return {
            id: docRef.id,
            ...docSnap.data()
        }
    } else {
        return null
    }
}

export async function updatePartyImage(partyId: string, imageUrl: string) {
    const partyRef = doc(collection(db, 'party'), partyId);
    if (partyRef) {
        await updateDoc(partyRef, { image: imageUrl });
    }
}

export async function updateParticipantToParty(partyId: string, participantData: any) {

    const auth = getAuth()

    if (auth.currentUser) {
        const newParticipantDocRef = doc(collection(db, `party/${partyId}/participant`), auth.currentUser.uid)

        participantData.uid = auth.currentUser.uid
        participantData.avatar = auth.currentUser.photoURL
        participantData.displayName = auth.currentUser.displayName

        await runTransaction(db, transaction =>
            updateParticipant(transaction, newParticipantDocRef, participantData)
        )
    } else {
        throw 'User is not logged in'
    }
}

const updateParticipant = async (
    transaction: Transaction,
    newParticipantDocRef: DocumentReference,
    participantData: any
) => {

    transaction.set(newParticipantDocRef, {
        ...participantData,
        timestamp: Timestamp.fromDate(new Date()),
    })
}

export async function getParticipantsByPartyId(partyId: string) {
    const q = query(
        collection(db, 'party', partyId, 'participant'),
        orderBy('timestamp')
    )

    const results = await getDocs(q);
    return results.docs.map(doc => {
        return {
            id: doc.id,
            ...doc.data()
        }
    })
}

export function getParticipantsSnapshotByPartyId(partyId: string, callback: (results: any[]) => void) {
    
    const q = query(
        collection(db, 'party', partyId, 'participant'),
        orderBy('timestamp')
    )

    const unsubscribe = onSnapshot(q, querySnapshot => {
        const results = querySnapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate(),
            }
        })
        callback(results)
    })
    return unsubscribe
}