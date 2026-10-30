import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHeader } from '../src/components/HeaderBar';
import { colors, fonts, layout } from '../src/theme/tokens';

const STUDENT_NAME = 'Nisrina Zakiyah';
const STUDENT_NIM = '18224001';

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <BackHeader title="About" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandMark}>
          <Ionicons
            name="storefront-outline"
            size={34}
            color={colors.blueText}
            accessible={false}
          />
        </View>
        <Text style={styles.appName}>KatalogKu</Text>
        <Text style={styles.description}>
          Explore products, view their details, save favorites, and add items to your cart.
        </Text>

        <View style={styles.infoCard}>
          <InfoRow label="Name" value={STUDENT_NAME} />
          <View style={styles.divider} />
          <InfoRow label="NIM" value={STUDENT_NIM} />
          <View style={styles.divider} />
          <InfoRow label="Course" value="Web and Mobile Application Development" />
          <View style={styles.divider} />
          <InfoRow label="Built with" value="React Native and Expo" />
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 34,
  },
  brandMark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.fillVibrantTertiary,
  },
  appName: {
    marginTop: 14,
    fontFamily: fonts.montserratBold,
    fontSize: 23,
    color: colors.black,
  },
  description: {
    maxWidth: 290,
    marginTop: 7,
    fontFamily: fonts.openSans,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: colors.labelSecondary,
  },
  infoCard: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    marginTop: 30,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(17,17,17,0.1)',
  },
  infoRow: {
    minHeight: 58,
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontFamily: fonts.openSans,
    fontSize: 12,
    color: colors.labelSecondary,
  },
  value: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 14,
    color: colors.black,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(17,17,17,0.12)',
  },
});
