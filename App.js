import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { UserProvider } from './UserContext';

import StartScreen from './components/StartScreen';
import LoginScreen from './components/LoginScreen';
import CategoryListScreen from './components/CategoryListScreen';
import RecipeListScreen from './components/RecipeListScreen';
import AddRecipeScreen from './components/AddRecipeScreen';
import RecipeDetails from './components/RecipeDetails';
import ProfileScreen from './components/ProfileScreen';
import EditRecipe from './components/EditRecipeScreen';

const Stack = createStackNavigator();


const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen
            name="Start"
            component={StartScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Categories"
            component={CategoryListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Recipes"
            component={RecipeListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddRecipe"
            component={AddRecipeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RecipeDetails"
            component={RecipeDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Nav"
            component={CategoryListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditRecipe"
            component={EditRecipe}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 50,
    width: 50,
    marginLeft: 10,
  },
});

export default App;
