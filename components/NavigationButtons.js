import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import styles from '../styles/NavigationButtonsStyles';

const NavigationButtons = ({ navigation }) => {
  const { t } = useTranslation();
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert(t('signOutMessage'));
      navigation.replace('Home');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert(t('error'), t('signOutError'));
    }
  };

  return (
    <View style={styles.navigationButtons}>
      <TouchableOpacity onPress={() => navigation.navigate('Categories')} style={styles.navButton}>
        <Ionicons name="home" size={24} color="#333" />
        <Text style={styles.navButtonText}>{t('home')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('DailyMenu')} style={styles.navButton}>
        <Ionicons name="fast-food" size={24} color="#333" />
        <Text style={styles.navButtonText}>{t('dailyMenu')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('IngredientSearch')} style={styles.navButton}>
        <Ionicons name="nutrition" size={24} color="#333" />
        <Text style={styles.navButtonText}>{t('ingredients')}</Text>
      </TouchableOpacity>
      <LanguageSwitcher />
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.navButton}>
        <Ionicons name="person" size={24} color="#333" />
        <Text style={styles.navButtonText}>{t('profile')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={styles.navButton}>
        <Ionicons name="log-out" size={24} color="#333" />
        <Text style={styles.navButtonText}>{t('logout')}</Text>
      </TouchableOpacity>
     
    </View>
  );
};

export default NavigationButtons;
