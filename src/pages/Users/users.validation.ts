import { fields } from '@components';
import * as Yup from 'yup';

export interface UserFormData {
  username: string;
  password: string;
}

export const userSchema = Yup.object({
  username: fields.text.required('Kullanıcı adı zorunludur').label('Kullanıcı Adı').min(3, 'Kullanıcı adı en az 3 karakter olmalıdır'),
  password: fields.password.required('Şifre zorunludur').label('Şifre').min(6, 'Şifre en az 6 karakter olmalıdır'),
});
