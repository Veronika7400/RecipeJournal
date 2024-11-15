import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, signOut } from 'firebase/auth';
import styles from '../styles/NavigationButtonsStyles';

const NavigationButtons = ({ navigation }) => {
  const auth = getAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('You have been signed out');
      navigation.replace('Home');
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Unable to sign out. Please try again.");
    }
  };

  return (
    <View style={styles.navigationButtons}>
      <TouchableOpacity onPress={() => navigation.navigate('Categories')} style={styles.navButton}>
        <Ionicons name="home" size={24} color="#333" />
        <Text style={styles.navButtonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.navButton}>
        <Ionicons name="person" size={24} color="#333" />
        <Text style={styles.navButtonText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={styles.navButton}>
        <Ionicons name="log-out" size={24} color="#333" />
        <Text style={styles.navButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavigationButtons;
