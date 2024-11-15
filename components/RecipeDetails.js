import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Alert, Modal } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import NavigationButtons from '../components/NavigationButtons';
import styles from '../styles/RecipeDetailsStyles';
import { deleteObject, ref } from 'firebase/storage';
import { useFocusEffect } from '@react-navigation/native';

const RecipeDetails = ({ route, navigation }) => {
    const { recipe } = route.params;

    const [ingredientsList, setIngredientsList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [loading, setLoading] = useState(true);
    const {
        title = '',
        image = '',
        preparationTime = '',
        servings = 0,
        rating = 0,
        ingredients = [],
        steps = '',
        note = '',
    } = recipe || {};

    const fetchIngredients = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'ingredients'));
            const allIngredients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const updatedIngredients = ingredients.map(recipeIngredient => {
                const fullIngredient = allIngredients.find(item => item.id === recipeIngredient.id);
                return fullIngredient
                    ? { ...fullIngredient, quantity: recipeIngredient.quantity, unit: recipeIngredient.unit }
                    : recipeIngredient;
            });

            setIngredientsList(updatedIngredients);
        } catch (error) {
            console.error("Error fetching ingredients: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, [ingredients]);

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            fetchIngredients();
            return () => {
                setLoading(false);
            };
        }, [])
    );

    const createPDF = async () => {
        try {
            const fileName = `${title.replace(/\s+/g, '_')}_Recipe.pdf`;
            setIsSharing(true);
            const html = `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                padding: 20px;
                                color: #4D4E53;
                                background-color: #E2DDD9;
                                -webkit-print-color-adjust: exact;
                                -webkit-font-smoothing: antialiased;
                            }
                            h1 {
                                font-size: 28px;
                                color: #333;
                                text-align: center;
                                margin-bottom: 20px;
                                text-transform: uppercase;
                            }
                            .image-container {
                                text-align: center;
                                ${image ? 'margin-bottom: 20px;' : 'display: none;'}
                            }
                            img {
                                width: 300px;
                                height: auto;
                                object-fit: cover;
                                border-radius: 12px;
                                border: 0.5px solid #D8D8D8;
                                image-rendering: -webkit-optimize-contrast;
                            }
                            .info-container {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 10px;
                                margin: 0 auto 20px auto;
                                width: 80%;
                                max-width: 500px;
                                text-align: center;
                            }
                            .info-item {
                                font-size: 16px;
                                color: #4D4E53;
                            }
                            .section-title {
                                font-size: 18px;
                                font-weight: bold;
                                color: #4D4E53;
                                text-align: left;
                                margin: 15px 0 5px 10px;
                            }
                            ul, .steps, .notes {
                                width: 85%;
                                max-width: 700px;
                                margin: 0 auto 2px auto;
                                padding: 10px;
                                background-color: #f8f8f8;
                                border-radius: 8px;
                                line-height: 1.6;
                            }
                            ul {
                                list-style-type: none;
                                padding-left: 0;
                            }
                            li {
                                margin-bottom: 8px;
                            }
                            .steps, .notes {
                                font-size: 16px;
                                margin-bottom: 15px;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>${title}</h1>
                        <div class="image-container">
                            ${image ? `<img src="${image}" alt="Recipe Image" />` : ''}
                        </div>
                        <div class="info-container">
                            <div class="info-item"><strong>Porcije:</strong> ${servings}</div>
                            <div class="info-item"><strong>Vrijeme pripreme:</strong> ${preparationTime}</div>
                            <div class="info-item"><strong>Ocjena:</strong> ${rating}</div>
                        </div>
                        <h2 class="section-title">Sastojci:</h2>
                        <ul>
                            ${ingredientsList.map(ingredient => `
                                <li>${ingredient.name} - ${ingredient.quantity || 'N/A'} ${ingredient.unit || ''}</li>
                            `).join('')}
                        </ul>
                        <h2 class="section-title">Koraci:</h2>
                        <div class="steps">${steps}</div>
                        ${note ? `<h2 class="section-title">Bilješke:</h2><div class="notes">${note}</div>` : ''}
                    </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({
                html,
                base64: false,
                fileName,
            });


            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    UTI: 'com.adobe.pdf',
                    mimeType: 'application/pdf',
                    dialogTitle: fileName,
                });
            } else {
                Alert.alert('Sharing is not available on this device');
            }

        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert('Error', 'Could not generate PDF. Please try again.');
        }
    };

    const handleDeleteRecipe = async () => {
        try {
            if (image) {
                const imageName = image.split('%2F').pop().split('?')[0];
                const imageRef = ref(storage, `recipe_images/${imageName}`);

                await deleteObject(imageRef).catch((error) => {
                    if (error.code !== 'storage/object-not-found') {
                        console.warn("Error deleting image:", error);
                    } else {
                        console.info("Image not found in storage, skipping deletion.");
                    }
                });
            }

            await deleteDoc(doc(db, 'recipes', recipe.id));
            Alert.alert("Recipe Deleted", "The recipe has been successfully deleted.");
            navigation.goBack();
        } catch (error) {
            console.error("Error deleting recipe:", error);
            Alert.alert("Error", "Failed to delete the recipe.");
        }
    };

    const confirmDelete = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleEditRecipe = () => {
        navigation.navigate('EditRecipe', { recipe });
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#9DA3B4" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.sectionTitle}>Are you sure you want to delete this recipe?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRecipe}>
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#4D4E53" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <TouchableOpacity onPress={createPDF} style={styles.filterButton}>
                    <Ionicons name="share-social-outline" size={24} color="#4D4E53" />
                </TouchableOpacity>

            </View>
            <ScrollView contentContainerStyle={styles.content}>
                {image && <Image source={{ uri: image }} style={styles.image} />}

                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Ionicons name="people-outline" size={18} color="#4D4E53" />
                        <Text style={styles.infoText}>{servings}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        {Array.from({ length: rating }, (_, i) => (
                            <Ionicons key={i} name="star" size={18} color="#FFD700" />
                        ))}
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="time-outline" size={18} color="#4D4E53" />
                        <Text style={styles.infoText}>{preparationTime}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Ingredients:</Text>
                {ingredientsList.length > 0 ? (
                    ingredientsList.map((ingredient, index) => (
                        <View key={index} style={styles.ingredient}>
                            <Text style={styles.ingredientText}>
                                {ingredient.name} - {ingredient.quantity || 'N/A'} {ingredient.unit || ''}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.info}>No ingredients to display.</Text>
                )}

                <Text style={styles.sectionTitle}>Steps:</Text>
                <Text style={styles.steps}>{steps}</Text>

                {note && (
                    <>
                        <Text style={styles.sectionTitle}>Notes:</Text>
                        <Text style={styles.notes}>{note}</Text>
                    </>
                )}
            </ScrollView>

            <View style={styles.fabContainer}>
                <TouchableOpacity style={styles.fab} onPress={handleEditRecipe}>
                    <Ionicons name="pencil-outline" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.fab} onPress={confirmDelete}>
                    <Ionicons name="trash-outline" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <NavigationButtons navigation={navigation} />
        </View>
    );
};

export default RecipeDetails;
