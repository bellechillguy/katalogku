import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/tokens';

/** Stars — five 20px stars, 6.7px apart. */
export default function RatingStars({ value = 0, size = 20 }) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name="star"
          size={size}
          color={n <= value ? colors.starFilled : colors.starEmpty}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6.737,
  },
});
