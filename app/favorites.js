import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '../src/components/HeaderBar';
import ProductCard from '../src/components/ProductCard';
import BottomNavigation from '../src/components/BottomNavigation';
import { useFavorites } from '../src/context/FavoritesContext';
import { PRODUCTS } from '../src/data/products';
import { colors, fonts, layout } from '../src/theme/tokens';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ids, toggle, ready } = useFavorites();
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const products = PRODUCTS.filter((p) => ids.includes(p.id));

  const confirmRemoval = () => {
    if (!pendingRemoval) return;
    toggle(pendingRemoval.id);
    setPendingRemoval(null);
  };

  return (
    <View style={styles.screen}>
      <BackHeader title="Favorite" onBack={() => router.back()} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        ItemSeparatorComponent={RowSeparator}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: insets.bottom + layout.navBottomOffset + 62 + 24 },
        ]}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            context="favorites"
            onPress={() => router.push(`/product/${item.id}`)}
            onRemove={() => setPendingRemoval(item)}
          />
        )}
        ListEmptyComponent={ready ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="heart-outline"
              size={42}
              color={colors.labelSecondary}
              accessibilityElementsHidden
            />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyMessage}>
              Save products you like to find them here.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.navigate('/home')}
              style={({ pressed }) => [styles.browseButton, pressed && styles.browseButtonPressed]}
            >
              <Text style={styles.browseButtonLabel}>Browse products</Text>
            </Pressable>
          </View>
        ) : null}
      />
      <BottomNavigation />

      <Modal
        visible={!!pendingRemoval}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setPendingRemoval(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialog} accessibilityViewIsModal>
            <Text style={styles.dialogTitle}>Remove from favorites?</Text>
            <Text style={styles.dialogMessage}>
              {pendingRemoval
                ? `Remove ${pendingRemoval.name} from your favorites?`
                : ''}
            </Text>
            <View style={styles.dialogActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setPendingRemoval(null)}
                style={[styles.dialogButton, styles.cancelButton]}
              >
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Confirm remove from favorites"
                onPress={confirmRemoval}
                style={[styles.dialogButton, styles.removeConfirmButton]}
              >
                <Text style={styles.removeConfirmLabel}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const RowSeparator = () => <View style={{ height: 16 }} />;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  grid: {
    paddingHorizontal: 32,
    paddingTop: 18,
  },
  column: {
    gap: 20,
  },
  emptyState: {
    minHeight: 380,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyTitle: {
    marginTop: 16,
    fontFamily: fonts.montserratSemiBold,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    color: colors.black,
  },
  emptyMessage: {
    marginTop: 8,
    fontFamily: fonts.openSans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colors.labelSecondary,
  },
  browseButton: {
    minHeight: 44,
    marginTop: 20,
    paddingHorizontal: 18,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  browseButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  browseButtonLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 14,
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    padding: 22,
    borderRadius: 20,
    backgroundColor: colors.white,
    boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
  },
  dialogTitle: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 18,
    lineHeight: 24,
    color: colors.black,
  },
  dialogMessage: {
    marginTop: 8,
    fontFamily: fonts.openSans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.labelControlsPrimary,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 22,
  },
  dialogButton: {
    minWidth: 88,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.fillVibrantTertiary,
  },
  cancelLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 13,
    color: colors.black,
  },
  removeConfirmButton: {
    backgroundColor: colors.red,
  },
  removeConfirmLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 13,
    color: colors.black,
  },
});
