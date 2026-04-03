import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';

export default function StoresTab({
  theme,
  stores,
  selectedItems,
  selectedStore,
  onStoreSelect,
  allItems,
}) {
  const selectedItemsList = useMemo(
    () => allItems.filter((item) => selectedItems.includes(item.id)),
    [selectedItems, allItems]
  );

  if (selectedItems.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ fontSize: 32, marginBottom: 12 }}>🛒</Text>
        <Text style={{ color: theme.text, fontWeight: '600', fontSize: 14 }}>
          No items selected
        </Text>
        <Text
          style={{
            color: theme.textSecondary,
            fontSize: 12,
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          Add items from the list tab to see price comparisons
        </Text>
      </View>
    );
  }

  const calculateStoreTotals = (store) => {
    let total = 0;
    selectedItemsList.forEach((item) => {
      total += store.prices[item.id] || 0;
    });
    return total;
  };

  const storeTotals = stores.map((store) => ({
    ...store,
    total: calculateStoreTotals(store),
  }));

  const sortedStores = [...storeTotals].sort((a, b) => a.total - b.total);
  const cheapestTotal = sortedStores[0].total;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
    >
      {/* Cheapest Store Alert */}
      {sortedStores[0] && (
        <View
          style={{
            backgroundColor: theme.success,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
              fontSize: 12,
              textTransform: 'uppercase',
            }}
          >
            💰 Best Deal
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '700',
              marginTop: 4,
            }}
          >
            {sortedStores[0].name}
          </Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 13,
              marginTop: 4,
            }}
          >
            Total: ₱{cheapestTotal.toFixed(2)}
          </Text>
        </View>
      )}

      {/* Store Comparison */}
      {sortedStores.map((store, index) => {
        const savingsPercent = (
          ((store.total - cheapestTotal) / cheapestTotal) *
          100
        ).toFixed(0);
        const savings = store.total - cheapestTotal;

        return (
          <TouchableOpacity
            key={store.id}
            onPress={() => onStoreSelect(store)}
            style={{
              backgroundColor:
                selectedStore?.id === store.id ? theme.accent : theme.surface,
              borderColor: theme.border,
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            {/* Store Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color:
                      selectedStore?.id === store.id
                        ? 'white'
                        : theme.text,
                    fontWeight: '700',
                    fontSize: 14,
                  }}
                >
                  {index + 1}. {store.name}
                </Text>
                <Text
                  style={{
                    color:
                      selectedStore?.id === store.id
                        ? 'rgba(255,255,255,0.8)'
                        : theme.textSecondary,
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  {store.distance.toFixed(1)} km • Index: {store.priceIndex}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    color:
                      selectedStore?.id === store.id
                        ? 'white'
                        : theme.text,
                    fontWeight: '700',
                    fontSize: 16,
                  }}
                >
                  ₱{store.total.toFixed(2)}
                </Text>
                {savings > 0 && (
                  <Text
                    style={{
                      color: theme.error,
                      fontSize: 11,
                      fontWeight: '600',
                      marginTop: 2,
                    }}
                  >
                    +₱{savings.toFixed(2)} ({savingsPercent}%)
                  </Text>
                )}
              </View>
            </View>

            {/* Items Breakdown */}
            <View
              style={{
                borderTopColor:
                  selectedStore?.id === store.id
                    ? 'rgba(255,255,255,0.2)'
                    : theme.border,
                borderTopWidth: 1,
                paddingTop: 10,
              }}
            >
              {selectedItemsList.map((item) => {
                const price = store.prices[item.id] || 0;
                const lowestPrice = Math.min(
                  ...stores.map((s) => s.prices[item.id] || 0)
                );
                const isCheapest = price === lowestPrice;

                return (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 6,
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        color:
                          selectedStore?.id === store.id
                            ? 'rgba(255,255,255,0.8)'
                            : theme.textSecondary,
                        fontSize: 12,
                      }}
                    >
                      {item.name.length > 20
                        ? item.name.substring(0, 20) + '...'
                        : item.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      {isCheapest && (
                        <Text
                          style={{
                            color: theme.success,
                            fontWeight: '600',
                            fontSize: 11,
                          }}
                        >
                          ✓
                        </Text>
                      )}
                      <Text
                        style={{
                          color: isCheapest
                            ? selectedStore?.id === store.id
                              ? 'white'
                              : theme.success
                            : selectedStore?.id === store.id
                            ? 'white'
                            : theme.text,
                          fontWeight: isCheapest ? '700' : '500',
                          fontSize: 12,
                          minWidth: 40,
                          textAlign: 'right',
                        }}
                      >
                        ₱{price}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}