import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/IngredientSearchStyles';
import FirestoreSearch from './FirestoreSearch';
import SpoonacularSearch from './SpoonacularSearch';
import NavigationButtons from '../components/NavigationButtons';
import { useTranslation } from 'react-i18next';

const IngredientSearch = () => {
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [ingredientsArray, setIngredientsArray] = useState([]);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Firestore'); 
  const navigation = useNavigation();
  const { t } = useTranslation();
  const handleSearch = () => {
    const ingredients = ingredientsInput
      .split(',')
      .map((ing) => ing.trim())
      .filter((ing) => ing.length > 0);
    setIngredientsArray(ingredients);
    setTriggerSearch(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('recipe_search')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('enter_ingredients')} 
          value={ingredientsInput}
          onChangeText={setIngredientsInput}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>{t('search')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
      <Text style={styles.toggleLabel}>{t('recipe_contains_all_ingredients')}:</Text>
        <Switch
          value={strictMode}
          onValueChange={() => setStrictMode(prev => !prev)}
          trackColor={{ false: "#D9D0C5", true: "#D9D0C5" }}  
          thumbColor={strictMode ? "#CFC8C3" : "#CFC8C3"} 
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Firestore' && styles.activeTab]}
          onPress={() => setActiveTab('Firestore')}
        >
          <Text style={[styles.tabText, activeTab === 'Firestore' && styles.activeTabText]}>
          {t('firestore_search')} 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Spoonacular' && styles.activeTab]}
          onPress={() => setActiveTab('Spoonacular')}
        >
          <Text style={[styles.tabText, activeTab === 'Spoonacular' && styles.activeTabText]}>
          {t('spoonacular_search')} 
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {triggerSearch && ingredientsArray.length > 0 && (
        activeTab === 'Firestore' ? (
           <FirestoreSearch ingredientsArray={ingredientsArray} strictMode={strictMode} activeTab={activeTab} />
        ) : (
          <SpoonacularSearch ingredientsArray={ingredientsArray} strictMode={strictMode} activeTab={activeTab} />
        )
      )}
      </ScrollView>

<NavigationButtons 
    style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} 
    navigation={navigation} 
  />
    </View>
  );
};

export default IngredientSearch;
