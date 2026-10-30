import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandHeader } from '../../src/components/HeaderBar';
import SearchToolbar from '../../src/components/SearchToolbar';
import { GlassChip } from '../../src/components/GlassButton';
import ProductCard from '../../src/components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../../src/data/products';
import { colors, fonts, layout } from '../../src/theme/tokens';
import {
  getProductGridMetrics,
  GRID_COLUMN_GAP,
  TABLET_CONTENT_MAX_WIDTH,
} from '../../src/utils/layout';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState(null);
  const showPromo =
    height >= 520 && !query.trim() && category === 'All' && sortBy === null;

  const { numColumns, cardSize } = getProductGridMetrics(width);
  const useInlineSort = width >= 900;

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = PRODUCTS.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
    if (sortBy === 'low') {
      return filtered.sort((a, b) => getPrice(a.price) - getPrice(b.price));
    }
    if (sortBy === 'high') {
      return filtered.sort((a, b) => getPrice(b.price) - getPrice(a.price));
    }
    return filtered;
  }, [query, category, sortBy]);

  return (
    <View style={styles.screen}>
      <View style={styles.header} pointerEvents="none">
        <BrandHeader />
      </View>

      <View style={styles.toolbar}>
        <SearchToolbar value={query} onChangeText={setQuery} />

        <View style={[styles.filtersRow, useInlineSort && styles.landscapeFiltersRow]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={!useInlineSort}
            keyboardShouldPersistTaps="handled"
            style={[styles.chipScroll, useInlineSort && styles.landscapeChipScroll]}
            contentContainerStyle={[styles.chips, useInlineSort && styles.landscapeChips]}
          >
            {CATEGORIES.map((c) => (
              <GlassChip
                key={c}
                label={c}
                selected={c === category}
                onPress={() => setCategory(c)}
                hitSlop={5}
              />
            ))}
          </ScrollView>

          {useInlineSort ? (
            <PriceSortControls sortBy={sortBy} setSortBy={setSortBy} landscape />
          ) : null}
        </View>
      </View>

      <FlatList
        key={`home-grid-${numColumns}`}
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={[styles.column, { gap: GRID_COLUMN_GAP }]}
        ItemSeparatorComponent={RowSeparator}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.grid,
          { maxWidth: TABLET_CONTENT_MAX_WIDTH },
          { paddingBottom: insets.bottom + layout.navBottomOffset + 62 + 24 },
        ]}
        ListHeaderComponent={(
          <View>
            {showPromo ? (
              <PromoBanner
                onPress={() => router.push('/product/apple-smart-keyboard')}
                horizontalPadding={width < 360 ? 12 : 16}
              />
            ) : null}
            {!useInlineSort ? (
              <PriceSortControls sortBy={sortBy} setSortBy={setSortBy} />
            ) : null}
          </View>
        )}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            context="grid"
            cardSize={cardSize}
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
                setSortBy(null);
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

function getPrice(price) {
  return Number.parseFloat(price.replace(/[^\d.]/g, '')) || 0;
}

function PriceSortControls({ sortBy, setSortBy, landscape = false }) {
  return (
    <View style={[
      styles.sortRow,
      !landscape && styles.listSortRow,
      landscape && styles.landscapeSortRow,
    ]}>
      <Text style={styles.sortLabel}>Price</Text>
      <GlassChip
        label="Low to high"
        selected={sortBy === 'low'}
        onPress={() => setSortBy((current) => current === 'low' ? null : 'low')}
        hitSlop={5}
      />
      <GlassChip
        label="High to low"
        selected={sortBy === 'high'}
        onPress={() => setSortBy((current) => current === 'high' ? null : 'high')}
        hitSlop={5}
      />
    </View>
  );
}

function PromoBanner({ onPress, horizontalPadding }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Special offer: 10 percent off Apple Smart Keyboard. View product."
      onPress={onPress}
      style={({ pressed }) => [
        styles.promoBanner,
        { paddingHorizontal: horizontalPadding },
        pressed && styles.promoPressed,
      ]}
    >
      <LinearGradient
        colors={[colors.green, colors.blue]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.promoCopy}>
        <Text style={styles.promoEyebrow}>SPECIAL OFFER</Text>
        <Text style={styles.promoTitle}>10% off</Text>
        <Text style={styles.promoSubtitle} numberOfLines={1}>Apple Smart Keyboard</Text>
      </View>
      <View style={styles.promoImageFrame}>
        <Image
          source={require('../../assets/images/apple-smart-keyboard/main.webp')}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={styles.promoImage}
        />
      </View>
      <View style={styles.promoArrow}>
        <Ionicons name="chevron-forward" size={19} color={colors.black} />
      </View>
    </Pressable>
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
    width: '100%',
    maxWidth: TABLET_CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    paddingTop: 142, // search field sits 10px below the 132px header (y = 142)
  },
  chipScroll: {
    flexGrow: 0,
    height: 44,
  },
  filtersRow: {
    marginTop: 14,
  },
  landscapeFiltersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 33,
  },
  landscapeChipScroll: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 16,
  },
  listSortRow: {
    marginBottom: 16,
  },
  landscapeSortRow: {
    paddingLeft: 16,
    paddingRight: 0,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(17,17,17,0.14)',
    gap: 10,
    flexShrink: 0,
  },
  sortLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 12,
    color: colors.labelSecondary,
  },
  chips: {
    paddingHorizontal: 35,
    gap: 10,
    alignItems: 'center',
  },
  landscapeChips: {
    paddingHorizontal: 0,
  },
  grid: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: layout.gridPadding,
    paddingTop: 16,
  },
  column: {
    justifyContent: 'center',
  },
  promoBanner: {
    minHeight: 82,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  promoPressed: {
    transform: [{ scale: 0.985 }],
  },
  promoCopy: {
    flex: 1,
    minWidth: 0,
  },
  promoEyebrow: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.black,
  },
  promoTitle: {
    marginTop: 1,
    fontFamily: fonts.montserratBold,
    fontSize: 18,
    lineHeight: 23,
    color: colors.black,
  },
  promoSubtitle: {
    fontFamily: fonts.openSans,
    fontSize: 12,
    lineHeight: 16,
    color: colors.black,
  },
  promoImageFrame: {
    width: 68,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(17,17,17,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoImage: {
    width: 68,
    height: 60,
  },
  promoArrow: {
    width: 24,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
