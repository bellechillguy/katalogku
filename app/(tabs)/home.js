import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandHeader } from '../../src/components/HeaderBar';
import SearchToolbar from '../../src/components/SearchToolbar';
import { GlassChip } from '../../src/components/GlassButton';
import ProductCard from '../../src/components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../../src/data/products';
import { colors, fonts, layout } from '../../src/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
  }, [query, category]);

  return (
    <View style={styles.screen}>
      <View style={styles.header} pointerEvents="none">
        <BrandHeader />
      </View>

      <View style={styles.toolbar}>
        <SearchToolbar value={query} onChangeText={setQuery} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.chipScroll}
          contentContainerStyle={styles.chips}
        >
          {CATEGORIES.map((c) => (
            <GlassChip
              key={c}
              label={c}
              selected={c === category}
              onPress={() => setCategory(c)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        ItemSeparatorComponent={RowSeparator}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: insets.bottom + layout.navBottomOffset + 62 + 24 },
        ]}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            context="grid"
            onPress={() => router.push(`/product/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.empty}>No products found</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setQuery('');
                setCategory('All');
              }}
              style={styles.resetFilters}
            >
              <Text style={styles.resetFiltersLabel}>Clear search and filters</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const RowSeparator = () => <View style={{ height: 16 }} />;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  toolbar: {
    paddingTop: 142, // search field sits 10px below the 132px header (y = 142)
  },
  chipScroll: {
    flexGrow: 0,
    marginTop: 14, // chips start at y = 204
    height: 35,
  },
  chips: {
    paddingHorizontal: 35,
    gap: 10,
    alignItems: 'flex-start',
  },
  grid: {
    paddingHorizontal: layout.gridPadding,
    paddingTop: 33,
  },
  column: {
    gap: 20,
  },
  empty: {
    marginTop: 32,
    textAlign: 'center',
    fontFamily: fonts.openSans,
    fontSize: 14,
    color: colors.labelSecondary,
  },
  emptyState: {
    alignItems: 'center',
  },
  resetFilters: {
    marginTop: 8,
    minHeight: 44,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  resetFiltersLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 13,
    color: colors.black,
    textDecorationLine: 'underline',
  },
});
