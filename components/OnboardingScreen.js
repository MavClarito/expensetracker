import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './constants/ThemeContext';
import { useUser } from './constants/UserContext';

const { width } = Dimensions.get('window');

const OnboardingStep1 = ({ theme, permissions, onPermissionsChange }) => {
  const handleLocationPress = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    onPermissionsChange({ ...permissions, location: granted });
  };

  const handleNotificationPress = async () => {
    const { granted } = await Notifications.requestPermissionsAsync();
    onPermissionsChange({ ...permissions, notifications: granted });
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: theme.text,
          marginBottom: 8,
        }}
      >
        Permissions
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.textSecondary,
          marginBottom: 32,
        }}
      >
        We need a few permissions to find nearby stores
      </Text>

      <View style={{ marginBottom: 24 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomColor: theme.border,
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              flex: 1,
              color: theme.text,
              fontSize: 14,
              fontWeight: '500',
            }}
          >
            📍 Location / GPS
          </Text>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: permissions.location ? theme.success : theme.error,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 14 }}>
              {permissions.location ? '✓' : '✗'}
            </Text>
          </View>
        </View>

        {!permissions.location && (
          <TouchableOpacity
            onPress={handleLocationPress}
            style={{
              marginTop: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: theme.accent,
              borderRadius: 6,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
              Grant Permission
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomColor: theme.border,
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              flex: 1,
              color: theme.text,
              fontSize: 14,
              fontWeight: '500',
            }}
          >
            🔔 Notifications
          </Text>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: permissions.notifications ? theme.success : theme.error,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 14 }}>
              {permissions.notifications ? '✓' : '✗'}
            </Text>
          </View>
        </View>

        {!permissions.notifications && (
          <TouchableOpacity
            onPress={handleNotificationPress}
            style={{
              marginTop: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: theme.accent,
              borderRadius: 6,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
              Grant Permission
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const OnboardingStep2 = ({ theme, isDark, onThemeChange }) => {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: theme.text,
          marginBottom: 8,
        }}
      >
        Theme Preference
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.textSecondary,
          marginBottom: 32,
        }}
      >
        Choose how you'd like the app to look
      </Text>

      <View
        style={{
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => onThemeChange(false)}
          style={{
            flex: 1,
            paddingVertical: 16,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: !isDark ? theme.accent : theme.surface,
            borderColor: !isDark ? theme.accent : theme.border,
            borderWidth: 2,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 32, marginBottom: 8 }}>☀️</Text>
          <Text
            style={{
              color: !isDark ? 'white' : theme.text,
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            Light Mode
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onThemeChange(true)}
          style={{
            flex: 1,
            paddingVertical: 16,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: isDark ? theme.accent : theme.surface,
            borderColor: isDark ? theme.accent : theme.border,
            borderWidth: 2,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 32, marginBottom: 8 }}>🌙</Text>
          <Text
            style={{
              color: isDark ? 'white' : theme.text,
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            Dark Mode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const OnboardingStep3 = ({ theme, displayName, onDisplayNameChange }) => {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: theme.text,
          marginBottom: 8,
        }}
      >
        Display Name
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.textSecondary,
          marginBottom: 32,
        }}
      >
        How would you like to appear to others?
      </Text>

      <TextInput
        placeholder="Enter your name or leave blank for Anonymous"
        placeholderTextColor={theme.textSecondary}
        value={displayName}
        onChangeText={onDisplayNameChange}
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

      <TouchableOpacity
        onPress={() => onDisplayNameChange('')}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 12,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontWeight: '500',
            fontSize: 14,
          }}
        >
          🕵️ Stay Anonymous
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const OnboardingStep4 = ({ theme }) => {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: theme.text,
          marginBottom: 8,
        }}
      >
        Map & Stores
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.textSecondary,
          marginBottom: 32,
        }}
      >
        We'll show you nearby grocery stores and their prices
      </Text>

      <View
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 32, textAlign: 'center' }}>🗺️</Text>
        <Text
          style={{
            color: theme.text,
            fontWeight: '500',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          Real-time Price Comparison
        </Text>
        <Text
          style={{
            color: theme.textSecondary,
            fontSize: 12,
            textAlign: 'center',
          }}
        >
          Your location helps us find the cheapest options. Community prices keep data updated.
        </Text>
      </View>
    </View>
  );
};

const OnboardingStep5 = ({ theme, permissions, displayName }) => {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: theme.text,
          marginBottom: 8,
        }}
      >
        All Set!
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.textSecondary,
          marginBottom: 24,
        }}
      >
        Here's what we've configured
      </Text>

      <View
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
          borderRadius: 8,
          padding: 16,
          gap: 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: theme.text, fontWeight: '500' }}>
            📍 Location
          </Text>
          <Text
            style={{
              color: permissions.location ? theme.success : theme.error,
              fontWeight: '600',
            }}
          >
            {permissions.location ? '✓' : '✗'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: theme.text, fontWeight: '500' }}>
            🔔 Notifications
          </Text>
          <Text
            style={{
              color: permissions.notifications ? theme.success : theme.error,
              fontWeight: '600',
            }}
          >
            {permissions.notifications ? '✓' : '✗'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: theme.text, fontWeight: '500' }}>
            👤 Display Name
          </Text>
          <Text style={{ color: theme.accent, fontWeight: '600' }}>
            {displayName || 'Anonymous'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function OnboardingScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { updatePermissions, updateDisplayName } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef(null);
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
  });
  const [displayName, setDisplayName] = useState('');

  const steps = [
    <OnboardingStep1
      key="1"
      theme={theme}
      permissions={permissions}
      onPermissionsChange={setPermissions}
    />,
    <OnboardingStep2
      key="2"
      theme={theme}
      isDark={isDark}
      onThemeChange={(dark) => {
        if (dark !== isDark) toggleTheme();
      }}
    />,
    <OnboardingStep3
      key="3"
      theme={theme}
      displayName={displayName}
      onDisplayNameChange={setDisplayName}
    />,
    <OnboardingStep4 key="4" theme={theme} />,
    <OnboardingStep5
      key="5"
      theme={theme}
      permissions={permissions}
      displayName={displayName}
    />,
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    } else {
      // Complete onboarding
      try {
        await updatePermissions(permissions);
        await updateDisplayName(displayName || 'Anonymous');
        await AsyncStorage.setItem('onboarding_complete', 'true');
        navigation.replace('Home');
      } catch (e) {
        Alert.alert('Error', 'Failed to complete setup');
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 8,
        }}
      >
        <Text
          style={{
            color: theme.textSecondary,
            fontSize: 12,
            fontWeight: '500',
          }}
        >
          Step {currentStep + 1} of {steps.length}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
          }}
        >
          {steps.map((_, i) => (
            <View
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i <= currentStep ? theme.accent : theme.border,
              }}
            />
          ))}
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        scrollEnabled={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        {steps[currentStep]}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentStep === 0}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: 'center',
            opacity: currentStep === 0 ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              color: theme.text,
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={{
            flex: 1,
            paddingVertical: 12,
            backgroundColor: theme.accent,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}