import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import NavigationButtons from '../components/NavigationButtons';
import styles from '../styles/ProfileScreenStyes';

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
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const navigation = useNavigation();
    const usedColors = new Set();
    const isValidColor = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

    const generateRandomColor = () => {
        let color;
        do {
            color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        } while (usedColors.has(color) || !isValidColor(color));
        usedColors.add(color);
        return color;
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
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                firstName: firstName,
                lastName: lastName,
            });
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert('Error', 'Could not update profile. Please try again.');
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match.");
            return;
        }
        try {
            const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);
            Alert.alert('Success', 'Password updated successfully');
            setShowPasswordModal(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Error updating password:", error);
            Alert.alert('Error', 'Could not update password. Please try again.');
        }
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
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileInfoContainer}>
                    <View style={styles.profilePictureArea}>
                        <Ionicons name="person-circle-outline" size={150} color="black" />
                    </View>
                    <Text style={styles.userName}>{firstName} {lastName}</Text>
                </View>
                <View style={styles.editContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                    />
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.emailText}>{userData.email}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.passwordButton} onPress={() => setShowPasswordModal(true)}>
                            <Text style={styles.passwordButtonText}>Change Password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal visible={showPasswordModal} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Change Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Current Password"
                                    secureTextEntry
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="New Password"
                                    secureTextEntry
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm New Password"
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={styles.modalButton} onPress={() => setShowPasswordModal(false)}>
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
                                        <Text style={styles.modalButtonText}>Change</Text>
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
                            <Text style={styles.statTitle}>Your Recipes</Text>
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
