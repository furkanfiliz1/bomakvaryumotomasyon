# Firebase Realtime Database Rules Kontrol Listesi

## Veri Çekememe / Ekleyememe Sorunları

Eğer liste çekemiyorsanız veya ekleyemiyorsanız aşağıdaki adımları izleyin:

### 1. Firebase Console'da Rules Kontrol Edin

1. **Firebase Console** → https://console.firebase.google.com/
2. Projenizi seçin
3. **Realtime Database** → **Rules** sekmesine gidin

### 2. Mevcut Rules Kontrol Et

Şu an hangi rules'u kullanıyorsunuz? Görebilmek için:

```json
// BAD - Hiç kimse okuyup yazamıyor (DEFAULT)
{
  "rules": {
    ".read": false,
    ".write": false
  }
}

// GOOD - Oturum açmış kullanıcılar okuyup yazabilir
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}

// TEST - Geçici olarak herkes okuyup yazabilir (SADECE DEV İÇİN!)
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### 3. Rules Yayınla

Rules değiştirdikten sonra **PUBLISH** butonuna tıklayın.

### 4. Tarayıcı Konsolunda Hatayı Kontrol Et

1. **Chrome DevTools** açın (F12)
2. **Console** sekmesine gidin
3. Veri çekmeye/eklemeye çalışın
4. Hata mesajını kopyalayın

**Tipik Hatalar:**
- `permission-denied` → Rules'u kontrol et
- `PERMISSION_DENIED` → Rules'u kontrol et
- Boş veri → Database'de veri yok

### 5. Kimlik Doğrulamayı Kontrol Et

Kullanıcı gerçekten oturum açmış mı?

```typescript
// src/store/slices/auth.ts içinde
console.log('Şu an login olan kullanıcı:', state.user);
console.log('Token:', state.token);
```

### 6. Database URL Kontrol Et

`.env` dosyasında doğru Database URL'i var mı?

```env
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

### 7. Network Tab'inde Kontrol Et

DevTools → Network → XHR sekmesinde Firebase çağrılarını kontrol edin.

---

## Hızlı Çözüm - Koleksiyon Yükleme Hatası

Eğer herhangi bir koleksiyon yüklenirken "hata oluştu" mesajı alıyorsanız, büyük ihtimalle Firebase Rules izni sorunu vardır. **Firebase Console → Realtime Database → Rules** kısmında şu kodu yapıştırın:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### Adımlar:
1. [Firebase Console](https://console.firebase.google.com/) açın
2. Projenizi seçin
3. **Realtime Database** → **Rules** sekmesi
4. Yukarıdaki JSON kodu yapıştırın
5. **PUBLISH** butonuna tıklayın
6. Uygulamayı yenileyin (F5)
7. Veri yüklenmeye başlayacak

**NOT:** Bu rules **tüm verilere** oturum açmış kullanıcıların okuma ve yazma izni verir. Production'da daha spesifik güvenlik kuralları yazmalısınız.

---

## ÖNEMLİ: Firebase Realtime Database Oluşturma

Yukarıdaki rules'u kullanmak için **önce Realtime Database'i oluşturmanız gerekir!**

### Realtime Database Nasıl Oluşturulur:

1. [Firebase Console](https://console.firebase.google.com/) açın
2. Projenizi seçin
3. Sol menüde **Realtime Database**'i bulun
4. **Veritabanı Oluştur** butonuna tıklayın
5. **Test Modunda Başlat** seçin (ilk başta test mode'da başlatabilirsiniz)
6. Bölgeyi seçin (Türkiye ise `europe-west1`)
7. **Oluştur** butonuna tıklayın

### Sonra Rules'u Güncelleyin:

Database oluşturduktan sonra:

1. **Realtime Database** → **Rules** sekmesine gidin
2. Yukarıdaki "Hızlı Çözüm" kısmındaki JSON kodu yapıştırın
3. **PUBLISH** edin

### .env Dosyasını Güncelle:

Database URL'i `.env` dosyanıza ekleyin:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

---

## Sorun Çözemezseniz

1. Tarayıcı konsolundan **tam hata mesajını** kopyalayın
2. `npm run start-test` çalıştırırken hangi collection'ı test etmeye çalıştığınızı yazın
3. Firestore Database'i oluşturduğunuzu kontrol edin
4. Bu bilgileri paylaşın
