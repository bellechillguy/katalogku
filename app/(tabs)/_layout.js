import React from 'react';
import { Tabs } from 'expo-router';
import BottomNavigation from '../../src/components/BottomNavigation';
import { colors } from '../../src/theme/tokens';

// The glass navigation floats above the screens (content scrolls underneath it),
// so the tab bar is absolutely positioned and scenes use the full height.
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <BottomNavigation />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: 'absolute' },
        sceneStyle: { backgroundColor: colors.white },
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
