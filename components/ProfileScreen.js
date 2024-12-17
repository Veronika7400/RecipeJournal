import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import NavigationButtons from '../components/NavigationButtons';
import styles from '../styles/ProfileScreenStyes';
import { deleteObject, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

const screenWidth = Dimensions.get('window').width;

const ProfileScreen = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [recipeCount, setRecipeCount] = useState(0);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [recipeStats, setRecipeStats] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isImageDeleted, setIsImageDeleted] = useState(false);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const navigation = useNavigation();
    const usedColors = new Set();
    const isValidColor = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);
    const { t } = useTranslation();
    const generateRandomColor = () => {
        let color;
        do {
            color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        } while (usedColors.has(color) || !isValidColor(color));
        usedColors.add(color);
        return color;
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleImageCapture = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.status !== 'granted') {
            Alert.alert(t('permissionRequired'), t('cameraPermissionRequired'));
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const fetchUserData = async () => {
        if (currentUser) {
            try {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData(data);
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                } else {
                    console.log("No user data found in Firestore.");
                }

                const recipesRef = collection(db, 'recipes');
                const q = query(recipesRef, where('user', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                setRecipeCount(querySnapshot.size);

                const categoryCounts = {};
                querySnapshot.forEach((doc) => {
                    const { category } = doc.data();
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                });

                const categoriesRef = collection(db, 'categories');
                const categoriesSnapshot = await getDocs(categoriesRef);
                const categoryData = categoriesSnapshot.docs.map((catDoc) => {
                    const { name } = catDoc.data();
                    const categoryId = catDoc.id;
                    return {
                        name,
                        count: categoryCounts[categoryId] || 0,
                        color: generateRandomColor(),
                        legendFontColor: "#333",
                        legendFontSize: 12,
                    };
                });

                setRecipeStats(categoryData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            setFirstName('');
            setLastName('');
            setProfileImage(null);
            setRecipeCount(0);
            setRecipeStats([]);
            setIsImageDeleted(false);
            setLoading(true);
            fetchUserData();
            return () => {
                setLoading(false);
            };
        }, [])
    );

    useEffect(() => {
        fetchUserData();
    }, [currentUser]);

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            fetchUserData();
            return () => {
                setLoading(false);
            };
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#9DA3B4" />
            </View>
        );
    }
    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);
            const userDocRef = doc(db, 'users', currentUser.uid);
            let imageUrl = userData.profileImageUrl || '';

            if (profileImage && profileImage !== userData.profileImageUrl) {
                const response = await fetch(profileImage);
                const blob = await response.blob();
                const storageRef = ref(storage, `profile_images/${currentUser.uid}`);
                const uploadTask = uploadBytesResumable(storageRef, blob);
                await uploadTask;
                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            } else if (profileImage === '' && userData.profileImageUrl) {
                const storageRef = ref(storage, `profile_images/${currentUser.uid}`);
                await deleteObject(storageRef);
                imageUrl = '';
            } else {
                imageUrl = userData.profileImageUrl || '';
            }

            await updateDoc(userDocRef, {
                firstName: firstName,
                lastName: lastName,
                profileImageUrl: imageUrl,
            });

            setUserData({ ...userData, profileImageUrl: imageUrl });
            Alert.alert(t('success'), t('profileUpdated'));
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert(t('error'), t('updateFailed'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert(t('error'), t('passwordsDoNotMatch'));
            return;
        }
        try {
            const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);
            Alert.alert(t('success'), t('passwordUpdated'));
            setShowPasswordModal(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Error updating password:", error);
            Alert.alert(t('error'), t('passwordUpdateFailed'));
        }
    };

    const handleDeleteImage = () => {
        setProfileImage('');
        setIsImageDeleted(true);
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('profile')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileInfoContainer}>
                    <View style={styles.profilePictureArea}>
                        {isImageDeleted ? (
                            <Ionicons name="person-circle-outline" size={150} color="black" />
                        ) : profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            userData && userData.profileImageUrl && userData.profileImageUrl !== '' ? (
                                <Image source={{ uri: userData.profileImageUrl }} style={styles.profileImage} />
                            ) : (
                                <Ionicons name="person-circle-outline" size={150} color="black" />
                            )
                        )}
                    </View>
                    <Text style={styles.userName}>{firstName}{lastName}</Text>


                </View>
                <View style={styles.editContainer}>
                    <View style={styles.imageButtons}>
                        <TouchableOpacity
                            style={[styles.galleryButton]}
                            onPress={handleImagePick}>
                            <Ionicons name="image" size={30} color="#000" />
                            <Text style={styles.addButtonText}>{t('chooseFromGallery')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.cameraButton]}
                            onPress={handleImageCapture}>
                            <Ionicons name="camera" size={30} color="#000" />
                            <Text style={styles.addButtonText}>{t('takePhoto')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.removeImageButton]}
                            onPress={handleDeleteImage}>
                            <Ionicons name="trash-outline" size={30} />
                            <Text style={styles.deleteButtonText}>{t('deletePhoto')}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>{t('firstName')}</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <Text style={styles.label}>{t('lastName')}</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                    />
                    <Text style={styles.label}>{t('email')}</Text>
                    {userData?.email && (
                        <Text style={styles.emailText}>{userData.email}</Text>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.passwordButton} disabled={isSaving} onPress={() => setShowPasswordModal(true)}>
                        <Text style={styles.passwordButtonText}>{t('changePassword')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                            {isSaving ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.saveButtonText}>{t('saveChanges')}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <Modal visible={showPasswordModal} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>{t('changePassword')}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('currentPassword')}
                                    secureTextEntry
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('newPassword')}
                                    secureTextEntry
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('confirmNewPassword')}
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={styles.modalButton} onPress={() => setShowPasswordModal(false)}>
                                        <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
                                        <Text style={styles.modalButtonText}>{t('change')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={styles.statisticsContainer}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statCircle}>
                            <Text style={styles.statNumber}>{recipeCount}</Text>
                            <Text style={styles.statTitle}>{t('yourRecipes')}</Text>
                        </View>
                    </View>
                    <PieChart
                        data={recipeStats}
                        width={screenWidth * 0.9}
                        height={220}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            backgroundGradientFromOpacity: 0.5,
                            backgroundGradientToOpacity: 0.7,
                            fillShadowGradient: "rgba(255, 255, 255, 0.6)",
                            fillShadowGradientOpacity: 0.8,
                        }}
                        accessor="count"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        center={[10, 0]}
                        absolute
                    />
                </View>
            </ScrollView>
            <NavigationButtons navigation={navigation} />
        </View>
    );
};

export default ProfileScreen;
