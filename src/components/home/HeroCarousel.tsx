import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: W, height: H } = Dimensions.get('window');

const IMAGES = [
  require('../../../assets/hero-1.jpg'),
  require('../../../assets/hero-2.jpg'),
  require('../../../assets/hero-3.jpg'),
  require('../../../assets/hero-4.jpg'),
];

const DISPLAY_DURATION = 4500; // ms each slide is fully visible
const FADE_DURATION    = 1400; // ms crossfade

interface HeroCarouselProps {
  style?: ViewStyle;
}

export default function HeroCarousel({ style }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [next,    setNext]    = useState(1);

  // Opacity of the "next" layer fading in over "current"
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  // Subtle zoom (Ken Burns) on the current image
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let cancelled = false;

    const cycle = () => {
      if (cancelled) return;

      // Reset incoming opacity and start slow zoom on current
      fadeAnim.setValue(0);
      scaleAnim.setValue(1);

      Animated.timing(scaleAnim, {
        toValue: 1.06,
        duration: DISPLAY_DURATION + FADE_DURATION,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        if (cancelled) return;

        // Crossfade next image in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (!finished || cancelled) return;
          // Swap layers
          setCurrent(c => {
            const nc = (c + 1) % IMAGES.length;
            setNext((nc + 1) % IMAGES.length);
            return nc;
          });
          cycle();
        });
      }, DISPLAY_DURATION);

      return () => clearTimeout(timer);
    };

    const cleanup = cycle();
    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* Bottom layer — current image with Ken Burns zoom */}
      <Animated.Image
        source={IMAGES[current]}
        style={[styles.image, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="cover"
      />

      {/* Top layer — next image fading in */}
      <Animated.Image
        source={IMAGES[next]}
        style={[styles.image, styles.overlay, { opacity: fadeAnim }]}
        resizeMode="cover"
      />

      {/* Gradient overlays — top darkening for header legibility */}
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']}
        style={[StyleSheet.absoluteFill, { height: '45%' }]}
        pointerEvents="none"
      />

      {/* Bottom gradient — fades into the booking sheet */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(10,10,10,0.6)', 'rgba(10,10,10,0.98)']}
        style={styles.bottomGrad}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#0a0a0a',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  bottomGrad: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '55%',
  },
});
