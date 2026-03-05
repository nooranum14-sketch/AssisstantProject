import React, { useState } from 'react';
import ApiService from '../Service/apiService';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, SafeAreaView, Alert, ScrollView, ActivityIndicator 
} from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !phone || !email || !password) {
      Alert.alert("Missing Info", "Please fill all the fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${ApiService.baseUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: name, Phone: phone, Email: email, Password: password }),
      });

      const result = await response.json();

      if (!response.ok || result.status === false) {
        throw new Error(result.message || "Signup failed");
      }

      // CHANGED: Pass the UserID to the SelectRoleScreen
      // result.data.UserID comes from your backend AuthService.signup
      const userId = result.data.UserID;
      navigation.navigate('SelectRole', { userId: userId });

    } catch (err) {
      Alert.alert("Signup Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render function (CSS unchanged)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.whiteCircle}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/869/869636.png' }} 
            style={styles.logo} 
          />
        </View>

        <Text style={styles.welcomeText}>Create Account</Text>
        <Text style={styles.subText}>Join Grovi today</Text>

        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder="Name" 
            placeholderTextColor="#A0A0A0" 
            value={name} 
            onChangeText={setName} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Phone" 
            keyboardType="phone-pad" 
            placeholderTextColor="#A0A0A0" 
            value={phone} 
            onChangeText={setPhone} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            keyboardType="email-address" 
            placeholderTextColor="#A0A0A0" 
            value={email} 
            onChangeText={setEmail} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            secureTextEntry={true} 
            placeholderTextColor="#A0A0A0" 
            value={password} 
            onChangeText={setPassword} 
          />

          <TouchableOpacity 
            style={styles.signUpBtn} 
            onPress={handleSignUp} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signUpBtnText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login', { role: null })}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14A38B' },
  scrollContent: { alignItems: 'center', justifyContent: 'center', padding: 20, paddingTop: 40 },
  whiteCircle: { width: 100, height: 100, backgroundColor: '#fff', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logo: { width: 60, height: 60 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subText: { fontSize: 16, color: '#fff', marginBottom: 30 },
  card: { backgroundColor: '#fff', width: '100%', borderRadius: 20, padding: 20 },
  input: { backgroundColor: '#F2F5F9', borderRadius: 10, padding: 15, marginBottom: 15, color: '#000' },
  signUpBtn: { backgroundColor: '#14A38B', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 10 },
  signUpBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footerText: { color: '#fff', marginTop: 30, fontSize: 16 },
});

export default SignUpScreen;