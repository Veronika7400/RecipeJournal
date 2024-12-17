import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/IngredientSearchStyles';
import { useTranslation } from 'react-i18next';

const FirestoreSearch = ({ ingredientsArray, strictMode, activeTab }) => {
  const navigation = useNavigation();
  const [firestoreRecipes, setFirestoreRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();  

  const fetchMatchingIngredients = async (ingredientsArray) => {
    const ingredientsRef = collection(db, 'ingredients');
    const existingIngredients = [];

    for (const ingredient of ingredientsArray) {
      const lowercasedIngredient = ingredient.toLowerCase();
      const capitalizedIngredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1).toLowerCase();

      const queries = [
        query(ingredientsRef, where('name', '==', lowercasedIngredient)),
        query(ingredientsRef, where('name', '==', capitalizedIngredient))
      ];

      for (const q of queries) {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(doc => {
          const ingredientData = doc.data();
          if (!existingIngredients.includes(ingredientData.name)) {
            existingIngredients.push(ingredientData.name);
          }
        });
      }
    }
    return existingIngredients;
  };

  const fetchRecipesByIngredients = async (existingIngredients) => {
    const recipesRef = collection(db, 'recipes');
    const recipesSnapshot = await getDocs(recipesRef);

    const matchingRecipes = [];

    recipesSnapshot.forEach(doc => {
      const recipeData = doc.data();
      const recipeIngredients = recipeData.ingredients || [];

      if (strictMode) {
        const hasAllIngredients = existingIngredients.every(ingredient =>
          recipeIngredients.some(ingredientObj => ingredientObj?.name?.trim() === ingredient)
        );
        if (hasAllIngredients) {
          matchingRecipes.push({ id: doc.id, ...recipeData });
        }
      } else {
        const hasAnyIngredient = recipeIngredients.some(ingredientObj =>
          existingIngredients.includes(ingredientObj?.name?.trim())
        );
        if (hasAnyIngredient) {
          matchingRecipes.push({ id: doc.id, ...recipeData });
        }
      }
    });

    return matchingRecipes;
  };

  const searchFirestore = async () => {
    setLoading(true);
    try {
      const existingIngredients = await fetchMatchingIngredients(ingredientsArray);

      if (existingIngredients.length === 0) {
        Alert.alert(t('warning'), t('no_ingredients_found'));
        setLoading(false);
        return;
      }

      const matchingRecipes = await fetchRecipesByIngredients(existingIngredients);

      if (matchingRecipes.length === 0) {
        Alert.alert(t('result'), t('no_recipes_found'));
        setFirestoreRecipes([]);
      } else {
        setFirestoreRecipes(matchingRecipes);
      }
    } catch (error) {
      Alert.alert(t('error'), t('fetch_error'));
      console.error('Error during search:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToRecipeDetails = (recipe) => {
    navigation.navigate('RecipeDetails', { recipe });
  };

  React.useEffect(() => {
    if (ingredientsArray.length > 0) {
      searchFirestore();
    }
  }, [ingredientsArray.join(','), strictMode]);

  return (
    <View style={[
      styles.container,
      activeTab === 'Firestore' && styles.activeContentBackground
    ]}>
      {loading ? (
        <Text style={styles.loadingText}>{t('searching')}</Text>
      ) : firestoreRecipes.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {firestoreRecipes.map(recipe => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard} onPress={() => navigateToRecipeDetails(recipe)}>
              <Image
                source={recipe.image ? { uri: recipe.image } : require('../assets/placeholder-image.png')}
                style={styles.recipeImage}
              />
              <View style={styles.recipeDetails}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <View style={styles.recipeInfoContainer}>
                  <View style={styles.timeContainer}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.recipeInfo}>{recipe.preparationTime}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    {Array.from({ length: recipe.rating }, (_, index) => (
                      <Ionicons key={index} name="star" size={16} color="#FFD700" />
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('no_recipes_found')}</Text>
          <Text style={styles.emptySubtext}>{t('try_other_ingredients')}</Text>
        </View>
      )}
    </View>
  );
};

export default FirestoreSearch;
