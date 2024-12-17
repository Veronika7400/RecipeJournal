import AsyncStorage from '@react-native-async-storage/async-storage';

class TranslationService {
  static async getTranslatedRecipe(recipeId, language) {
    try {
      const storedRecipe = await AsyncStorage.getItem(`${recipeId}-${language}`);
      return storedRecipe ? JSON.parse(storedRecipe) : null;
    } catch (error) {
      console.error('Error retrieving translated recipe:', error);
      return null;
    }
  }

  static async saveTranslatedRecipe(recipeId, language, translatedRecipe) {
    try {
      await AsyncStorage.setItem(
        `${recipeId}-${language}`,
        JSON.stringify(translatedRecipe)
      );
    } catch (error) {
      console.error('Error saving translated recipe:', error);
    }
  }

  static async translateRecipe(recipe, language) {
    const cachedRecipe = await this.getTranslatedRecipe(recipe.id, language);
    if (cachedRecipe) {
      console.log('Using cached translation.');
      return cachedRecipe;
    }

    try {
      const translatedRecipe = await this.translateFullRecipe(recipe, language);
      await this.saveTranslatedRecipe(recipe.id, language, translatedRecipe);
      return translatedRecipe;
    } catch (error) {
      console.error('Error translating recipe:', error);
      return recipe; // Vraćamo originalni recept u slučaju greške
    }
  }

  static async translateFullRecipe(recipe, language) {
    try {
      const translatedTitle = await this.translateArray([recipe.title], language);
      const translatedIngredients = await this.translateArray(
        recipe.extendedIngredients.map((ing) => ing.original),
        language
      );
      const translatedInstructions = recipe.instructions
        ? await this.translateArray(
            recipe.instructions
              .replace(/<[^>]+>/g, '') // Uklanja HTML tagove
              .split('\n')
              .filter((line) => line.trim() !== ''),
            language
          )
        : [];

      return {
        ...recipe,
        title: translatedTitle[0],
        extendedIngredients: recipe.extendedIngredients.map((ing, index) => ({
          ...ing,
          original: translatedIngredients[index],
        })),
        instructions: translatedInstructions.join('\n'),
      };
    } catch (error) {
      console.error('Error translating full recipe:', error);
      throw error;
    }
  }

  static async translateArray(array, language) {
    const apiKey = '223a10fd6b453eaea40f'; // Tvoj API ključ
    const url = 'https://api.mymemory.translated.net/get';

    try {
      const translatedArray = await Promise.all(
        array.map(async (item) => {
          if (!item) return '';

          const response = await fetch(
            `${url}?q=${encodeURIComponent(item)}&langpair=en|${language}&key=${apiKey}`
          );

          if (!response.ok) {
            console.error('Network response was not ok:', response.status);
            return item;
          }

          const data = await response.json();
          if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
            console.error('Translation Error:', data.responseDetails);
            return item;
          }

          return data.responseData.translatedText;
        })
      );
      return translatedArray;
    } catch (error) {
      console.error('Error translating array:', error);
      return array; 
    }
  }

  static async getTranslatedItem(item, language) {
    try {
      const storedItem = await AsyncStorage.getItem(`${item}-${language}`);
      return storedItem ? JSON.parse(storedItem) : null;
    } catch (error) {
      console.error('Error retrieving translated item:', error);
      return null;
    }
  }

  static async saveTranslatedItem(item, language, translatedItem) {
    try {
      await AsyncStorage.setItem(`${item}-${language}`, JSON.stringify(translatedItem));
    } catch (error) {
      console.error('Error saving translated item:', error);
    }
  }

  static async translateIngredients(ingredientsArray, language) {
    try {
      const translatedIngredients = await Promise.all(
        ingredientsArray.map(async (ingredient) => {
          const cachedTranslation = await this.getTranslatedItem(ingredient, language);
          if (cachedTranslation) {
            console.log(`Using cached translation for ingredient: ${ingredient}`);
            return cachedTranslation;
          }

          const translatedIngredient = await this.translateText(ingredient, language);
          await this.saveTranslatedItem(ingredient, language, translatedIngredient);
          return translatedIngredient;
        })
      );
      return translatedIngredients;
    } catch (error) {
      console.error('Error translating ingredients:', error);
      return ingredientsArray; 
    }
  }

  static async translateText(text, language) {
    const apiKey = '223a10fd6b453eaea40f'; 
    const url = 'https://api.mymemory.translated.net/get';

    try {
      const response = await fetch(`${url}?q=${encodeURIComponent(text)}&langpair=en|${language}&key=${apiKey}`);
      const data = await response.json();
      if (data.responseStatus !== 200) {
        throw new Error(`Translation Error: ${data.responseDetails}`);
      }
      return data.responseData.translatedText;
    } catch (error) {
      console.error(`Error translating text "${text}":`, error);
      return text; 
    }
  }

 
  static async getTranslatedText(text, language) {
    const translationKey = `${text}_${language}`;
    
    try {
 
      const storedTranslation = await AsyncStorage.getItem(translationKey);
      if (storedTranslation) {
        return storedTranslation; 
      }

      const translatedText = await TranslationService.translateText(text, language);
      await AsyncStorage.setItem(translationKey, translatedText);
      return translatedText;

    } catch (error) {
      console.error(`Error fetching or saving translation for "${text}":`, error);
      return text; 
    }
  }
}

export default TranslationService;
