import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// 1. Destructure the onPress reference coming from the parent form
export default function CustomButton({ title, onPress }) {
  return (
    // 2. Map it directly into the native touch configuration layout
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  text: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});