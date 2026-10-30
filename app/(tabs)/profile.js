import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TitleHeader } from '../../src/components/HeaderBar';
import GlassInput from '../../src/components/GlassInput';
import { GlassButton } from '../../src/components/GlassButton';
import { colors, fonts, layout } from '../../src/theme/tokens';

const PROFILE_STORAGE_KEY = '@katalogku/profile';
const EMPTY_FORM = { name: '', email: '', phone: '' };

function validateField(field, value) {
  const normalized = value.trim();
  if (field === 'name') return normalized ? '' : 'Please enter your full name.';
  if (field === 'email') {
    if (!normalized) return 'Please enter your email address.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
      ? ''
      : 'Enter a valid email address.';
  }
  if (field === 'phone' && normalized) {
    const digits = normalized.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15
      ? ''
      : 'Enter a phone number with 8–15 digits.';
  }
  return '';
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(PROFILE_STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        if (stored) {
          const profile = JSON.parse(stored);
          setForm({
            name: profile.name ?? '',
            email: profile.email ?? '',
            phone: profile.phone ?? '',
          });
        }
      })
      .catch(() => {
        if (active) setStatus({ type: 'error', message: 'Your saved profile could not be loaded.' });
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => { active = false; };
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus(null);
  };

  const blurField = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const save = async () => {
    if (!ready || saving) return;
    Keyboard.dismiss();
    setTouched({ name: true, email: true, phone: true });
    const invalid = Object.keys(form).some((field) => validateField(field, form[field]));
    if (invalid) {
      setStatus({ type: 'error', message: 'Check the highlighted fields and try again.' });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      }));
      setStatus({ type: 'success', message: 'Your profile has been saved.' });
    } catch {
      setStatus({ type: 'error', message: 'Could not save your profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const errorFor = (field) => touched[field] ? validateField(field, form[field]) : '';

  return (
    <View style={styles.screen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + layout.navBottomOffset + 62 + 24 }}
      >
        <TitleHeader title="Profile" subtitle="Complete your account details" />

        <View style={styles.form}>
          <GlassInput
            label="Full Name"
            placeholder="Jane Doe"
            value={form.name}
            error={errorFor('name')}
            onChangeText={(value) => updateField('name', value)}
            onBlur={() => blurField('name')}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            returnKeyType="next"
          />
          <GlassInput
            label="Email"
            placeholder="jane_doe@mail.com"
            value={form.email}
            error={errorFor('email')}
            onChangeText={(value) => updateField('email', value)}
            onBlur={() => blurField('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
          />
          <GlassInput
            label="Phone Number (optional)"
            placeholder="0888-888-8888"
            value={form.phone}
            error={errorFor('phone')}
            onChangeText={(value) => updateField('phone', value)}
            onBlur={() => blurField('phone')}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/change-password')}
          style={({ pressed }) => [styles.passwordLink, pressed && styles.passwordLinkPressed]}
        >
          <View>
            <Text style={styles.passwordTitle}>Password</Text>
            <Text style={styles.passwordDescription}>Change your account password</Text>
          </View>
          <Text style={styles.passwordAction}>Change</Text>
        </Pressable>

        <View style={styles.action}>
          <GlassButton
            label={!ready ? 'Loading…' : saving ? 'Saving…' : 'Save Profile'}
            onPress={save}
            accessibilityLabel={!ready ? 'Loading saved profile' : saving ? 'Saving profile' : 'Save profile'}
          />
          {status ? (
            <Text
              accessibilityRole="alert"
              style={[styles.status, status.type === 'success' ? styles.success : styles.errorStatus]}
            >
              {status.message}
            </Text>
          ) : null}
          {!ready ? <Text style={styles.loading}>Loading saved profile…</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  form: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 48,
    gap: 26,
  },
  passwordLink: {
    marginHorizontal: layout.screenPadding,
    marginTop: 28,
    minHeight: 60,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(17,17,17,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordLinkPressed: {
    backgroundColor: 'rgba(17,17,17,0.04)',
  },
  passwordTitle: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 14,
    color: colors.black,
  },
  passwordDescription: {
    marginTop: 3,
    fontFamily: fonts.openSans,
    fontSize: 12,
    color: colors.labelSecondary,
  },
  passwordAction: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 13,
    color: colors.blueText,
  },
  action: {
    paddingTop: 32,
    alignItems: 'center',
  },
  status: {
    marginTop: 12,
    paddingHorizontal: 28,
    fontFamily: fonts.openSans,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  success: {
    color: '#287A34',
  },
  errorStatus: {
    color: colors.redText,
  },
  loading: {
    marginTop: 10,
    fontFamily: fonts.openSans,
    fontSize: 12,
    color: colors.labelSecondary,
  },
});
