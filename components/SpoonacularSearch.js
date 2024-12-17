import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; 
import styles from '../styles/IngredientSearchStyles';
import TranslationService from '../TranslationService';

const SpoonacularSearch = ({ ingredientsArray, strictMode, activeTab }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiKey = 'a5f8568c248e4daf9338a69214e80b7c';
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const fetchRecipes = async (ingredientsArray) => {
    try {
      setLoading(true);

      const translatedIngredients = await TranslationService.translateIngredients(ingredientsArray, currentLanguage);
      const queryString = translatedIngredients.join(',');

      const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${queryString}&number=10&apiKey=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (data.length > 0) {
        const filteredRecipes = data.filter(recipe => {
          const recipeIngredients = recipe.usedIngredients.map(item => item.name.toLowerCase());
          if (strictMode) {
            return translatedIngredients.every(ingredient => recipeIngredients.includes(ingredient));
          } else {
            return recipeIngredients.some(ingredient => translatedIngredients.includes(ingredient));
          }
        });

        const translatedRecipes = await Promise.all(
          filteredRecipes.map(async (recipe) => {
            const translatedTitle = currentLanguage === 'hr' ? await TranslationService.translateText(recipe.title, currentLanguage) : recipe.title;
            return { ...recipe, title: translatedTitle };
          })
        );

        setRecipes(translatedRecipes);
      } else {
        Alert.alert(t('result'), t('noRecipesFound'));
        setRecipes([]);
      }
    } catch (error) {
      Alert.alert(t('error'), t('fetchFailed'));
      console.error('Error during search:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRecipeDetails = async (recipeId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipe details');
      }

      const recipeDetails = await response.json();
      navigation.navigate('MenuDetails', { recipe: recipeDetails });
    } catch (error) {
      Alert.alert(t('error'), t('fetchRecipeDetailsFailed'));
      console.error('Error fetching recipe details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ingredientsArray.length > 0) {
      fetchRecipes(ingredientsArray);
    }
  }, [ingredientsArray, strictMode]);


  return (
    <View style={[
      styles.container, 
      activeTab === 'Spoonacular' && styles.activeContentBackground
    ]}>
      {loading ? (
       <Text style={styles.loadingText}>{t('searching')}</Text> 
      ) : recipes.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {recipes.map((recipe) => (
            <TouchableOpacity 
              key={recipe.id} 
              style={styles.recipeCard}
              onPress={() => navigateToRecipeDetails(recipe.id)}  
            >
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeImage}
              />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <View style={styles.recipeDetail}>
                  <Ionicons name="close-circle" size={24} />
                  <Text style={styles.recipeDetails}>
                    {t('missingIngredients')}: {recipe.missedIngredientCount}
                  </Text>
                </View>
                <View style={styles.recipeDetail}>
                  <Ionicons name="heart" size={24} />
                  <Text style={styles.recipeDetails}>
                    {recipe.likes} 
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('noRecipesFound')}</Text> 
        </View>
      )}
    </View>
  );
};

export default SpoonacularSearch;
