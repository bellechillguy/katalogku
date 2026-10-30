import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BackHeader } from '../src/components/HeaderBar';
import { GlassButton } from '../src/components/GlassButton';
import { colors, fonts, layout } from '../src/theme/tokens';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <BackHeader title="Change Password" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed-outline" size={32} color={colors.black} />
        </View>
        <Text style={styles.title}>Password updates aren’t available yet</Text>
        <Text style={styles.message}>
          KatalogKu isn’t connected to an account service, so a password can’t be changed here.
          No password is requested or stored on this screen.
        </Text>
        <GlassButton label="Back to Profile" onPress={() => router.back()} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 28,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(133,180,235,0.2)',
  },
  title: {
    marginTop: 20,
    fontFamily: fonts.montserratSemiBold,
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
    color: colors.black,
  },
  message: {
    marginTop: 10,
    marginBottom: 24,
    fontFamily: fonts.openSans,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: colors.labelSecondary,
  },
});
