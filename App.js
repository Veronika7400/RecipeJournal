import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './UserContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import StartScreen from './components/StartScreen';
import LoginScreen from './components/LoginScreen';
import CategoryListScreen from './components/CategoryListScreen';
import RecipeListScreen from './components/RecipeListScreen';
import AddRecipeScreen from './components/AddRecipeScreen';
import RecipeDetails from './components/RecipeDetails';
import ProfileScreen from './components/ProfileScreen';
import EditRecipe from './components/EditRecipeScreen';
import DailyMenu from './components/DailyMenu';
import MenuDetails from './components/MenuDetails';
import IngredientSearch from './components/IngredientSearch';

const Stack = createStackNavigator();


const App = () => {
  return (
    <UserProvider>
       <I18nextProvider i18n={i18n}>
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
          <Stack.Screen
            name="DailyMenu"
            component={DailyMenu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MenuDetails"
            component={MenuDetails}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="IngredientSearch"
            component={IngredientSearch}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>

 
    </UserProvider>
  );
};

export default App;
