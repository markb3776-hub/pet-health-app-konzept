/**
 * ScreenBackground – fixierter grüner Gradient + Blasen Hintergrund
 *
 * Verwendet ImageBackground mit position: absolute um sicherzustellen,
 * dass der Hintergrund NICHT mitscrollt, egal ob der Screen
 * ScrollView, FlatList oder kein Scrolling verwendet.
 *
 * Nutzung:
 *   <ScreenBackground>
 *     <ScrollView ...>...</ScrollView>
 *   </ScreenBackground>
 */
import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

const bgImage = require('../../assets/app-background.png');

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

export default function ScreenBackground({ children }: ScreenBackgroundProps) {
  return (
    <View style={styles.root}>
      <ImageBackground
        source={bgImage}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
