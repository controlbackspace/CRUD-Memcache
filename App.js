import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import LoginScreen from './src/features/auth/screens/LoginScreen';
import RegisterScreen from './src/features/auth/screens/RegisterScreen';

export default function App() {
  // 1. Establish the single source of truth for screen routing state
  const [currentScreen, setCurrentScreen] = useState('login');

  console.log('App.js render cycle. Current active screen state in memory:', currentScreen);

  return (
    <SafeAreaView style={styles.root}>
      {currentScreen === 'login' ? (
        // 2. Pass state mutation downward to the login wrapper
        <LoginScreen onNavigateToRegister={() => {
          console.log('Firing state transition: login -> register');
          setCurrentScreen('register');
        }} />
      ) : (
        // 3. Pass state mutation downward to the register wrapper
        <RegisterScreen onNavigateToLogin={() => {
          console.log('Firing state transition: register -> login');
          setCurrentScreen('login');
        }} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#f4f5f7' 
  }
});