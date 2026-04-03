import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './context/ThemeContext';
import { useUser } from './context/UserContext';
import { GROCERY_ITEMS, MOCK_STORES } from '../utils/Mockdata';
import GroceryListTab from '/GroceryListTab';
import MapTab from '/MapTab';
import StoresTab from 'StoresTab';
import PriceContributionTab from 'PriceContributionTab';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { displayName, logout } = useUser();
  const [activeTab, setActiveTab] = useState('list');
  const [selectedItems, setSelectedItems] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (e) {
      console.error('Failed to get location:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  };

  const addCustomItem = (itemName) => {
    if (!itemName.trim()) return;
    const newItem = {
      id: 'custom_' + Date.now(),
      name: itemName,
      category: 'Custom',
    };
    setCustomItems([...customItems, newItem]);
    setSelectedItems([...selectedItems, newItem.id]);
  };

  const removeCustomItem = (itemId) => {
    setCustomItems(customItems.filter((i) => i.id !== itemId));
    setSelectedItems(selectedItems.filter((i) => i !== itemId));
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
          navigation.replace('Auth');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomColor: theme.border,
          borderBottomWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text }}>
            GroceryPrice PH
          </Text>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>
            Hello, {displayName}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{ fontSize: 20 }}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: theme.border,
          borderBottomWidth: 1,
          paddingHorizontal: 8,
        }}
      >
        {[
          { id: 'list', label: '🛒 List' },
          { id: 'map', label: '🗺️ Map' },
          { id: 'stores', label: '🏪 Stores' },
          { id: 'contribute', label: '💰 Contribute' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderBottomColor: activeTab === tab.id ? theme.accent : 'transparent',
              borderBottomWidth: 3,
            }}
          >
            <Text
              style={{
                color: activeTab === tab.id ? theme.accent : theme.textSecondary,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'list' && (
          <GroceryListTab
            theme={theme}
            items={GROCERY_ITEMS}
            customItems={customItems}
            selectedItems={selectedItems}
            onToggleSelection={toggleItemSelection}
            onAddCustom={addCustomItem}
            onRemoveCustom={removeCustomItem}
          />
        )}

        {activeTab === 'map' && (
          <MapTab
            theme={theme}
            userLocation={userLocation}
            stores={MOCK_STORES}
            onStoreSelect={setSelectedStore}
            selectedStore={selectedStore}
          />
        )}

        {activeTab === 'stores' && (
          <StoresTab
            theme={theme}
            stores={MOCK_STORES}
            selectedItems={selectedItems}
            selectedStore={selectedStore}
            onStoreSelect={setSelectedStore}
            allItems={[...GROCERY_ITEMS, ...customItems]}
          />
        )}

        {activeTab === 'contribute' && (
          <PriceContributionTab
            theme={theme}
            stores={MOCK_STORES}
            items={[...GROCERY_ITEMS, ...customItems]}
            userLocation={userLocation}
          />
        )}
      </View>
    </SafeAreaView>
  );
}