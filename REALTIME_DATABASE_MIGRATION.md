# Firebase Realtime Database Geçiş Özeti

## Ne Değişti?

Proje **Firestore Database**'den **Firebase Realtime Database**'e geçirildi.

### Nedenler:
- ✅ Realtime Database **ücretsiz** ve sınırsız
- ✅ Geliştirme aşamasında mükemmel
- ✅ Daha basit kurulum

---

## Değişen Dosyalar

### 1. `src/config/firebase.ts`
- ❌ Firestore (`getFirestore`)
- ✅ Realtime Database (`getDatabase`)

### 2. `src/services/firebaseDb.ts`
- ❌ Firestore API imports (`getDocs`, `addDoc`, `deleteDoc`, vb)
- ✅ Realtime Database API imports (`get`, `set`, `push`, `remove`, vb)

### 3. `src/pages/Dashboard/DashboardPage.tsx`
- ❌ Firestore imports (`collection`, `getDocs`, `addDoc`, `deleteDoc`)
- ✅ Realtime Database imports (`ref`, `get`, `set`, `push`, `remove`)

### 4. `.env.example`
- ❌ `VITE_FIREBASE_STORAGE_BUCKET`
- ✅ `VITE_FIREBASE_DATABASE_URL`

---

## Kurulum Adımları

### 1. Firebase Console'da Realtime Database Oluşturun

1. https://console.firebase.google.com/ açın
2. Projenizi seçin
3. **Realtime Database** → **Veritabanı Oluştur**
4. Test Modunda başlatın
5. `europe-west1` bölgesini seçin

### 2. Database URL'i Alın

Database oluştuktan sonra:
1. **Realtime Database** → **Rules** sekmesine gidin
2. En üstte veritabanı URL'ini göreceksiniz:
   ```
   https://your_project.firebaseio.com
   ```

### 3. `.env` Dosyasını Güncelleyin

```env
VITE_FIREBASE_API_KEY=AIzaSyAC...
VITE_FIREBASE_AUTH_DOMAIN=bomakvaryum.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bomakvaryum-d98d2
VITE_FIREBASE_DATABASE_URL=https://bomakvaryum-d98d2.firebaseio.com
```

### 4. Rules'u Güncelleyin

**Firebase Console** → **Realtime Database** → **Rules** sekmesinde:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

**PUBLISH** butonuna tıklayın.

### 5. Uygulamayı Yenileyin

```bash
npm run dev
```

veya

```bash
npm run start-test
```

---

## API Farklılıkları

### Firestore vs Realtime Database

#### Tüm dökümanları alma

```typescript
// Firestore
const querySnapshot = await getDocs(collection(firestore, 'fishes'));
querySnapshot.docs.map(doc => ({...}))

// Realtime Database
const dbRef = ref(database, 'fishes');
const snapshot = await get(dbRef);
snapshot.val() // object döner
```

#### Yeni döküman ekleme

```typescript
// Firestore
await addDoc(collection(firestore, 'fishes'), data)

// Realtime Database
const dbRef = ref(database, 'fishes');
const newRef = push(dbRef);
await set(newRef, data)
```

#### Dökümanı silme

```typescript
// Firestore
await deleteDoc(doc(firestore, 'fishes', id))

// Realtime Database
const dbRef = ref(database, `fishes/${id}`);
await remove(dbRef)
```

---

## Sorun Giderme

### "Permission Denied" hatası
→ Firebase Console → Realtime Database → Rules kontrol edin

### Veri görüntülenmiyor
→ Oturum açtığınızı doğrulayın
→ Database URL'sini `.env` dosyasında kontrol edin

### "Cannot find name 'ref'" hatası
→ `firebase/database` importlarını kontrol edin

---

## Daha Fazla Bilgi

- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- `FIREBASE_RULES_DEBUGGING.md` dosyasına bakın

