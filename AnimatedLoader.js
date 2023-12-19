// AnimatedLoader.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const AnimatedLoader = ({ loading }) => {
  const line1ScaleValue = new Animated.Value(0);
  const line2ScaleValue = new Animated.Value(0);
  const line3ScaleValue = new Animated.Value(0);

  useEffect(() => {
    let isMounted = true;

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          createPumpingAnimation(line1ScaleValue),
          Animated.delay(200), // Adjust the delay as needed
          createPumpingAnimation(line2ScaleValue),
          Animated.delay(200), // Adjust the delay as needed
          createPumpingAnimation(line3ScaleValue),
        ]),
        { iterations: loading ? -1 : 0 }
      ).start();
    };

    if (isMounted && loading) {
      startAnimation();
    }

    return () => {
      isMounted = false;
    };
  }, [loading, line1ScaleValue, line2ScaleValue, line3ScaleValue]);

  const createPumpingAnimation = (scaleValue) => {
    return Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 60, // Smaller duration for faster scaling up
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
        frame: 90, // Increase frame rate for smoother animation
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 80, // Smaller duration for faster scaling down
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
        frame: 440, // Increase frame rate for smoother animation
      }),
    ]);
  };

  const renderLine = (scaleValue) => {
    const scale = scaleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2],
    });

    return (
      <Animated.View style={[styles.verticalLine, { transform: [{ scaleY: scale }] }]} />
    );
  };

  return loading ? (
    <View style={styles.overlay}>
      <View style={styles.loaderContainer}>
        {renderLine(line1ScaleValue)}
        {renderLine(line2ScaleValue)}
        {renderLine(line3ScaleValue)}
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalLine: {
    backgroundColor: '#FFC000',
    width: 12,
    height: 35,
    marginHorizontal: 5,
  },
});

export default AnimatedLoader;
