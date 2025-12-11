import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const clearCollection = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises = querySnapshot.docs.map((document) =>
      deleteDoc(doc(db, collectionName, document.id))
    );
    await Promise.all(deletePromises);
    return { success: true, count: querySnapshot.docs.length };
  } catch (error) {
    console.error(`${collectionName} temizlenirken hata:`, error);
    return { success: false, error };
  }
};
