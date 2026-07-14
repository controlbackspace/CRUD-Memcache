import React, { useState } from 'react';
import HomeScreen from './src/features/persons/screens/HomeScreen';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/context/AuthContext'; // Match this path to your AuthContext file location
import LoginScreen from './src/features/auth/screens/LoginScreen';
import RegisterScreen from './src/features/auth/screens/RegisterScreen';
import { useAuth } from './src/features/auth/hooks/useAuth';

function NavigationRouter() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('login');

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Dashboard routing guard rule loop
  if (user) {
  return <HomeScreen />;
    }

  return currentScreen === 'login' ? (
    <LoginScreen onNavigateToRegister={() => setCurrentScreen('register')} />
  ) : (
    <RegisterScreen onNavigateToLogin={() => setCurrentScreen('login')} />
  );
}

function AppContent() {
// ^^^ FIX: Created inner component boundary layer
  return (
    <SafeAreaView style={styles.root}>
{/* // ^^^ EXISTING: Native visual layout container boundary */}
      <NavigationRouter />
{/* // ^^^ FIX: Safely mounted deep inside the structural context provider tree */}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
{/* // ^^^ EXISTING: Mobile device viewport scaling wrapper */}
      <AuthProvider>
{/* // ^^^ EXISTING: Root global context state management provider */}
        <AppContent />
{/* // ^^^ FIX: Renders child tree after the provider instance exists in memory */}
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f5f7' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }
});