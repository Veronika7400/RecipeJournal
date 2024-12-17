import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/DailyMenuStyles';
import NavigationButtons from '../components/NavigationButtons';
import { useTranslation } from 'react-i18next';
import TranslationService from '../TranslationService';

const DailyMenu = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const apiKey = 'a5f8568c248e4daf9338a69214e80b7c';
  const currentLanguage = i18n.language;

  const fetchRecipeByTag = async (tag) => {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&tags=${tag}`
    );
    const data = await response.json();
    return data.recipes[0];
  };

  const generateMenu = async () => {
    try {
      const appetizer = await fetchRecipeByTag('appetizer');
      const mainCourse = await fetchRecipeByTag('main course');
      const dessert = await fetchRecipeByTag('dessert');
      const newMenu = {
        appetizer: { ...appetizer, originalTitle: appetizer.title },
        mainCourse: { ...mainCourse, originalTitle: mainCourse.title },
        dessert: { ...dessert, originalTitle: dessert.title },
        date: new Date().toDateString(),
      };
      await AsyncStorage.setItem('dailyMenu', JSON.stringify(newMenu));
      return newMenu;
    } catch (err) {
      throw new Error(t('failedToLoadMenu'));
    }
  };

  const loadMenu = async () => {
    try {
      setLoading(true);
      const storedMenu = await AsyncStorage.getItem('dailyMenu');
      if (storedMenu) {
        const parsedMenu = JSON.parse(storedMenu);
        
        if (parsedMenu.date === new Date().toDateString()) {
          if (currentLanguage === 'hr') {
            try {
              const translatedAppetizer = await TranslationService.translateText(parsedMenu.appetizer.title, 'hr');
              const translatedMainCourse = await TranslationService.translateText(parsedMenu.mainCourse.title, 'hr');
              const translatedDessert = await TranslationService.translateText(parsedMenu.dessert.title, 'hr');
  
              parsedMenu.appetizer.title = translatedAppetizer || parsedMenu.appetizer.originalTitle;
              parsedMenu.mainCourse.title = translatedMainCourse || parsedMenu.mainCourse.originalTitle;
              parsedMenu.dessert.title = translatedDessert || parsedMenu.dessert.originalTitle;
            } catch (err) {
              console.warn('Translation failed, using original titles.');
            }
          } else {
            parsedMenu.appetizer.title = parsedMenu.appetizer.originalTitle || parsedMenu.appetizer.title;
            parsedMenu.mainCourse.title = parsedMenu.mainCourse.originalTitle || parsedMenu.mainCourse.title;
            parsedMenu.dessert.title = parsedMenu.dessert.originalTitle || parsedMenu.dessert.title;
          }

          setMenu(parsedMenu); 
          return;
        }
      }
      
      const newMenu = await generateMenu();
      setMenu(newMenu);
    } catch (err) {
      setError(t('failedToLoadMenu'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    loadMenu();
  }, [currentLanguage]); 

  const handleRecipeClick = (recipe) => {
    navigation.navigate('MenuDetails', { recipe });
  };

  const getImageUri = (uri) => {
    return uri ? { uri } : require('../assets/placeholder-image.png');
  };

  const getPreparationTime = (recipe) => {
    const minutes = recipe.readyInMinutes;
    if (minutes === undefined || minutes === null) {
      return 'N/A';
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#E2DDD9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('dailyMenu')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {menu && menu.appetizer && (
          <TouchableOpacity style={styles.recipeCard} onPress={() => handleRecipeClick(menu.appetizer)}>
            <Image
              source={getImageUri(menu.appetizer.image)}
              style={styles.recipeImage}
            />
            <View style={styles.recipeDetails}>
              <Text style={styles.recipeTitle}>{menu.appetizer.title}</Text>
              <View style={styles.recipeInfoContainer}>
              <Text style={styles.recipeInfo}>{t('appetizer')}</Text>
                <View style={styles.timeContainer}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.recipeInfo}>{getPreparationTime(menu.appetizer)}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {menu && menu.mainCourse && (
          <TouchableOpacity style={styles.recipeCard} onPress={() => handleRecipeClick(menu.mainCourse)}>
            <Image
              source={getImageUri(menu.mainCourse.image)}
              style={styles.recipeImage}
            />
            <View style={styles.recipeDetails}>
              <Text style={styles.recipeTitle}>{menu.mainCourse.title}</Text>
              <View style={styles.recipeInfoContainer}>
              <Text style={styles.recipeInfo}>{t('mainCourse')}</Text>
                <View style={styles.timeContainer}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.recipeInfo}>{getPreparationTime(menu.mainCourse)}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {menu && menu.dessert && (
          <TouchableOpacity style={styles.recipeCard} onPress={() => handleRecipeClick(menu.dessert)}>
            <Image
              source={getImageUri(menu.dessert.image)}
              style={styles.recipeImage}
            />
            <View style={styles.recipeDetails}>
              <Text style={styles.recipeTitle}>{menu.dessert.title}</Text>
              <View style={styles.recipeInfoContainer}>
              <Text style={styles.recipeInfo}>{t('dessert')}</Text>
                <View style={styles.timeContainer}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.recipeInfo}>{getPreparationTime(menu.dessert)}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
      <NavigationButtons navigation={navigation} />
    </View>
  );
};

export default DailyMenu;
