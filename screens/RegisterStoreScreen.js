import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Use this instead of Expo
import ApiService from '../Service/apiService';
const RegisterStoreScreen = ({ navigation, route }) => {
  const { userId } = route.params || {};
  
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [image, setImage] = useState(null); // State for image { uri, fileName, type }
  const [loading, setLoading] = useState(false);

  // Function to Pick Image
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      // Set the image details
      const selectedAsset = result.assets[0];
      setImage(selectedAsset);
    }
  };

  const handleRegisterStore = async () => {
    if (storeName.trim() === '' || storeAddress.trim() === '') {
      Alert.alert("Missing Info", "Please fill all the fields");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID missing. Please go back and try again.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("StoreName", storeName);
      formData.append("StoreAddress", storeAddress);
      formData.append("UserID", userId);

      // APPEND IMAGE IF SELECTED
      if (image) {
        // React Native CLI Image Picker object structure:
        const file = {
          uri: image.uri,
          name: image.fileName || 'store_logo.jpg',
          type: image.type || 'image/jpeg',
        };
        
        // IMPORTANT: The field name must match backend -> upload.single("storeLogo")
        formData.append("storeLogo", file);
      }

      const response = await fetch(`${ApiService.baseUrl}/store/createstore`, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Note: Do NOT set Content-Type manually for FormData
        }
      });

      const result = await response.json();

      if (!response.ok || result.status === false) {
        throw new Error(result.message || "Store registration failed");
      }

      Alert.alert("Success", "Store Registered Successfully!", [
        { text: "OK", onPress: () => navigation.navigate('Login') }
      ]);

    } catch (err) {
      console.error("Registration Error:", err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Store</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={{ fontSize: 60 }}>🏪</Text>
        </View>

        <Text style={styles.mainTitle}>Setup your Store</Text>
        <Text style={styles.subTitle}>Enter details to get started</Text>

        <View style={styles.card}>
          {/* Image Picker Button & Preview */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={{ color: '#888' }}>Tap to select Store Logo</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput 
            style={styles.input} 
            placeholder="Store Name" 
            placeholderTextColor="#A0A0A0" 
            value={storeName}
            onChangeText={setStoreName}
          />
          
          <TextInput 
            style={styles.input} 
            placeholder="Store Address" 
            placeholderTextColor="#A0A0A0" 
            value={storeAddress}
            onChangeText={setStoreAddress}
          />

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegisterStore} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerBtnText}>Register Store</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backArrow: { fontSize: 24, color: '#000' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 25 },
  iconContainer: { marginTop: 40, marginBottom: 20 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#2D3436', marginBottom: 5 },
  subTitle: { fontSize: 16, color: '#636E72', marginBottom: 40 },
  card: { backgroundColor: '#fff', width: '100%', borderRadius: 20, padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  
  // Styles for Image Picker
  imagePicker: {
    width: '100%',
    height: 120,
    backgroundColor: '#F2F5F9',
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0', fontSize: 16, color: '#000' },
  registerBtn: { backgroundColor: '#14A38B', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 10 },
  registerBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default RegisterStoreScreen;