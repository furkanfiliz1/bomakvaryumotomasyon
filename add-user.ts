import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

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
    // Check if user already exists
    const q = query(collection(db, 'users'), where('userName', '==', 'furkan'));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('Kullanıcı zaten var');
      process.exit(0);
    }

    // Add new user
    const docRef = await addDoc(collection(db, 'users'), {
      userName: 'furkan',
      password: '123456',
      email: 'furkan@example.com',
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
