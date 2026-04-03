import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

export default function MapTab({
  theme,
  userLocation,
  stores,
  onStoreSelect,
  selectedStore,
}) {
  const [mapLoading, setMapLoading] = useState(true);

  if (!userLocation) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
          📍 Location not available
        </Text>
        <Text
          style={{
            color: theme.textSecondary,
            fontSize: 12,
            marginTop: 8,
          }}
        >
          Please enable location permissions
        </Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: userLocation?.latitude || 14.5994,
    longitude: userLocation?.longitude || 120.9842,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        onMapLoaded={() => setMapLoading(false)}
      >
        {/* User Location */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
        )}

        {/* Store Markers */}
        {stores.map((store) => (
          <Marker
            key={store.id}
            coordinate={{
              latitude: store.latitude,
              longitude: store.longitude,
            }}
            title={store.name}
            pinColor={
              selectedStore?.id === store.id
                ? theme.accent
                : theme.success
            }
            onPress={() => onStoreSelect(store)}
          >
            <Callout>
              <View
                style={{
                  backgroundColor: theme.surface,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 6,
                  width: 180,
                }}
              >
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: '600',
                    fontSize: 12,
                  }}
                >
                  {store.name}
                </Text>
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  Distance: {store.distance.toFixed(1)} km
                </Text>
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  Price Index: {store.priceIndex}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {mapLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      )}

      {/* Store List Bottom Sheet */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          maxHeight: 200,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingVertical: 8,
            gap: 8,
          }}
        >
          {stores.map((store) => (
            <TouchableOpacity
              key={store.id}
              onPress={() => onStoreSelect(store)}
              style={{
                backgroundColor:
                  selectedStore?.id === store.id
                    ? theme.accent
                    : theme.surface,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                minWidth: 140,
              }}
            >
              <Text
                style={{
                  color:
                    selectedStore?.id === store.id
                      ? 'white'
                      : theme.text,
                  fontWeight: '600',
                  fontSize: 12,
                }}
              >
                {store.name}
              </Text>
              <Text
                style={{
                  color:
                    selectedStore?.id === store.id
                      ? 'rgba(255,255,255,0.8)'
                      : theme.textSecondary,
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                {store.distance.toFixed(1)} km away
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}