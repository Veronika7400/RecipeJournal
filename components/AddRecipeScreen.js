import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, FlatList, Modal, ImageBackground, Image } from 'react-native';
import { collection, addDoc, getDocs, snapshotEqual } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationButtons from '../components/NavigationButtons';
import styles from '../styles/AddRecipeScreenStyles';

const AddRecipeScreen = ({ navigation, route }) => {
  const { categoryId, userId } = route.params;

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [imageUpload, setImageUpload] = useState();
  const [prepHours, setPrepHours] = useState('0');
  const [prepMinutes, setPrepMinutes] = useState('0');
  const [rating, setRating] = useState(1);
  const [servings, setServings] = useState('');
  const [steps, setSteps] = useState('');
  const [note, setNote] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openIngredientModal = () => setIsModalVisible(true);
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

  const handleRemoveIngredient = (ingredientId) => {
    setRecipeIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    );
  };

  const handleAddNewIngredient = async () => {
    if (!newIngredient) {
      Alert.alert('Error', 'Please enter the name of the new ingredient.');
      return;
    }

    try {
      const newIngredientRef = await addDoc(collection(db, 'ingredients'), { name: newIngredient });
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
      Alert.alert('Error', 'Adding ingredient failed. Try again.');
      console.error("Error adding ingredient: ", error);
    }
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

  const handleSaveRecipe = async () => {
    const prepHoursValue = parseInt(prepHours, 10) || 0;
    const prepMinutesValue = parseInt(prepMinutes, 10) || 0;
    const preparationTime = `${prepHoursValue}h ${prepMinutesValue}m`;

    if (!title || (prepHoursValue === 0 && prepMinutesValue === 0) || rating < 1 || rating > 5 || !servings || !steps || recipeIngredients.length === 0) {
      Alert.alert('Error', 'Fill in all fields except for notes and add at least one ingredient.');
      return;
    }

    let imageUrl = '';
    if (imageUpload) {
      imageUrl = await uploadImageToFirebase(imageUpload, image.name);
    }

    try {
      await addDoc(collection(db, 'recipes'), {
        title,
        image: imageUrl,
        preparationTime,
        rating,
        servings: parseInt(servings),
        steps,
        note,
        category: categoryId,
        user: userId,
        ingredients: recipeIngredients,
      });

      Alert.alert('Success', 'Recipe added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Saving recipe failed. Try again.');
      console.error("Error adding recipe: ", error);
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
      return '';
    }
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

            {image.uri ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image.uri }} style={styles.recipeImage} />
                <TouchableOpacity onPress={() => setImage({})} style={styles.removeImageButton}>
                  <Ionicons name="trash" size={20} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text>No image selected</Text>
            )}
            
            <View style={styles.imageButtons}>
              <TouchableOpacity
                style={[styles.galleryButton]}
                onPress={handleImagePick}>
                <Ionicons name="image" size={30} color="#000" />
                <Text style={styles.addButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cameraButton]}
                onPress={handleImageCapture}>
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
                onValueChange={(itemValue) => setPrepHours(parseInt(itemValue, 10))}
                style={styles.timePicker}
              >
                {[...Array(25).keys()].map((hour) => (
                  <Picker.Item key={hour} label={`${hour} h`} value={hour} />
                ))}
              </Picker>
              <Picker
                selectedValue={prepMinutes}
                onValueChange={(itemValue) => setPrepMinutes(parseInt(itemValue, 10))}
                style={styles.timePicker}
              >
                {[...Array(60).keys()].map((minute) => (
                  <Picker.Item key={minute} label={`${minute} min`} value={minute} />
                ))}
              </Picker>
            </View>
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
              <Picker.Item label="Select ingredient" value="" />
              {ingredientsList.map((ingredient) => (
                <Picker.Item key={ingredient.id} label={ingredient.name} value={ingredient.id} />
              ))}
              <Picker.Item label="Add new ingredient" value="new" />
            </Picker>

            <Text style={styles.label}>Quantity</Text>
            <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} placeholder="Enter quantity" />
            <Text style={styles.label}>Unit</Text>
            <TextInput style={styles.input} value={unit} onChangeText={setUnit} placeholder="Enter unit" />

            <TouchableOpacity style={styles.addButton} onPress={handleAddIngredientToRecipe}>
              <Text style={styles.addButtonText}>Add Ingredient</Text>
            </TouchableOpacity>

            <FlatList
             data={recipeIngredients} 
              keyExtractor={(item) => `${item.id}-${item.name}`}
              renderItem={({ item }) => (
                <View style={styles.ingredientItem}>
                  <View style={styles.ingredientContent}>
                    <Text>{`${item.quantity} ${item.unit} ${item.name}`}</Text>
                    <TouchableOpacity
                      style={styles.removeIcon}
                      onPress={() => handleRemoveIngredient(item.id)}
                    >
                      <Ionicons name="trash" size={20} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              style={styles.ingredientList}
            />
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
              placeholder="Enter preparation steps"
              multiline
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
              placeholder="Enter note"
              multiline
            />
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
                  value={servings}
                  onChangeText={setServings}
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
      case 'saveButton':
        return (
          <View style={styles.container}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
              <Text style={styles.saveButtonText}>Save recipe</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const formData = [
    { key: 'title', type: 'title' },
    { key: 'image', type: 'image' },
    { key: 'prepTime', type: 'prepTime' },
    { key: 'ingredients', type: 'ingredients' },
    { key: 'steps', type: 'steps' },
    { key: 'note', type: 'note' },
    { key: 'servingsAndRating', type: 'servingsAndRating' },
    { key: 'saveButton', type: 'saveButton' },
  ];

  return (
    <ImageBackground source={require('../assets/AddBackground.png')} style={styles.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Recipe</Text>
      </View>

      <FlatList
        data={formData}
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
    </ImageBackground>
  );
};

export default AddRecipeScreen;