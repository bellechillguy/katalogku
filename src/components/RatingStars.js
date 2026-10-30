import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/tokens';

/** Stars — five 20px stars, 6.7px apart. */
export default function RatingStars({ value = 0, size = 20, gap = 6.737 }) {
  return (
    <View
      style={[styles.row, { gap }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Demo rating ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const fraction = value - (n - 1);
        const name = fraction >= 0.75
          ? 'star'
          : fraction >= 0.25
            ? 'star-half'
            : 'star';
        const color = fraction >= 0.25 ? colors.starFilled : colors.starEmpty;
        return <Ionicons key={n} name={name} size={size} color={color} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
