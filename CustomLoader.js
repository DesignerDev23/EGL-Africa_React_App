// CustomLoader.js
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

const CustomLoader = ({ isVisible }) => (
  <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0.5}>
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#009688" />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomLoader;
