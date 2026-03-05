import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, Image, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import ApiService from '../Service/apiService';
const AddEmployeeScreen = ({ navigation, route }) => {
  const { storeId } = route.params || {};
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cashier');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleAddEmployee = async () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter name and password");
      return;
    }
    
    if (!storeId) {
      Alert.alert("Error", "Store ID missing.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("Email", email || "");
      formData.append("Phone", phone || "");
      formData.append("Password", password);
      formData.append("Role", role);

      if (image) {
        formData.append("profilePic", {
          uri: image.uri,
          name: image.fileName || 'employee.jpg',
          type: image.type || 'image/jpeg',
        });
      }

      // Uses the existing /addEmployee/:id endpoint
      const response = await fetch(`${ApiService.baseUrl}/users/addEmployee/${storeId}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || result.status === false) {
        throw new Error(result.message || "Failed to add employee");
      }

      Alert.alert("Success ✅", `${name} has been added successfully!`, [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);

    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backTouch}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Employee</Text>
          <View style={{ width: 40 }} /> 
        </View>

        <View style={styles.content}>
          <Text style={styles.mainTitle}>New Team Member</Text>
          <Text style={styles.subTitle}>Enter details below</Text>

          <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
            <View style={styles.cameraCircle}>
               <Image 
                source={{ 
                  uri: image ? image.uri : 'https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6CuLvveL5SAnMfmUpS81s7ZHl.jpg' 
                }} 
                style={styles.defaultEmployeePic} 
               />
               <View style={styles.cameraBadge}>
                  <Text style={{fontSize: 14}}>📷</Text>
               </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.uploadText}>Tap to change photo</Text>

          <View style={styles.formCard}>
            
            <View style={styles.inputField}>
              <Text style={styles.fieldIcon}>👤</Text>
              <TextInput 
                placeholder="Name" 
                placeholderTextColor="#95A5A6"
                style={styles.input} 
                value={name} 
                onChangeText={setName} 
              />
            </View>

            <View style={styles.inputField}>
              <Text style={styles.fieldIcon}>✉️</Text>
              <TextInput 
                placeholder="Email" 
                placeholderTextColor="#95A5A6"
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputField}>
              <Text style={styles.fieldIcon}>📞</Text>
              <TextInput 
                placeholder="Phone" 
                placeholderTextColor="#95A5A6"
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputField}>
              <Text style={styles.fieldIcon}>🔑</Text>
              <TextInput 
                placeholder="Password" 
                placeholderTextColor="#95A5A6"
                style={styles.input} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={true}
              />
            </View>

            <Text style={styles.roleLabel}>Role</Text>
            <View style={styles.inputField}>
              <Text style={styles.fieldIcon}>💼</Text>
              <Text style={styles.roleText}>{role}</Text>
            </View>

            <TouchableOpacity style={styles.mainAddBtn} onPress={handleAddEmployee} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.mainAddBtnText}>Add Employee</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFC' },
  scrollContainer: { flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10 },
  backBtn: { fontSize: 28, color: '#2D3436', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, color: '#34495E', fontWeight: '600' },
  content: { alignItems: 'center', paddingHorizontal: 25 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#2D3436', marginTop: 10 },
  subTitle: { fontSize: 15, color: '#7F8C8D', marginVertical: 5 },
  imageUploadContainer: { marginTop: 20 },
  cameraCircle: { 
    width: 120, height: 120, borderRadius: 60, 
    borderWidth: 2, borderColor: '#00D1B2', 
    justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden'
  },
  defaultEmployeePic: { width: 120, height: 120, resizeMode: 'cover' },
  cameraBadge: { 
    position: 'absolute', bottom: 5, right: 5, 
    backgroundColor: '#fff', padding: 5, borderRadius: 15, 
    elevation: 2, shadowOpacity: 0.1 
  },
  uploadText: { color: '#7F8C8D', marginTop: 12, marginBottom: 20 },
  formCard: { 
    width: '100%', backgroundColor: '#fff', 
    borderRadius: 25, padding: 20, 
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1 
  },
  inputField: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#F1F5F9', borderRadius: 12, 
    height: 55, paddingHorizontal: 15, marginBottom: 15 
  },
  fieldIcon: { fontSize: 18, marginRight: 10, color: '#2D3436' },
  input: { flex: 1, fontSize: 16, color: '#000', fontWeight: '500' },
  roleLabel: { alignSelf: 'flex-start', marginLeft: 5, marginBottom: 5, color: '#BDC3C7', fontSize: 12 },
  roleText: { flex: 1, fontSize: 16, color: '#2D3436', textTransform: 'capitalize' },
  mainAddBtn: { 
    backgroundColor: '#1ABC9C', 
    height: 60, borderRadius: 15, 
    justifyContent: 'center', alignItems: 'center', marginTop: 10 
  },
  mainAddBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default AddEmployeeScreen;