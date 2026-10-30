import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassSurface from './GlassSurface';
import { colors, fonts, glassShadow } from '../theme/tokens';

/** Input/* — label above a 48px glass pill field. */
export default function GlassInput({
  label,
  error,
  icon,
  iconSize = 18,
  iconColor = colors.black,
  style,
  ...inputProps
}) {
  return (
    <View style={[styles.group, style]}>
      <Text style={styles.label}>{label}</Text>
      <GlassSurface
        shadow={glassShadow.surface}
        borderColor="rgba(17,17,17,0.2)"
        borderWidth={1}
        style={styles.field}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={iconSize}
            color={iconColor}
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={styles.icon}
          />
        ) : null}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.labelControlsTertiary}
          selectionColor={colors.blue}
          style={styles.input}
          {...inputProps}
        />
      </GlassSurface>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 10,
  },
  label: {
    fontFamily: fonts.montserratSemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.black,
  },
  field: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 11,
    paddingRight: 10,
  },
  icon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontFamily: fonts.openSansSemiBold,
    fontSize: 16,
    color: colors.black,
    paddingHorizontal: 12,
    paddingVertical: 0,
    height: 48,
  },
  error: {
    fontFamily: fonts.openSans,
    fontSize: 12,
    lineHeight: 16,
    color: colors.redText,
  },
});
