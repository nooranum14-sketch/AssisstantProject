import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, SafeAreaView, Alert, ScrollView, ActivityIndicator 
} from 'react-native';
import useAuthViewModel from '../viewModels/authViewModel'; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthViewModel();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter email and password");
      return;
    }

    try {
      const result = await login(email, password);

      // --- DEBUGGING (Optional: Keep or Remove) ---
      console.log("Login Data:", result.data);
      // ------------------------

      const userRole = result.data?.Role; 

      if (userRole === 'StoreOwner') {
        navigation.reset({
          index: 0,
          routes: [{ 
            name: 'StoreDashboard', 
            params: { 
              storeId: result.data?.StoreID,
              userId: result.data?.UserID // ADDED: Pass UserID for Profile Screen
            } 
          }],
        });
      } else if (userRole === 'Customer') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'CustomerDashboardScreen' }],
        });
      } else {
        // Fallback: If role is null
        navigation.navigate('SelectRole', { userId: result.data?.UserID });
      }

    } catch (err) {
      console.log("Login failed", err);
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

        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Login to continue</Text>

        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            keyboardType="email-address" 
            placeholderTextColor="#A0A0A0" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
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
            style={styles.loginBtn} 
            onPress={handleLogin} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginBtnText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}>
              Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14A38B' },
  scrollContent: { alignItems: 'center', justifyContent: 'center', padding: 20, paddingTop: 60 },
  whiteCircle: { width: 100, height: 100, backgroundColor: '#fff', borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logo: { width: 60, height: 60 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  subText: { fontSize: 16, color: '#fff', marginBottom: 30 },
  card: { backgroundColor: '#fff', width: '100%', borderRadius: 20, padding: 20 },
  input: { backgroundColor: '#F2F5F9', borderRadius: 10, padding: 15, marginBottom: 15, color: '#000' },
  loginBtn: { backgroundColor: '#14A38B', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  signUpText: { color: '#14A38B', marginTop: 20, textAlign: 'center', fontSize: 16 }
});

export default LoginScreen;