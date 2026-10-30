import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '../../src/components/HeaderBar';
import RatingStars from '../../src/components/RatingStars';
import { GlassButton, GlassChip, GlassSwatch } from '../../src/components/GlassButton';
import { useFavorites } from '../../src/context/FavoritesContext';
import { useCart } from '../../src/context/CartContext';
import { getProduct } from '../../src/data/products';
import { colors, fonts, layout } from '../../src/theme/tokens';
import { TABLET_BODY_MAX_WIDTH } from '../../src/utils/layout';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isFavorite, toggle } = useFavorites();
  const { items: cartItems, addItem } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [cartFeedback, setCartFeedback] = useState('');

  useEffect(() => {
    if (!cartFeedback) return undefined;
    const timeout = setTimeout(() => setCartFeedback(''), 1800);
    return () => clearTimeout(timeout);
  }, [cartFeedback]);

  const product = getProduct(Array.isArray(id) ? id[0] : id);

  if (!product) {
    return (
      <View style={styles.screen}>
        <BackHeader title="Details" onBack={() => router.back()} />
        <Text style={styles.notFound}>Product not found</Text>
      </View>
    );
  }

  const favorite = isFavorite(product.id);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const crop = product.crops?.detail;
  const selectedColor = product.colors?.[colorIndex];
  const selectedSize = product.sizes?.[sizeIndex];
  const selectedCartItem = cartItems.find((item) =>
    item.id === product.id &&
    item.color === (selectedColor?.name ?? null) &&
    item.size === (selectedSize ?? null)
  );
  const stockLimitReached = (selectedCartItem?.quantity ?? 0) >= product.demoStock;
  const galleryImages = selectedColor?.image
    ? [selectedColor.image]
    : product.detailImage
      ? [product.detailImage, product.image]
    : [product.image];
  const hasOptions = !!(product.colors || product.sizes);
  const compactProductInfo = width < 390;
  const compactActions = width < 370;
  const tabletLayout = width >= 700;
  const wideLayout = width >= 900;

  const handleFavoriteAction = () => {
    if (favorite) {
      setShowRemoveConfirmation(true);
      return;
    }
    toggle(product.id);
  };

  const confirmFavoriteRemoval = () => {
    toggle(product.id);
    setShowRemoveConfirmation(false);
  };

  const handleAddToCart = () => {
    if (stockLimitReached) {
      setCartFeedback('The demo stock limit for this selection has been reached.');
      return;
    }
    addItem(product.id, {
      color: selectedColor?.name,
      size: selectedSize,
    });
    setCartFeedback(`${product.name} added to cart`);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BackHeader
          title="Details"
          onBack={() => router.back()}
          right={
            <Pressable
              onPress={() => router.navigate('/cart')}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={cartCount > 0
                ? `Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
                : 'Open cart'}
              style={styles.cartNavButton}
            >
              <View style={styles.cartIconWrap}>
                <Ionicons name="cart-outline" size={24} color={colors.black} />
                {cartCount > 0 ? (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeLabel}>{cartCount > 99 ? '99+' : cartCount}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.cartNavLabel}>Cart</Text>
            </Pressable>
          }
        />

        <View style={[
          styles.body,
          tabletLayout && styles.bodyTablet,
          wideLayout && styles.bodyWide,
        ]}>
          <View style={[styles.mediaColumn, tabletLayout && styles.mediaColumnTablet, wideLayout && styles.mediaColumnWide]}>
            <View style={[styles.imageFrame, tabletLayout && styles.imageFrameTablet, wideLayout && styles.imageFrameWide]}>
              <Image
                source={galleryImages[imageIndex] ?? galleryImages[0]}
                accessibilityLabel={`Image ${imageIndex + 1} of ${galleryImages.length} for ${product.name}`}
                resizeMode={product.detailResizeMode ?? 'contain'}
                style={crop ? [styles.imageCropped, crop] : styles.image}
              />
            </View>

            {galleryImages.length > 1 && (
              <View style={styles.gallery} accessibilityLabel="Product images">
                {galleryImages.map((source, index) => (
                  <Pressable
                    key={index}
                    accessibilityRole="button"
                    accessibilityLabel={`Product image ${index + 1} of ${galleryImages.length}`}
                    accessibilityState={{ selected: index === imageIndex }}
                    onPress={() => setImageIndex(index)}
                    style={styles.thumbnailTarget}
                  >
                    <View
                      style={[
                        styles.thumbnail,
                        index === imageIndex && styles.selectedThumbnail,
                      ]}
                    >
                      <Image source={source} resizeMode="contain" style={styles.thumbnailImage} />
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={[
            styles.infoColumn,
            tabletLayout && styles.infoColumnTablet,
            wideLayout && styles.infoColumnWide,
          ]}>
            <Text
              style={[
                styles.category,
                galleryImages.length > 1 && styles.categoryAfterGallery,
                tabletLayout && styles.categoryTablet,
              ]}
            >
              {product.category.toUpperCase()}
            </Text>
            <Text style={styles.name}>{product.name}</Text>

            <View style={[styles.priceRow, compactProductInfo && styles.priceRowCompact]}>
              <View style={styles.priceColumn}>
                <Text style={styles.price}>{product.price}</Text>
                {product.originalPrice ? (
                  <View style={styles.saleMeta}>
                    <Text style={styles.originalPrice}>{product.originalPrice}</Text>
                    {product.discount ? (
                      <Text style={styles.detailDiscount}>-{product.discount}%</Text>
                    ) : null}
                  </View>
                ) : null}
              </View>
              {product.rating && (
                <View style={[styles.rating, compactProductInfo && styles.ratingCompact]}>
                  <Text style={styles.ratingValue}>{product.rating.value.toFixed(1)}</Text>
                  <RatingStars value={product.rating.value} size={15} gap={2} />
                  <Text style={styles.ratingCount} numberOfLines={1}>
                    {product.rating.count} demo reviews
                  </Text>
                </View>
              )}
            </View>

            {hasOptions && (
              <View style={styles.options}>
                {product.colors && (
                  <View style={styles.option}>
                    <Text style={styles.optionLabel}>
                      Color: {selectedColor?.name ?? ''}
                    </Text>
                    <View style={styles.optionRow}>
                      {product.colors.map((color, i) => (
                        <GlassSwatch
                          key={color.value}
                          color={color.value}
                          selected={i === colorIndex}
                          accessibilityLabel={`${color.name} color`}
                          onPress={() => {
                            setColorIndex(i);
                            setImageIndex(0);
                          }}
                        />
                      ))}
                    </View>
                  </View>
                )}
                {product.sizes && (
                  <View style={styles.option}>
                    <Text style={styles.optionLabel}>
                      Size: {product.sizes[sizeIndex] ?? ''}
                    </Text>
                    <View style={styles.optionRow}>
                      {product.sizes.map((s, i) => (
                        <GlassChip
                          key={s}
                          label={s}
                          selected={i === sizeIndex}
                          onPress={() => setSizeIndex(i)}
                          hitSlop={5}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}

            {product.description ? (
              <Text style={styles.description}>{product.description}</Text>
            ) : null}

            {product.details?.length ? (
              <View style={styles.productDetails}>
                <Text style={styles.productDetailsTitle}>Product details</Text>
                {product.details.map((detail) => (
                  <View key={detail.label} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{detail.label}</Text>
                    <Text style={styles.detailValue}>{detail.value}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.stickyAction,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        {cartFeedback ? (
          <Text accessibilityRole="alert" numberOfLines={1} style={styles.cartFeedback}>
            {cartFeedback}
          </Text>
        ) : null}
        <View style={[styles.actionRow, compactActions && styles.actionRowCompact]}>
          <GlassButton
            label={stockLimitReached ? 'Stock limit reached' : 'Add to Cart'}
            onPress={handleAddToCart}
            disabled={stockLimitReached}
            accessibilityLabel={stockLimitReached
              ? 'Demo stock limit reached for this selection'
              : 'Add product to cart'}
            style={[styles.actionButton, compactActions && styles.actionButtonCompact]}
            buttonStyle={styles.primaryActionVisual}
            labelStyle={styles.actionLabel}
          />
          <GlassButton
            label={favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            onPress={handleFavoriteAction}
            style={[styles.actionButton, compactActions && styles.actionButtonCompact]}
            buttonStyle={styles.secondaryActionVisual}
            labelStyle={styles.secondaryActionLabel}
          />
        </View>
      </View>

      <Modal
        visible={showRemoveConfirmation}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowRemoveConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialog} accessibilityViewIsModal>
            <Text style={styles.dialogTitle}>Remove from favorites?</Text>
            <Text style={styles.dialogMessage}>
              Remove {product.name} from your favorites?
            </Text>
            <View style={styles.dialogActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowRemoveConfirmation(false)}
                style={[styles.dialogButton, styles.cancelButton]}
              >
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Pressable>
              <GlassButton
                onPress={confirmFavoriteRemoval}
                label="Remove"
                variant="danger"
                accessibilityLabel="Confirm remove from favorites"
                style={styles.dangerAction}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  body: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 11.055,
  },
  bodyTablet: {
    width: '100%',
    maxWidth: TABLET_BODY_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  bodyWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 32,
    paddingTop: 24,
  },
  mediaColumn: {
    minWidth: 0,
  },
  mediaColumnTablet: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  mediaColumnWide: {
    flex: 1,
    width: 'auto',
  },
  infoColumn: {
    minWidth: 0,
  },
  infoColumnTablet: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  infoColumnWide: {
    flex: 1,
    width: 'auto',
  },
  imageFrame: {
    height: 256.5,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  imageFrameTablet: {
    height: 360,
  },
  imageFrameWide: {
    height: 420,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gallery: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    padding: 4,
    borderRadius: 16,
    backgroundColor: colors.fillVibrantTertiary,
  },
  thumbnailTarget: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: 38,
    height: 38,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: colors.blueText,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  imageCropped: {
    position: 'absolute',
    width: '100%',
  },
  category: {
    marginTop: 45.445,
    fontFamily: fonts.montserratMedium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.labelSecondary,
  },
  categoryAfterGallery: {
    marginTop: 20,
  },
  categoryTablet: {
    marginTop: 24,
  },
  cartNavButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cartNavLabel: {
    fontFamily: fonts.montserratMedium,
    fontSize: 12,
    color: colors.black,
  },
  cartIconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -5,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueText,
  },
  cartBadgeLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 8,
    lineHeight: 10,
    color: colors.white,
  },
  name: {
    marginTop: 9,
    fontFamily: fonts.montserratSemiBold,
    fontSize: 17,
    lineHeight: 20,
    color: colors.black,
  },
  priceRow: {
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceRowCompact: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  price: {
    fontFamily: fonts.montserratBold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.red,
  },
  priceColumn: {
    alignItems: 'flex-start',
  },
  saleMeta: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontFamily: fonts.montserrat,
    fontSize: 13,
    lineHeight: 17,
    color: colors.priceMuted,
    textDecorationLine: 'line-through',
  },
  detailDiscount: {
    overflow: 'hidden',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: colors.red,
    color: colors.black,
    fontFamily: fonts.montserratBold,
    fontSize: 11,
    lineHeight: 14,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minWidth: 0,
  },
  ratingCompact: {
    alignSelf: 'flex-start',
  },
  ratingValue: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.black,
  },
  ratingCount: {
    flexShrink: 1,
    fontFamily: fonts.openSans,
    fontSize: 11,
    lineHeight: 15,
    color: colors.labelSecondary,
  },
  options: {
    marginTop: 27.912,
    gap: 25,
  },
  option: {
    gap: 9,
  },
  optionLabel: {
    fontFamily: fonts.montserratMedium,
    fontSize: 14,
    lineHeight: 18,
    color: colors.black,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  description: {
    marginTop: 27,
    fontFamily: fonts.montserratMedium,
    fontSize: 14,
    lineHeight: 21,
    color: colors.black,
  },
  productDetails: {
    marginTop: 24,
    gap: 14,
  },
  productDetailsTitle: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.black,
  },
  detailRow: {
    gap: 3,
  },
  detailLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.labelSecondary,
  },
  detailValue: {
    fontFamily: fonts.openSans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.black,
  },
  stickyAction: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    minHeight: 68,
    paddingTop: 12,
    paddingHorizontal: layout.screenPadding,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(17,17,17,0.12)',
  },
  cartFeedback: {
    alignSelf: 'flex-start',
    fontFamily: fonts.montserratMedium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.blueText,
  },
  actionRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  actionRowCompact: {
    flexDirection: 'column',
  },
  actionButtonCompact: {
    width: '100%',
    flex: 0,
  },
  primaryActionVisual: {
    minWidth: 0,
    height: 48,
    paddingHorizontal: 8,
  },
  actionLabel: {
    fontSize: 13,
    lineHeight: 17,
  },
  secondaryActionVisual: {
    minWidth: 0,
    height: 48,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(17,17,17,0.18)',
    backgroundColor: colors.white,
    boxShadow: 'none',
  },
  secondaryActionLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 11.5,
    lineHeight: 15,
    color: colors.black,
  },
  notFound: {
    marginTop: 40,
    textAlign: 'center',
    fontFamily: fonts.openSans,
    fontSize: 14,
    color: colors.labelSecondary,
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
    height: 40,
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
  dangerAction: {
    minWidth: 88,
    height: 44,
  },
});
