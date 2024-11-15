import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, ImageBackground, Modal, TextInput } from 'react-native';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../UserContext';
import NavigationButtons from '../components/NavigationButtons';
import styles from '../styles/CategoryListScreenStyles';
import { useFocusEffect } from '@react-navigation/native';

const NavScreen = ({ navigation }) => {
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const fetchCategories = async () => {
    try {
      const categoriesCollection = collection(db, 'categories');
      const snapshot = await getDocs(categoriesCollection);
      const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name.toUpperCase() }));
      categoriesData.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);  
      fetchCategories();
      return () => {
        setLoading(false);
      };
    }, [])
  );

  const handleAddCategory = async () => {
    const categoryToAdd = newCategory.trim().toUpperCase();
    const categoryExists = categories.some(cat => cat.name === categoryToAdd);

    if (newCategory.trim() === '') {
      alert("Category name cannot be empty.");
      return;
    }

    if (categoryExists) {
      alert("This category already exists.");
      return;
    }

    try {
      const categoriesCollection = collection(db, 'categories');
      await addDoc(categoriesCollection, { name: categoryToAdd });
      setCategories((prevCategories) => [...prevCategories, { id: newCategory, name: categoryToAdd }].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategory('');
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#E2DDD9" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('../assets/background.png')} style={styles.background}>
      <View style={styles.headerSection}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>

      <ScrollView contentContainerStyle={styles.categoryList}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.addButton}
            onPress={() => navigation.navigate('Recipes', { categoryName: category.name, categoryId: category.id, userId: user.uid })}
          >
            <Text style={styles.addButtonText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter New Category Name:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setNewCategory}
              value={newCategory}
              placeholder="Category Name"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButtonModal} onPress={handleAddCategory}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <NavigationButtons navigation={navigation} />
    </ImageBackground>
  );
};



export default NavScreen;
