import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import NavigationButtons from '../components/NavigationButtons';
import styles from '../styles/MenuDetailsStyles';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import KeepAwakeToggle from '../components/KeepAwakeToggle';
import TranslationService from '../TranslationService'; 

const MenuDetails = ({ route }) => {
  const { recipe } = route.params;
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [translatedRecipe, setTranslatedRecipe] = useState(recipe);
  const currentLanguage = i18n.language;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTranslatedRecipe = async () => {
      if (currentLanguage === 'hr') {
        try {
          const translated = await TranslationService.translateRecipe(recipe, currentLanguage);
          setTranslatedRecipe(translated);
        } catch (error) {
          console.error('Error translating recipe:', error);
          Alert.alert('Error', 'Failed to translate recipe.');
        }
      } else {
        setTranslatedRecipe(recipe); 
      }
    };
  
    fetchTranslatedRecipe();
  }, [recipe, currentLanguage]);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name.toUpperCase() }));
      categoriesData.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const handleSaveRecipe = async () => {
    if (!selectedCategory) {
      Alert.alert(t('error'), t('selectCategoryError'));
      return;
    }

    try {
      await addDoc(collection(db, 'recipes'), {
        title: translatedRecipe.title,
        image: translatedRecipe.image,
        preparationTime: getPreparationTime(translatedRecipe.readyInMinutes),
        servings: translatedRecipe.servings,
        ingredients: translatedRecipe.extendedIngredients.map(ing => ing.original),
        steps: translatedRecipe.instructions.replace(/<\/?(table|tr|td|p|div|br|strong|em|span|ul|li|ol)[^>]*>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .split('\n')
          .filter(line => line.trim() !== ''),
        notes: translatedRecipe.notes || '',
        category: selectedCategory.id,
        user: currentUser.uid,
      });

      Alert.alert(t('success'), t('recipeSaved'));
      setModalVisible(false);
    } catch (error) {
      Alert.alert(t('error'), t('savingRecipeFailed'));
      console.error("Error saving recipe:", error);
    }
  };

  const getPreparationTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}m`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4D4E53" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{translatedRecipe.title}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
          <Ionicons name="bookmark-outline" size={24} color="#4D4E53" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('selectCategory')}</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => {
                    setSelectedCategory(item);
                  }}
                >
                  <Text style={[
                    styles.categoryText, 
                    selectedCategory?.id === item.id && styles.selectedCategoryText
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={() => (
                <TouchableOpacity
                  style={styles.addCategoryFooter}
                  onPress={() => {
                    setModalVisible(false);
                    setIsAddCategoryModalVisible(true);
                  }}
                >
                  <Text style={styles.addCategoryText}>{t('addNewCategory')}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
                <Text style={styles.saveButtonText}>{t('saveRecipe')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: translatedRecipe.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={18} color="#4D4E53" />
            <Text style={styles.infoText}>{translatedRecipe.servings}</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={18} color="#4D4E53" />
            <Text style={styles.infoText}>{getPreparationTime(translatedRecipe.readyInMinutes)}</Text>
          </View>
        </View>
        <KeepAwakeToggle />
        <Text style={styles.sectionTitle}>{t('ingredients')}:</Text>
        {translatedRecipe.extendedIngredients.length > 0 ? (
          translatedRecipe.extendedIngredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredient}>
              <Text style={styles.text}>
                {ingredient.original}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.info}>{t('no_ingredients_available')}</Text>
        )}
        <Text style={styles.sectionTitle}>{t('steps')}:</Text>
        <View style={styles.steps}>
          {translatedRecipe.instructions ? 
            translatedRecipe.instructions.split('\n').filter(line => line.trim() !== '').map((line, index) => (
              <Text key={index} style={styles.text}>{line.trim()}</Text>
            )) : 
            <Text style={styles.info}>{t('no_instructions_available')}</Text>}
        </View>

        {translatedRecipe.notes && (
          <>
            <Text style={styles.sectionTitle}>{t('notes')}:</Text>
            <Text style={styles.notes}>{translatedRecipe.notes}</Text>
          </>
        )}
      </ScrollView>

      <NavigationButtons navigation={navigation} />
    </View>
  );
};

export default MenuDetails;
