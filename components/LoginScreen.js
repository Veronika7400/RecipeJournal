import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, db, storage } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
import styles from '../styles/LoginScreenStyles';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUser } = useUser();
  const { t } = useTranslation();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        navigation.navigate('Nav');
      }
    });

    return unsubscribe;
  }, [navigation, setUser]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('email_password_error'));
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoginModalVisible(false);
        const user = userCredential.user;
        setUser(user);
        navigation.navigate('Nav');
      })
      .catch((error) => {
        console.error("Login error: ", error);
        Alert.alert(t('error'), error.message);
      });
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
      Alert.alert(t('permission_required'), t('camera_permission'));
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

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert(t('error'), t('enter_all_info'));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      let imageUrl = '';
      if (profileImage) {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `profile_images/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        await uploadTask;
        imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
      }
      
      await setDoc(doc(db, 'users', user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        profileImageUrl: imageUrl,
      });
  
      setRegisterModalVisible(false);
      Alert.alert(t('register_success'), t('welcome_message', { firstName }));
      setUser(user);
      navigation.navigate('Nav');
    } catch (error) {
      console.error("Registration error: ", error);
      Alert.alert(t('error'), t('registration_error'));
    }

  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/home.png')} style={styles.image} />
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.button} onPress={() => setLoginModalVisible(true)}>
          <Text style={styles.buttonText}>{t('login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setRegisterModalVisible(true)}>
          <Text style={styles.buttonText}>{t('register')}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={loginModalVisible}
        onRequestClose={() => setLoginModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{t('login')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.textInput}
              placeholder={t('password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setLoginModalVisible(false)}>
                <Text style={styles.buttonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>{t('submit')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={registerModalVisible}
        onRequestClose={() => setRegisterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{t('register')}</Text>

            {profileImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                <TouchableOpacity onPress={() => setProfileImage(null)} style={styles.removeImageButton}>
                  <Ionicons name="trash" size={20} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text>{t('no_image_selected')}</Text>
            )}

            <View style={styles.imageButtons}>
              <TouchableOpacity
                style={[styles.galleryButton]}
                onPress={handleImagePick}>
                <Ionicons name="image" size={30} color="#000" />
                <Text style={styles.addButtonText}>{t('choose_from_gallery')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cameraButton]}
                onPress={handleImageCapture}>
                <Ionicons name="camera" size={30} color="#000" />
                <Text style={styles.addButtonText}>{t('take_photo')}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder={t('first_name')}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.textInput}
              placeholder={t('last_name')}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.textInput}
              placeholder={t('email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.textInput}
              placeholder={t('password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setRegisterModalVisible(false)}>
                <Text style={styles.buttonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>{t('register')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <LanguageSwitcher style={styles.languageSwitcher} />
    </View>
  );
};

export default LoginScreen;
