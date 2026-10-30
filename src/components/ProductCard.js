import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_ICON } from '../data/products';
import { colors, fonts, layout } from '../theme/tokens';

/** ProductCard — compact product image with a readable header and optional actions. */
export default function ProductCard({ product, onPress, onRemove, context = 'grid' }) {
  const crop = product.crops?.[context];
  const discount = Number(product.discount);
  const isFavoriteCard = context === 'favorites';
  const headerHeight = isFavoriteCard ? 64 : product.originalPrice ? 64 : 58;

  return (
    <View style={styles.shadow}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={[
          product.name,
          product.category,
          product.price,
          product.rating
            ? `Rated ${product.rating.value.toFixed(1)} out of 5, ${product.rating.count} reviews`
            : null,
        ].filter(Boolean).join(', ')}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={[styles.media, { height: layout.cardSize - headerHeight }]}>
          <Image
            source={product.image}
            resizeMode="cover"
            style={crop ? [styles.imageCropped, crop] : styles.image}
          />
          {discount > 0 ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountLabel}>-{discount}%</Text>
            </View>
          ) : null}
          {product.rating ? (
            <View style={styles.ratingBadge} pointerEvents="none">
              <Ionicons name="star" size={11} color={colors.starFilled} />
              <Text style={styles.ratingValue}>{product.rating.value.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>· {product.rating.count}</Text>
            </View>
          ) : null}
        </View>

        <View style={[
          styles.header,
          product.originalPrice && styles.expandedHeader,
          isFavoriteCard && styles.favoriteHeader,
        ]}>
          <View style={[styles.titleRow, isFavoriteCard && styles.favoriteTitleRow]}>
            <Text
              style={[styles.title, isFavoriteCard && styles.favoriteTitle]}
              numberOfLines={2}
            >
              {product.name}
            </Text>
          </View>
          <View style={styles.headerMeta}>
            <View style={styles.categoryMeta}>
              <View style={styles.icon}>
                <Ionicons name={CATEGORY_ICON[product.category]} size={16} color={colors.black} />
              </View>
              <Text style={styles.category} numberOfLines={1}>
                {product.category}
              </Text>
            </View>
            <View style={styles.priceBlock}>
              <Text
                style={[
                  styles.price,
                  isFavoriteCard && styles.favoritePrice,
                  product.originalPrice && styles.salePrice,
                ]}
                numberOfLines={1}
              >
                {product.price}
              </Text>
              {product.originalPrice ? (
                <Text style={styles.originalPrice} numberOfLines={1}>
                  {product.originalPrice}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </Pressable>

      {onRemove ? (
        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${product.name} from favorites`}
          hitSlop={6}
          style={[styles.removeButton, isFavoriteCard && { top: layout.cardSize - headerHeight }]}
        >
          <View style={styles.removeButtonVisual}>
            <Ionicons name="trash-outline" size={14} color={colors.black} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Shadow lives outside the clipped card so it remains visible around the image.
  shadow: {
    width: layout.cardSize,
    height: layout.cardSize,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.white,
    boxShadow: '0px -1px 4px 0px rgba(0,0,0,0.25)',
  },
  card: {
    flex: 1,
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  header: {
    width: '100%',
    height: 58,
    paddingHorizontal: 7,
    paddingVertical: 3,
    justifyContent: 'center',
    gap: 2,
  },
  expandedHeader: {
    height: 64,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 2,
  },
  favoriteHeader: {
    height: 64,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 2,
  },
  titleRow: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favoriteTitleRow: {
    paddingRight: 34,
  },
  headerMeta: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
  },
  categoryMeta: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.montserratSemiBold,
    fontSize: 13,
    lineHeight: 15,
    color: colors.black,
  },
  favoriteTitle: {
    flex: 1,
    fontSize: 13,
    lineHeight: 15,
  },
  category: {
    fontFamily: fonts.montserrat,
    fontSize: 11,
    lineHeight: 13,
    color: colors.black,
  },
  price: {
    maxWidth: 45,
    fontFamily: fonts.montserrat,
    fontSize: 11,
    lineHeight: 13,
    color: colors.priceMuted,
    textAlign: 'right',
  },
  favoritePrice: {
    maxWidth: 62,
    fontSize: 11,
    lineHeight: 14,
  },
  priceBlock: {
    maxWidth: 62,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  salePrice: {
    maxWidth: 62,
    color: colors.red,
    fontFamily: fonts.montserratBold,
  },
  originalPrice: {
    fontFamily: fonts.montserrat,
    fontSize: 9,
    lineHeight: 11,
    color: colors.priceMuted,
    textDecorationLine: 'line-through',
    textAlign: 'right',
  },
  media: {
    width: '100%',
    height: layout.cardSize - layout.cardHeaderHeight,
    backgroundColor: colors.cardMediaTint,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageCropped: {
    position: 'absolute',
    width: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.red,
  },
  discountLabel: {
    fontFamily: fonts.montserratBold,
    fontSize: 11,
    lineHeight: 13,
    color: colors.black,
  },
  ratingBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 11,
    backgroundColor: 'rgba(249,250,251,0.97)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(17,17,17,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingValue: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.black,
  },
  ratingCount: {
    fontFamily: fonts.openSans,
    fontSize: 10,
    lineHeight: 12,
    color: colors.labelControlsTertiary,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  removeButtonVisual: {
    width: 25,
    height: 25,
    marginTop: 6,
    marginRight: 6,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(17,17,17,0.12)',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
  },
});
