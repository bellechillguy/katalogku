import React, { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { requireOptionalNativeModule } from 'expo';
import GlassSurface from './GlassSurface';
import { GlassIconButton } from './GlassButton';
import { colors, fonts, glassShadow, SPEECH_LANG } from '../theme/tokens';

const speechRecognitionModule = requireOptionalNativeModule('ExpoSpeechRecognition');

/** SearchToolbar — "Search with Focus" variant: glass search field + glass X button. */
export default function SearchToolbar({ value, onChangeText, style }) {
  const inputRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!speechRecognitionModule) return undefined;

    const subscriptions = [
      speechRecognitionModule.addListener('start', () => setListening(true)),
      speechRecognitionModule.addListener('end', () => setListening(false)),
      speechRecognitionModule.addListener('error', () => setListening(false)),
      speechRecognitionModule.addListener('result', (event) => {
        const transcript = event.results?.[0]?.transcript;
        if (transcript) onChangeText(transcript);
      }),
    ];

    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, [onChangeText]);

  const toggleMic = async () => {
    if (!speechRecognitionModule) {
      Alert.alert(
        'Voice search unavailable',
        'Voice search requires a development build. Run npx expo run:ios or npx expo run:android.'
      );
      return;
    }

    if (listening) {
      speechRecognitionModule.stop();
      return;
    }
    const { granted } = await speechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      Alert.alert(
        'Microphone access needed',
        'Allow microphone and speech recognition access to search by voice.'
      );
      return;
    }
    Keyboard.dismiss();
    speechRecognitionModule.start({ lang: SPEECH_LANG, interimResults: true });
  };

  const clear = () => {
    if (listening) speechRecognitionModule?.abort();
    onChangeText('');
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.row, style]}>
      <GlassSurface shadow={glassShadow.surface} style={styles.field}>
        <Ionicons name="search" size={24} color={colors.black} />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder="Search for products..."
          placeholderTextColor={colors.labelControlsTertiary}
          selectionColor={colors.blue}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search for products"
          style={styles.input}
        />
        {speechRecognitionModule ? (
          <Pressable
            onPress={toggleMic}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={listening ? 'Stop voice search' : 'Search by voice'}
          >
            <Ionicons
              name={listening ? 'mic' : 'mic-outline'}
              size={22}
              color={listening ? colors.blueText : colors.labelControlsTertiary}
            />
          </Pressable>
        ) : null}
      </GlassSurface>

      {value.length > 0 ? (
        <GlassIconButton onPress={clear} accessibilityLabel="Clear search">
          <Ionicons name="close" size={30} color={colors.black} />
        </GlassIconButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 33,
  },
  field: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: fonts.openSansSemiBold,
    fontSize: 17,
    color: colors.black,
    paddingVertical: 0,
  },
});
