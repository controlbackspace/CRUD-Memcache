import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import RegisterForm from '../components/RegisterForm';

export default function RegisterScreen({ onNavigateToLogin }) {
  const handleRegisterSubmit = (registrationData) => {
    // This will route to your useAuth custom hook for registration later
    console.log('Register Screen captured form submission payload:', registrationData);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.screenContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerLayout}>
          
          {/* ─── PASSING THE PROPERTY DOWN THE HIGHWAY ─── */}
          <RegisterForm 
            onRegisterSubmit={handleRegisterSubmit}
            onNavigateToLogin={onNavigateToLogin} // <-- FORWARDS TRIGGER TO MOLECULE
            isLoading={false}
            serverError={null}
          />
          
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  innerLayout: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});