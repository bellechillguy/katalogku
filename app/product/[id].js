import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '../../src/components/HeaderBar';
import RatingStars from '../../src/components/RatingStars';
import { GlassButton, GlassChip, GlassSwatch } from '../../src/components/GlassButton';
import { useFavorites } from '../../src/context/FavoritesContext';
import { getProduct } from '../../src/data/products';
import { colors, fonts, layout } from '../../src/theme/tokens';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggle } = useFavorites();
  const [imageIndex, setImageIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);

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
  const crop = product.crops?.detail;
  const selectedColor = product.colors?.[colorIndex];
  const galleryImages = selectedColor?.image
    ? [selectedColor.image]
    : product.detailImage
      ? [product.detailImage, product.image]
    : [product.image];
  const hasOptions = !!(product.colors || product.sizes);

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
              onPress={() => router.push('/favorites')}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Open favorites"
              style={styles.favoriteNavButton}
            >
              <Ionicons name="heart-outline" size={24} color={colors.black} />
              <Text style={styles.favoriteNavLabel}>Favorites</Text>
            </Pressable>
          }
        />

        <View style={styles.body}>
          <View style={styles.imageFrame}>
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

          <Text
            style={[
              styles.category,
              galleryImages.length > 1 && styles.categoryAfterGallery,
            ]}
          >
            {product.category.toUpperCase()}
          </Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
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
              <View style={styles.rating}>
                <RatingStars value={product.rating.value} />
                <Text style={styles.ratingCount}>{product.rating.count}</Text>
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
        </View>
      </ScrollView>

      <View
        style={[
          styles.stickyAction,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <GlassButton
          label={favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          onPress={handleFavoriteAction}
        />
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
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Confirm remove from favorites"
                onPress={confirmFavoriteRemoval}
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
  imageFrame: {
    height: 256.5,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: colors.white,
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
  favoriteNavButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favoriteNavLabel: {
    fontFamily: fonts.montserratMedium,
    fontSize: 12,
    color: colors.black,
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
    gap: 49,
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
    fontSize: 10,
    lineHeight: 13,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 21,
  },
  ratingCount: {
    fontFamily: fonts.montserratBold,
    fontSize: 16.713,
    lineHeight: 20.056,
    color: colors.black,
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
    fontSize: 12,
    lineHeight: 18,
    color: colors.black,
  },
  stickyAction: {
    minHeight: 68,
    paddingTop: 12,
    paddingHorizontal: layout.screenPadding,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(17,17,17,0.12)',
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
  removeConfirmButton: {
    backgroundColor: colors.red,
  },
  removeConfirmLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 13,
    color: colors.black,
  },
});
