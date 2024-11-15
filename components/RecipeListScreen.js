import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, TextInput } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import NavigationButtons from '../components/NavigationButtons';
import styles from '../styles/RecipeListScreenStyles';
import { useFocusEffect } from '@react-navigation/native';

const RecipeListScreen = ({ route, navigation }) => {
  const { categoryName, categoryId, userId } = route.params;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const recipesCollection = collection(db, 'recipes');
      const snapshot = await getDocs(recipesCollection);
      const recipesData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(recipe => recipe.user === userId && recipe.category === categoryId);
      setRecipes(recipesData);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [userId, categoryId])
  );

  const handleAddRecipe = () => {
    navigation.navigate('AddRecipe', { userId, categoryId });
  };

  const navigateToRecipeDetails = (recipe) => {
    navigation.navigate('RecipeDetails', { recipe });
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Text style={styles.title}>{categoryName}</Text>
        <TouchableOpacity onPress={() => {/* Implement filter functionality */ }} style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search recipes..."
        value={searchTerm}
        onChangeText={handleSearch}
      />
      {filteredRecipes.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {filteredRecipes.map(recipe => (
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
          <Text style={styles.emptyText}>No recipes in this category.</Text>
          <Text style={styles.emptySubtext}>Add the first recipe by tapping +</Text>
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={handleAddRecipe}>
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
      <NavigationButtons navigation={navigation} />
    </View>
  );
};

export default RecipeListScreen;
