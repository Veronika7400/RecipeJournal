import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
      .then(() => setDropdownVisible(false)) 
      .catch((error) => console.error("Error changing language:", error));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setDropdownVisible(!isDropdownVisible)} style={styles.navButton}>
        <Ionicons name="globe-outline" size={24} color="#333" />
        <Text style={styles.navButtonText}>{t('language')}</Text>
      </TouchableOpacity>

      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => changeLanguage('en')} style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>{t('english')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage('hr')} style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>{t('croatian')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    bottom: 60, 
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000, 
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});

export default LanguageSwitcher;
