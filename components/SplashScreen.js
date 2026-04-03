import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from './constants/ThemeContext';

export default function SplashScreen() {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
          color: theme.text,
          marginBottom: 20,
        }}
      >
        GroceryPrice PH
      </Text>
      <ActivityIndicator size="large" color={theme.accent} />
    </View>
  );
}