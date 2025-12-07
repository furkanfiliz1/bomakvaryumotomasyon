# Firebase Firestore Integration

Proje Firebase Firestore veritabanı ile entegre edilmiştir. Sadece veritabanı işlemleri için kullanılmaktadır.

## Kurulum

### 1. Firebase Credentials Ekle

`.env` dosyası oluşturun (`.env.example` kullanarak):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
```

### 2. Firebase Console'dan Credentials Al

1. [Firebase Console](https://console.firebase.google.com/) git
2. Projenizi seçin
3. Proje Ayarları → Uygulamalar → Web
4. Yukarıdaki değerleri kopyalayın

## Kullanım

### FirestoreService ile Doğrudan Kullanım

```typescript
import { FirestoreService } from '@/services/firebaseDb';
import { where } from 'firebase/firestore';

// Tüm dökümanları al
const result = await FirestoreService.getCollection('users');
if (result.success) {
  console.log(result.data);
}

// ID'ye göre al
const doc = await FirestoreService.getDocument('users', 'user_id');

// Yeni döküman ekle
const response = await FirestoreService.addDocument('users', {
  name: 'John',
  email: 'john@example.com'
});

// Dökümanı güncelle
await FirestoreService.updateDocument('users', 'user_id', {
  name: 'Jane'
});

// Dökümanı sil
await FirestoreService.deleteDocument('users', 'user_id');

// Şarta göre sorgula
const query = await FirestoreService.queryCollection('users', [
  where('age', '>', 18)
]);
```

### React Hook ile Kullanım

```typescript
import { useFirestore } from '@/hooks/useFirestore';

export function UsersList() {
  const { loading, error, getAll, add, update, remove } = useFirestore('users');

  const loadUsers = async () => {
    const result = await getAll();
    console.log(result.data);
  };

  const addUser = async () => {
    await add({
      name: 'John',
      email: 'john@example.com'
    });
  };

  const updateUser = async () => {
    await update('user_id', { name: 'Jane' });
  };

  const deleteUser = async () => {
    await remove('user_id');
  };

  return (
    <div>
      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <button onClick={loadUsers}>Kullanıcıları Yükle</button>
      <button onClick={addUser}>Kullanıcı Ekle</button>
      <button onClick={updateUser}>Güncelle</button>
      <button onClick={deleteUser}>Sil</button>
    </div>
  );
}
```

## API Reference

### FirestoreService

#### `getCollection<T>(collectionName: string)`
Koleksiyondaki tüm dökümanları getirir.

#### `getDocument<T>(collectionName: string, documentId: string)`
Belirli bir dökümanı ID ile getirir.

#### `queryCollection<T>(collectionName: string, constraints: QueryConstraint[])`
Koşul ile dökümanları sorgular.

Örnek:
```typescript
import { where, orderBy } from 'firebase/firestore';

await FirestoreService.queryCollection('users', [
  where('active', '==', true),
  orderBy('createdAt', 'desc')
]);
```

#### `addDocument<T>(collectionName: string, data: T)`
Yeni döküman ekler (otomatik ID).

#### `setDocument<T>(collectionName: string, documentId: string, data: T, merge?: boolean)`
Döküman oluşturur veya tamamen yazar. `merge: true` ise kısmi günceller.

#### `updateDocument<T>(collectionName: string, documentId: string, data: T)`
Dökümanı kısmi günceller.

#### `deleteDocument(collectionName: string, documentId: string)`
Dökümanı siler.

## Özel Notlar

- Tüm yazma işlemlerine otomatik `createdAt` ve `updatedAt` alanları eklenir
- Sorgular için `firebase/firestore` dan `where`, `orderBy`, vb. kullanabilirsiniz
- Hata mesajları Türkçeleştirilmiş olarak döner

## Firestore Yapısı Önerisi

```
users/
  └── user_id/
      ├── name: string
      ├── email: string
      ├── createdAt: timestamp
      └── updatedAt: timestamp

products/
  └── product_id/
      ├── title: string
      ├── price: number
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

## Troubleshooting

**"permission-denied" hatası alıyorum**
- Firestore Security Rules'u kontrol edin
- Firebase Console → Firestore → Rules

**Veri kaydedilmiyor**
- `.env` dosyasında doğru credentials'ı kontrol edin
- Tarayıcı konsolunda hataları kontrol edin
