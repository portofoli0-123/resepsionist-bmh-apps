"use server"

import { revalidatePath } from "next/cache"
import type { Guest } from "@/components/buku-tamu/types"
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore/lite"
import { db } from "@/lib/firebase/config"

const COLLECTION_NAME = "buku_tamu"

export async function getGuests() {
  console.log("Fetching guests from collection:", COLLECTION_NAME)
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("created_at", "desc"))
    const querySnapshot = await getDocs(q)
    
    console.log(`Found ${querySnapshot.size} guests`)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      // Convert Firestore Timestamp to ISO string
      let createdAt = new Date().toISOString()
      
      if (data.created_at instanceof Timestamp) {
        createdAt = data.created_at.toDate().toISOString()
      } else if (data.created_at?.toDate) {
        createdAt = data.created_at.toDate().toISOString()
      }

      return {
        id: doc.id,
        ...data,
        created_at: createdAt
      }
    }) as Guest[]
  } catch (error) {
    console.error("Error fetching guests from Firebase:", error)
    throw error // Throw to be caught by the caller
  }
}

export async function createGuest(data: Omit<Guest, "id" | "created_at">) {
  console.log("Creating guest in collection:", COLLECTION_NAME, data)
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      created_at: serverTimestamp(),
    })
    
    console.log("Guest created successfully with ID:", docRef.id)
    revalidatePath("/resepsionis/buku-tamu")
    return { id: docRef.id, ...data } as Guest
  } catch (error) {
    console.error("Error creating guest in Firebase:", error)
    throw new Error("Gagal menambahkan tamu")
  }
}

export async function updateGuest(id: string, data: Partial<Omit<Guest, "id" | "created_at">>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, data)
    
    revalidatePath("/resepsionis/buku-tamu")
    return { id, ...data } as Guest
  } catch (error) {
    console.error("Error updating guest in Firebase:", error)
    throw new Error("Gagal memperbarui data tamu")
  }
}

export async function deleteGuest(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
    
    revalidatePath("/resepsionis/buku-tamu")
  } catch (error) {
    console.error("Error deleting guest from Firebase:", error)
    throw new Error("Gagal menghapus tamu")
  }
}
