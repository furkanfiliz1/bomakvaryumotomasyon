import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAC8MCfS7FXcm4f7DzyP6EtGi7j1ztbxqU',
  authDomain: 'bomakvaryum-d98d2.firebaseapp.com',
  projectId: 'bomakvaryum-d98d2',
  storageBucket: 'bomakvaryum-d98d2.firebasestorage.app',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTestUser() {
  try {
    // Check if user already exists with new field name
    let q = query(collection(db, 'users'), where('username', '==', 'furkan'));
    let querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Check old field name
      q = query(collection(db, 'users'), where('userName', '==', 'furkan'));
      querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update old user to new format
        const docId = querySnapshot.docs[0].id;
        const userRef = doc(db, 'users', docId);
        await updateDoc(userRef, {
          username: 'furkan',
          password: '123456',
          role: 'admin',
          updatedAt: new Date(),
        });
        console.log('Kullanıcı güncellendi (userName -> username):', docId);
        process.exit(0);
      }
    } else {
      console.log('Kullanıcı zaten var (güncel formatta)');
      process.exit(0);
    }

    // Add new user
    const docRef = await addDoc(collection(db, 'users'), {
      username: 'furkan',
      password: '123456',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Kullanıcı başarıyla eklendi:', docRef.id);
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

addTestUser();
