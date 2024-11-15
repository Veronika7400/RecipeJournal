import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import styles from '../styles/StartScreenStyles';

const StartScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3000);

    return () => clearTimeout(timer); a
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

    </View>
  );
};

export default StartScreen;
