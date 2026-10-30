import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TitleHeader } from '../../src/components/HeaderBar';
import { GlassButton } from '../../src/components/GlassButton';
import { useCart } from '../../src/context/CartContext';
import { DEMO_COMMERCE, getProduct } from '../../src/data/products';
import { colors, fonts, layout } from '../../src/theme/tokens';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wideLayout = width >= 900;
  const { items, ready, updateQuantity, removeItem } = useCart();
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [showCheckoutNotice, setShowCheckoutNotice] = useState(false);
  const cartLines = items
    .map((item) => ({ ...item, product: getProduct(item.id) }))
    .filter((item) => item.product);
  const itemCount = cartLines.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartLines.reduce(
    (total, item) => total + getPrice(item.product.price) * item.quantity,
    0
  );
  const shipping = cartLines.length > 0 ? DEMO_COMMERCE.shippingFee : 0;
  const estimatedTax = subtotal * DEMO_COMMERCE.taxRate;
  const estimatedTotal = subtotal + shipping + estimatedTax;

  const confirmRemoval = () => {
    if (!pendingRemoval) return;
    removeItem(pendingRemoval.key);
    setPendingRemoval(null);
  };

  return (
    <View style={styles.screen}>
      <TitleHeader title="Cart" subtitle="Review your selected products" />
      {!ready ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.blueText} />
          <Text style={styles.loadingLabel}>Loading your cart…</Text>
        </View>
      ) : cartLines.length === 0 ? (
        <ScrollView
          contentContainerStyle={[
            styles.emptyContent,
            { paddingBottom: insets.bottom + layout.navBottomOffset + 62 + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyState}>
            <View style={styles.iconCircle}>
              <Ionicons name="cart-outline" size={34} color={colors.black} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyMessage}>
              Browse the catalog and add products you would like to buy.
            </Text>
            <GlassButton label="Browse products" onPress={() => router.navigate('/home')} />
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { maxWidth: 1240, alignSelf: 'center', width: '100%' },
            { paddingHorizontal: width < 380 ? 20 : layout.screenPadding },
            { paddingBottom: insets.bottom + layout.navBottomOffset + 62 + 28 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.itemCount}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
          <View style={[styles.cartLayout, wideLayout && styles.cartLayoutWide]}>
            <View style={[styles.itemList, wideLayout && styles.itemListWide]}>
              {cartLines.map((item) => (
                <CartLineItem
                  key={item.key}
                  item={item}
                  onDecrease={() => updateQuantity(item.key, item.quantity - 1)}
                  onIncrease={() => updateQuantity(item.key, item.quantity + 1)}
                  onRemove={() => setPendingRemoval(item)}
                />
              ))}
            </View>

            <View style={[styles.summary, wideLayout && styles.summaryWide]}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.subtotal}>{formatPrice(subtotal)}</Text>
              </View>
              <View style={styles.costRows}>
                <CostRow label="Flat shipping (demo)" value={formatPrice(shipping)} />
                <CostRow label={`Estimated tax (${DEMO_COMMERCE.taxRate * 100}%)`} value={formatPrice(estimatedTax)} />
                <View style={styles.totalDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Estimated total</Text>
                  <Text style={styles.totalAmount}>{formatPrice(estimatedTotal)}</Text>
                </View>
              </View>
              <Text style={styles.summaryNote}>
                These figures are estimates for demo purposes. Tax is calculated on the subtotal. Estimated delivery: {DEMO_COMMERCE.deliveryWindow}. Values are not updated in real time.
              </Text>
              <GlassButton
                label="Checkout"
                onPress={() => setShowCheckoutNotice(true)}
                style={styles.checkoutButton}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => router.navigate('/home')}
                style={styles.continueButton}
              >
                <Text style={styles.continueLabel}>Continue shopping</Text>
                <Ionicons name="arrow-forward" size={17} color={colors.blueText} />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={!!pendingRemoval}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setPendingRemoval(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialog} accessibilityViewIsModal>
            <Text style={styles.dialogTitle}>Remove item from cart?</Text>
            <Text style={styles.dialogMessage}>
              {pendingRemoval?.product?.name
                ? `Remove ${pendingRemoval.product.name} from your cart?`
                : ''}
            </Text>
            <View style={styles.dialogActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setPendingRemoval(null)}
                style={[styles.dialogButton, styles.cancelButton]}
              >
                <Text style={styles.cancelLabel}>Keep item</Text>
              </Pressable>
              <GlassButton
                onPress={confirmRemoval}
                label="Remove"
                variant="danger"
                accessibilityLabel="Confirm remove item from cart"
                style={styles.dangerAction}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCheckoutNotice}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowCheckoutNotice(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialog} accessibilityViewIsModal>
            <Text style={styles.dialogTitle}>Checkout is a demo</Text>
            <Text style={styles.dialogMessage}>
              Shipping, tax, delivery, and stock values are demo estimates. This prototype does not process orders or payments.
            </Text>
            <View style={styles.dialogActions}>
              <GlassButton
                onPress={() => setShowCheckoutNotice(false)}
                label="Back to cart"
                style={styles.noticeAction}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function CartLineItem({ item, onDecrease, onIncrease, onRemove }) {
  const { product, color, size, quantity } = item;
  const imageSource = product.colors?.find((option) => option.name === color)?.image ?? product.image;
  const variant = [color, size ? `Size ${size}` : null].filter(Boolean).join(' · ');

  return (
    <View style={styles.cartItem}>
      <View style={styles.thumbnailFrame}>
        <Image source={imageSource} resizeMode="contain" style={styles.thumbnail} />
      </View>
      <View style={styles.itemInfo}>
        <View style={styles.itemHeading}>
          <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${product.name} from cart`}
            onPress={onRemove}
            style={styles.removeButton}
          >
            <Ionicons name="trash-outline" size={18} color={colors.redText} />
          </Pressable>
        </View>
        <Text style={styles.productMeta} numberOfLines={1}>
          {variant || product.category}
        </Text>
        <View style={styles.unitPriceRow}>
          <Text style={styles.unitPrice}>{formatPrice(getPrice(product.price))} each</Text>
        </View>
        <Text style={styles.stockLimitNote}>
          {quantity >= product.demoStock
            ? 'Demo stock limit reached'
            : `Demo stock limit: ${product.demoStock} per selection`}
        </Text>
        <View style={styles.itemFooter}>
          <View style={styles.quantityControl}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={quantity === 1
                ? `Remove ${product.name} from cart`
                : `Decrease ${product.name} quantity`}
              onPress={quantity === 1 ? onRemove : onDecrease}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={18} color={colors.black} />
            </Pressable>
            <Text accessibilityLabel={`Quantity ${quantity}`} style={styles.quantity}>
              {quantity}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Increase ${product.name} quantity`}
              accessibilityState={{ disabled: quantity >= product.demoStock }}
              disabled={quantity >= product.demoStock}
              onPress={onIncrease}
              style={[
                styles.quantityButton,
                quantity >= product.demoStock && styles.quantityButtonDisabled,
              ]}
            >
              <Ionicons
                name="add"
                size={18}
                color={quantity >= product.demoStock ? colors.labelSecondary : colors.black}
              />
            </Pressable>
          </View>
          <View style={styles.lineTotal}>
            <Text style={styles.lineTotalLabel}>Line total</Text>
            <Text style={styles.lineTotalAmount}>
              {formatPrice(getPrice(product.price) * quantity)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function getPrice(price) {
  return Number.parseFloat(String(price).replace(/[^\d.]/g, '')) || 0;
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function CostRow({ label, value }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabelSecondary}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingLabel: {
    fontFamily: fonts.openSans,
    fontSize: 14,
    color: colors.labelSecondary,
  },
  emptyContent: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    flexGrow: 1,
    paddingHorizontal: layout.screenPadding,
  },
  emptyState: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.fillVibrantTertiary,
  },
  emptyTitle: {
    marginTop: 18,
    fontFamily: fonts.montserratSemiBold,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
    color: colors.black,
  },
  emptyMessage: {
    maxWidth: 270,
    marginTop: 8,
    marginBottom: 24,
    fontFamily: fonts.openSans,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: colors.labelSecondary,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 18,
  },
  cartLayout: {
    gap: 20,
  },
  cartLayoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  itemCount: {
    marginBottom: 12,
    fontFamily: fonts.montserratMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.labelSecondary,
  },
  itemList: {
    gap: 12,
  },
  itemListWide: {
    flex: 1,
    minWidth: 0,
  },
  cartItem: {
    minHeight: 150,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(17,17,17,0.08)',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
  },
  thumbnailFrame: {
    width: 78,
    height: 88,
    borderRadius: 11,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 4,
  },
  itemHeading: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  productName: {
    flex: 1,
    fontFamily: fonts.montserratSemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.black,
  },
  removeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productMeta: {
    fontFamily: fonts.openSans,
    fontSize: 12,
    lineHeight: 16,
    color: colors.labelSecondary,
  },
  unitPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  itemFooter: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  unitPrice: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.black,
  },
  stockLimitNote: {
    fontFamily: fonts.openSans,
    fontSize: 10,
    lineHeight: 13,
    color: colors.labelSecondary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: colors.fillVibrantTertiary,
  },
  quantityButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    minWidth: 22,
    textAlign: 'center',
    fontFamily: fonts.montserratSemiBold,
    fontSize: 13,
    color: colors.black,
  },
  lineTotal: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  lineTotalLabel: {
    fontFamily: fonts.openSans,
    fontSize: 10,
    lineHeight: 13,
    color: colors.labelSecondary,
  },
  lineTotalAmount: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.red,
  },
  summary: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(17,17,17,0.08)',
  },
  summaryWide: {
    width: 320,
    marginTop: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  costRows: {
    marginTop: 12,
    gap: 8,
  },
  summaryLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 14,
    color: colors.black,
  },
  subtotal: {
    fontFamily: fonts.montserratBold,
    fontSize: 18,
    color: colors.red,
  },
  summaryLabelSecondary: {
    fontFamily: fonts.openSans,
    fontSize: 13,
    color: colors.labelSecondary,
  },
  summaryValue: {
    fontFamily: fonts.montserratMedium,
    fontSize: 13,
    color: colors.black,
  },
  totalDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 3,
    backgroundColor: 'rgba(17,17,17,0.14)',
  },
  totalLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 15,
    color: colors.black,
  },
  totalAmount: {
    fontFamily: fonts.montserratBold,
    fontSize: 18,
    color: colors.red,
  },
  summaryNote: {
    marginTop: 9,
    fontFamily: fonts.openSans,
    fontSize: 11,
    lineHeight: 15,
    color: colors.labelSecondary,
  },
  checkoutButton: {
    width: '100%',
    marginTop: 18,
  },
  continueButton: {
    minHeight: 44,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  continueLabel: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 13,
    color: colors.blueText,
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
  dangerAction: {
    minWidth: 88,
    height: 44,
  },
  noticeAction: {
    minWidth: 130,
    height: 44,
  },
});
