import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const submit = async () => {
    if (!isValidEmail(email)) return Alert.alert('Email tidak valid');
    try {
      await resetPassword(email);
      Alert.alert('Berhasil', 'Tautan reset password telah dikirim.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error: any) { Alert.alert('Gagal', error?.message ?? 'Tidak dapat mengirim email reset.'); }
  };
  return <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16 }}>
    <Text>Lupa Password</Text>
    <TextInput value={email} onChangeText={setEmail} placeholder="nama@email.com" autoCapitalize="none" keyboardType="email-address" />
    <Button title="Kirim tautan reset" onPress={submit} />
  </View>;
};
export default ForgotPasswordScreen;
