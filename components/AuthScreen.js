import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from './constants/ThemeContext';
import { useUser } from './constants/UserContext';

export default function AuthScreen({ navigation }) {
  const { theme } = useTheme();
  const { login, signup } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = isLogin
      ? await login(email, password)
      : await signup(email, password);
    setLoading(false);

    if (result.success) {
      navigation.replace('Onboarding');
    } else {
      Alert.alert('Error', result.error || 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              color: theme.text,
              marginBottom: 8,
            }}
          >
            GroceryPrice PH
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: theme.textSecondary,
            }}
          >
            Find the cheapest grocery stores near you
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme.text,
              marginBottom: 16,
            }}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              color: theme.text,
              marginBottom: 12,
              fontSize: 14,
            }}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              color: theme.text,
              fontSize: 14,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={handleAuth}
          disabled={loading}
          style={{
            backgroundColor: theme.accent,
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 16,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleMode}
          disabled={loading}
        >
          <Text
            style={{
              color: theme.accent,
              textAlign: 'center',
              fontSize: 14,
              fontWeight: '500',
            }}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}