import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_ICON } from '../data/products';
import { colors, fonts, layout } from '../theme/tokens';

/** ProductCard — compact product image with a readable header and optional actions. */
export default function ProductCard({
  product,
  onPress,
  onRemove,
  context = 'grid',
  cardSize = layout.cardSize,
}) {
  const crop = product.crops?.[context];
  const discount = Number(product.discount);
  const isFavoriteCard = context === 'favorites';
  const cardHeight = cardSize + 24;
  const headerHeight = product.originalPrice ? 76 : 68;

  return (
    <View style={[styles.shadow, { width: cardSize, height: cardHeight }]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={[
          product.name,
          product.category,
          product.price,
          product.rating
            ? `Demo rating ${product.rating.value.toFixed(1)} out of 5, ${product.rating.count} sample reviews`
            : null,
        ].filter(Boolean).join(', ')}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={[styles.media, { height: cardHeight - headerHeight }]}>
          <Image
            source={product.image}
            resizeMode="cover"
            style={crop ? [styles.imageCropped, crop] : styles.image}
          />
          {discount > 0 && !isFavoriteCard ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountLabel}>-{discount}%</Text>
            </View>
          ) : null}
          {product.rating ? (
            <View style={styles.ratingBadge} pointerEvents="none">
              <Ionicons name="star" size={11} color={colors.starFilled} />
              <Text style={styles.ratingValue}>{product.rating.value.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>· {product.rating.count} sample</Text>
            </View>
          ) : null}
        </View>

        <View style={[
          styles.header,
          product.originalPrice && styles.expandedHeader,
        ]}>
          <View style={styles.titleRow}>
            <Text
              style={styles.title}
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
          style={styles.removeButton}
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
    height: 68,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: 'center',
    gap: 4,
  },
  expandedHeader: {
    height: 76,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  titleRow: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerMeta: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryMeta: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    width: 17,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.montserratSemiBold,
    fontSize: 13,
    lineHeight: 16,
    color: colors.black,
  },
  category: {
    fontFamily: fonts.montserrat,
    fontSize: 11,
    lineHeight: 13,
    color: colors.black,
  },
  price: {
    maxWidth: 68,
    fontFamily: fonts.montserrat,
    fontSize: 12,
    lineHeight: 15,
    color: colors.priceMuted,
    textAlign: 'right',
  },
  favoritePrice: {
    maxWidth: 68,
    fontSize: 12,
    lineHeight: 15,
  },
  priceBlock: {
    maxWidth: 68,
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
    fontSize: 11,
    lineHeight: 13,
    color: colors.priceMuted,
    textDecorationLine: 'line-through',
    textAlign: 'right',
  },
  media: {
    width: '100%',
    height: layout.cardSize + 24 - layout.cardHeaderHeight,
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
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
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
    left: 8,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 11,
    backgroundColor: 'rgba(249,250,251,0.97)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(17,17,17,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 11,
    lineHeight: 13,
    color: colors.black,
  },
  ratingCount: {
    fontFamily: fonts.openSans,
    fontSize: 11,
    lineHeight: 13,
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
