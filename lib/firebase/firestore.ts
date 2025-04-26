import {
    collection,
    onSnapshot,
    query,
    getDocs,
    doc,
    getDoc,
    orderBy,
    Timestamp,
    runTransaction,
    addDoc,
    Transaction,
    DocumentReference,
    where
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
        throw new Error('User is not logged in')
    }
}

export async function updateParty(partyId: string, party: any) {

    const partyRef = doc(collection(db, 'party'), partyId)
    await runTransaction(db, transaction => updateDataTransaction(transaction, partyRef, party))
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
    const partyRef = doc(collection(db, 'party'), partyId)
    if (partyRef) {
        await runTransaction(db, transaction => updateDataTransaction(transaction, partyRef, { image: imageUrl }))
    }
}

export async function updatePartyCharacters(partyId: string, characters: any[]) {
    const partyRef = doc(collection(db, 'party'), partyId)
    if (partyRef) {
        await runTransaction(db, transaction => updateDataTransaction(transaction, partyRef, { characters: characters }))
    }
}

const updateDataTransaction = async (
    transaction: Transaction,
    docRef: DocumentReference,
    data: any
) => {
    transaction.update(docRef, {
        ...data,
        timestamp: Timestamp.fromDate(new Date()),
    })
}

export async function updateParticipantToParty(partyId: string, participantData: any, character: any) {

    if (character.googleUser) {

        const auth = getAuth()
        if (auth.currentUser) {
            const participantDocRef = doc(collection(db, `party/${partyId}/participant`), auth.currentUser.uid)
            const participantDoc = await getDoc(participantDocRef)

            participantData.timestamp = Timestamp.fromDate(new Date())

            if (!participantDoc.exists()) {
                participantData.uid = auth.currentUser.uid
                participantData.avatarUrl = auth.currentUser.photoURL
                participantData.displayName = auth.currentUser.displayName
                await runTransaction(db, transaction => {
                    transaction.set(participantDocRef, participantData)
                    return Promise.resolve()
                })
            } else {
                await runTransaction(db, transaction => {
                    transaction.update(participantDocRef, participantData)
                    return Promise.resolve()
                })
            }
        } else {
            throw new Error('User is not logged in')
        }
    } else {
        const newParticipantDocRef = doc(collection(db, `party/${partyId}/participant`), character.id)
        participantData.characterId = character.id
        participantData.avatarUrl = character.avatarUrl
        participantData.displayName = character.name

        await runTransaction(db, transaction =>
            {
                transaction.set(newParticipantDocRef, {
                    ...participantData,
                    timestamp: Timestamp.fromDate(new Date()),
                })
                return Promise.resolve()
            }
        )
    }
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

export async function updateParticipantDisplay(partyId: string, newDisplayName: string, avatarUrl?: string) {
    const auth = getAuth()
    if (!auth.currentUser) {
        throw new Error('User is not logged in')
    }

    try {
        const participantDocRef = doc(collection(db, `party/${partyId}/participant`), auth.currentUser.uid)
        const participantDoc = await getDoc(participantDocRef)

        if (!participantDoc.exists()) {
            
            const newParticipantData: any = {
                uid: auth.currentUser.uid,
                displayName: newDisplayName,
                avatarUrl : avatarUrl || auth.currentUser.photoURL,
                freeDays: [],
                timestamp: Timestamp.fromDate(new Date())
            }
            
            await runTransaction(db, transaction => {
                transaction.set(participantDocRef, newParticipantData)
                return Promise.resolve()
            })
        } else {
            const participantData = participantDoc.data()
            const updateData = {
                displayName: newDisplayName,
                avatarUrl: avatarUrl || participantData.avatarUrl,
                timestamp: Timestamp.fromDate(new Date())
            }

            await runTransaction(db, transaction => {
                transaction.update(participantDocRef, updateData)
                return Promise.resolve()
            })
        }
        
        return true
    } catch (error) {
        console.error("Update participant display name and avatar failed:", error)
        return false
    }
}