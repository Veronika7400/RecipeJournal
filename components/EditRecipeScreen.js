import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, FlatList, Modal, Image } from 'react-native';
import { doc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationButtons from '../components/NavigationButtons';
import styles from '../styles/EditRecipeScreenStyles';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';



const EditRecipeScreen = ({ navigation, route }) => {
  const { recipe } = route.params;

  const [title, setTitle] = useState(recipe.title || '');
  const [image, setImage] = useState(recipe.image || '');
  const [imageUpload, setImageUpload] = useState(null);
  const [prepHours, setPrepHours] = useState('0');
  const [prepMinutes, setPrepMinutes] = useState('0');
  const [rating, setRating] = useState(recipe.rating || 1);
  const [servings, setServings] = useState(recipe.servings || '');
  const [steps, setSteps] = useState(recipe.steps || '');
  const [note, setNote] = useState(recipe.note || '');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState(recipe.ingredients || []);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openIngredientModal = () => {
    setIsModalVisible(true);
  };

  const closeIngredientModal = () => {
    setIsModalVisible(false);
    setNewIngredient('');
  };

  const fetchIngredients = async () => {
    const snapshot = await getDocs(collection(db, 'ingredients'));
    const ingredientsData = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
    }));
    ingredientsData.sort((a, b) => a.name.localeCompare(b.name));
    setIngredientsList(ingredientsData);
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (recipe.image) {
      setImage({ uri: recipe.image });
    }
  }, [recipe.image]);

  useEffect(() => {
    if (recipe.preparationTime) {
      const timeParts = recipe.preparationTime.match(/(\d+)h\s*(\d+)?m?/);
      if (timeParts) {
        const hours = timeParts[1] || '0';
        const minutes = timeParts[2] || '0';
        setPrepHours(hours);
        setPrepMinutes(minutes);
      }
    }
  }, [recipe.preparationTime]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const fileName = imageUri.split('/').pop();
      setImage({ uri: imageUri, name: fileName });
      setImageUpload(result.assets[0]);

      const response = await fetch(imageUri);
      const blob = await response.blob();
      setImageUpload(blob);
    }
  };

  const handleImageCapture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert("Permission required", "Camera permission is required to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const fileName = imageUri.split('/').pop();

      setImage({ uri: imageUri, name: fileName });
      setImageUpload(result.assets[0]);

      const response = await fetch(imageUri);
      const blob = await response.blob();
      setImageUpload(blob);
    }
  };

  const uploadImageToFirebase = async (imageBlob, imageName) => {
    try {
      const imageRef = ref(storage, `recipe_images/${imageName}`);
      await uploadBytes(imageRef, imageBlob);

      const downloadUrl = await getDownloadURL(imageRef);
      return downloadUrl;
    } catch (error) {
      Alert.alert("Error", "Image upload failed.");
      console.error("Error uploading image: ", error);
      return '';
    }
  };

  const handleEditRecipe = async () => {
    const prepHoursValue = parseInt(prepHours, 10) || 0;
    const prepMinutesValue = parseInt(prepMinutes, 10) || 0;
    const preparationTime = `${prepHoursValue}h ${prepMinutesValue}m`;

    if (!title || (prepHoursValue === 0 && prepMinutesValue === 0) || rating < 1 || rating > 5 || !servings || !steps || recipeIngredients.length === 0) {
      Alert.alert('Error', 'Fill in all fields except for the note, add at least one ingredient, and make sure the rating is between 1 and 5.');
      return;
    }

    try {
      let imageUrl = recipe.image;

      if (imageUpload) {
        if (recipe.image) {
          const imageName = recipe.image.split('%2F').pop().split('?')[0];
          const oldImageRef = ref(storage, `recipe_images/${imageName}`);

          await deleteObject(oldImageRef).catch((error) => {
            if (error.code !== 'storage/object-not-found') {
              console.warn("Error deleting old image:", error);
            } else {
              console.info("Old image not found in storage, skipping deletion.");
            }
          });
        }

        imageUrl = await uploadImageToFirebase(imageUpload, image.name);
      }else if (!image && recipe.image) {
        const imageName = recipe.image.split('%2F').pop().split('?')[0];
        const oldImageRef = ref(storage, `recipe_images/${imageName}`);
        await deleteObject(oldImageRef).catch((error) => {
          if (error.code !== 'storage/object-not-found') {
            console.warn("Error deleting old image:", error);
          }
        });
        imageUrl = '';
      }

      const recipeRef = doc(db, 'recipes', recipe.id);

      await updateDoc(recipeRef, {
        title,
        image: imageUrl,
        preparationTime,
        rating,
        servings: parseInt(servings),
        steps,
        note,
        ingredients: recipeIngredients,
      });

      Alert.alert('Success', 'Recipe successfully updated!');

      navigation.navigate('RecipeDetails', {
        recipe: {
          id: recipe.id,
          title,
          image: imageUrl,
          preparationTime,
          rating,
          servings: parseInt(servings),
          steps,
          note,
          ingredients: recipeIngredients,
        },
      });
    } catch (error) {
      console.error("Error updating recipe:", error);
      Alert.alert('Error', 'Failed to update the recipe. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    setImage('');
  };

  const handleAddNewIngredient = async () => {
    if (!newIngredient) {
      Alert.alert('Error', 'Enter the name of the new ingredient.');
      return;
    }

    try {
      const newIngredientRef = await addDoc(collection(db, 'ingredients'), { name: newIngredient });
      const ingredientId = newIngredientRef.id;

      setIngredientsList(prevIngredientsList => {
        const updatedList = [
          ...prevIngredientsList,
          { id: newIngredientRef.id, name: newIngredient }
        ];
        updatedList.sort((a, b) => a.name.localeCompare(b.name)); // Sortiranje po abecedi
        return updatedList;
      });
      
      Alert.alert('Success', 'New ingredient added!');
      closeIngredientModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to add ingredient. Please try again.');
    }
  };

  const handleRemoveIngredient = (ingredientId) => {
    setRecipeIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    );
  };

  const handleAddIngredientToRecipe = () => {
    if (!quantity || !unit || !selectedIngredient) {
      Alert.alert('Error', 'Select an ingredient, quantity, and unit.');
      return;
    }

    const ingredientToAdd = {
      id: selectedIngredient,
      name: ingredientsList.find(ing => ing.id === selectedIngredient).name,
      quantity,
      unit,
    };

    setRecipeIngredients([...recipeIngredients, ingredientToAdd]);
    setSelectedIngredient('');
    setQuantity('');
    setUnit('');
  };

  const renderFormItem = ({ item }) => {
    switch (item.type) {
      case 'title':
        return (
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Recipe Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />
          </View>
        );
        case 'image':
          return (
            <View style={styles.container}>
              <Text style={styles.sectionTitle}>Recipe Image</Text>
              
              {image && image.uri ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image.uri }} style={styles.recipeImage} />
                  <TouchableOpacity onPress={handleRemoveImage} style={styles.removeImageButton}>
                    <Ionicons name="trash" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text>No image selected</Text>
              )}
        
              <View style={styles.imageButtons}>
                <TouchableOpacity style={styles.galleryButton} onPress={handleImagePick}>
                  <Ionicons name="image" size={30} color="#000" />
                  <Text style={styles.addButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.cameraButton} onPress={handleImageCapture}>
                  <Ionicons name="camera" size={30} color="#000" />
                  <Text style={styles.addButtonText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          );        
      case 'prepTime':
        return (
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Preparation Time</Text>
            <View style={styles.rowContainer}>
              <Picker
                selectedValue={prepHours}
                onValueChange={(itemValue) => setPrepHours(itemValue.toString())}
                style={styles.timePicker}
              >
                {[...Array(25).keys()].map((hour) => (
                  <Picker.Item key={hour} label={`${hour} h`} value={hour.toString()} />
                ))}
              </Picker>
              <Picker
                selectedValue={prepMinutes}
                onValueChange={(itemValue) => setPrepMinutes(itemValue.toString())}
                style={styles.timePicker}
              >
                {[...Array(60).keys()].map((minute) => (
                  <Picker.Item key={minute} label={`${minute} min`} value={minute.toString()} />
                ))}
              </Picker>
            </View>
          </View>

        );
      case 'servingsAndRating':
        return (
          <View style={styles.container}>
            <View style={styles.rowContainer}>
              <View style={styles.halfContainer}>
                <Text style={styles.label}>Servings</Text>
                <TextInput
                  style={styles.input}
                  value={servings.toString()}
                  onChangeText={(value) => setServings(parseInt(value, 10) || 0)}
                  placeholder="Number of servings"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfContainer}>
                <Text style={styles.label}>Rating</Text>
                <Picker
                  selectedValue={rating}
                  onValueChange={(itemValue) => setRating(itemValue)}
                  style={styles.picker}
                >
                  {[1, 2, 3, 4, 5].map((ratingValue) => (
                    <Picker.Item key={ratingValue} label={`${ratingValue}`} value={ratingValue} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

        );
      case 'steps':
        return (
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Preparation Steps</Text>
            <TextInput
              style={[styles.input, styles.stepsInput]}
              value={steps}
              onChangeText={setSteps}
              multiline
              placeholder="Enter preparation steps"
            />
          </View>
        );
      case 'note':
        return (
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Note</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              value={note}
              onChangeText={setNote}
              multiline
              placeholder="Enter note"
            />
          </View>
        );
      case 'ingredients':
        return (
          <View style={styles.container}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Picker
              selectedValue={selectedIngredient}
              onValueChange={(itemValue) => {
                setSelectedIngredient(itemValue);
                if (itemValue === 'new') openIngredientModal();
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select an ingredient" value="" />
              {ingredientsList.map((ingredient) => (
                <Picker.Item key={ingredient.id} label={ingredient.name} value={ingredient.id} />
              ))}
              <Picker.Item label="Add new ingredient" value="new" />
            </Picker>

            <Text style={styles.label}>Quantity</Text>
            <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} placeholder="Enter quantity" />
            <Text style={styles.label}>Unit</Text>
            <TextInput style={styles.input} value={unit} onChangeText={setUnit} placeholder="Enter unit " />

            <TouchableOpacity style={styles.addButton} onPress={handleAddIngredientToRecipe}>
              <Text style={styles.addButtonText}>Add ingredient</Text>
            </TouchableOpacity>

            <FlatList
              data={recipeIngredients} 
              renderItem={({ item }) => (
                <View style={styles.ingredientItem}>
                  <View style={styles.ingredientContent}>
                    <Text>{item.name}: {item.quantity} {item.unit}</Text>
                    <TouchableOpacity
                      style={styles.removeIcon}
                      onPress={() => handleRemoveIngredient(item.id)}
                    >
                      <Ionicons name="trash" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              extraData={recipeIngredients}
            />
          </View>
        );
      case 'saveAndCancelButtons':
        return (
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleEditRecipe}>
                <Text style={styles.saveButtonText}>Save changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        );


      default:
        return null;
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit recipe</Text>
      </View>

      <FlatList
        data={[
          { key: 'title', type: 'title' },
          { key: 'image', type: 'image' },
          { key: 'prepTime', type: 'prepTime' },
          { key: 'ingredients', type: 'ingredients' },
          { key: 'steps', type: 'steps' },
          { key: 'note', type: 'note' },
          { key: 'servingsAndRating', type: 'servingsAndRating' },
          { key: 'saveAndCancelButtons', type: 'saveAndCancelButtons' },
        ]}
        renderItem={renderFormItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.scrollContainer}
        style={{ height: '100%' }}
      />

      <Modal animationType="slide"
        transparent={true}
        visible={isModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.sectionTitle}>Add New Ingredient</Text>
            <TextInput
              style={[styles.input, styles.fullWidthInput]}
              value={newIngredient}
              onChangeText={setNewIngredient}
              placeholder="New ingredient name"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeIngredientModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddNewIngredient}>
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <NavigationButtons navigation={navigation} />
    </View>
  );
};

export default EditRecipeScreen;