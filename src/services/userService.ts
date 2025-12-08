import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { User, CreateUserInput } from '../types/user';

const COLLECTION_NAME = 'users';

export const userService = {
  // Kullanıcı Ekleme
  async addUser(userData: CreateUserInput): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...userData,
      role: 'admin',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Kullanıcı Güncelleme
  async updateUser(id: string, data: Partial<CreateUserInput>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  // Kullanıcı Silme
  async deleteUser(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Tüm Kullanıcıları Getirme
  async getAllUsers(): Promise<User[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('username'));
    const querySnapshot = await getDocs(q);

    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        username: data.username,
        password: data.password,
        role: data.role,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });

    return users;
  },

  // Kullanıcı adı ve şifre ile giriş kontrolü
  async validateUser(username: string, password: string): Promise<User | null> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('username', '==', username),
      where('password', '==', password)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      username: data.username,
      password: data.password,
      role: data.role,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },
};
