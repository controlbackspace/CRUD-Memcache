import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen({ onNavigateToRegister }) {
  const { login, isLoading, error } = useAuth();

  const handleLoginSubmit = async (username, password) => {
    const success = await login(username, password);
    if (success) alert('Logged in successfully!');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.inner}>
        {/* Pass the function right down to the molecule */}
        <LoginForm 
          onSubmit={handleLoginSubmit} 
          isLoading={isLoading} 
          serverError={error} 
          onNavigateToRegister={onNavigateToRegister} 
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', padding: 20 }
});