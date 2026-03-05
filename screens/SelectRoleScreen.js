import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import ApiService from '../Service/apiService';
const SelectRoleScreen = ({ navigation, route }) => {
  const { userId } = route.params || {};
  const [loading, setLoading] = useState(false);

  const handleCustomerSelect = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ApiService.baseUrl}/users/updateRole/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Role: "Customer" })
      });

      // --- DEBUGGING START ---
      const text = await response.text(); // Get raw text
      console.log("Server Raw Response:", text);

      let result;
      try {
        result = JSON.parse(text); // Try to parse
      } catch (e) {
        // If parsing fails, show the HTML/Text error
        Alert.alert("Server Error", "Server returned HTML/Text:\n" + text.substring(0, 200));
        setLoading(false);
        return;
      }
      // --- DEBUGGING END ---

      if (!response.ok || result.status === false) {
        throw new Error(result.message || "Failed to update role");
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'CustomerDashboardScreen' }],
      });

    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep your existing render code exactly the same) ...
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Role</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={{fontSize: 40, color: '#14A38B'}}>👤</Text>
        </View>

        <Text style={styles.mainTitle}>Choose your Path</Text>
        <Text style={styles.subTitle}>Select how you want to use Grovi today.</Text>

        <TouchableOpacity 
          style={styles.roleCard}
          onPress={() => navigation.navigate('RegisterStore', { userId: userId })}
        >
          <View style={[styles.cardIconBox, { backgroundColor: '#E8F5F3' }]}>
            <Text style={{fontSize: 24}}>🏪</Text>
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Store Owner</Text>
            <Text style={styles.cardSub}>Register and manage your store</Text>
          </View>
          <Text style={styles.arrow}>❯</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.roleCard}
          onPress={handleCustomerSelect}
          disabled={loading}
        >
          <View style={[styles.cardIconBox, { backgroundColor: '#FFF4E6' }]}>
            <Text style={{fontSize: 24}}>🛍️</Text>
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Customer</Text>
            <Text style={styles.cardSub}>Browse products and shop</Text>
          </View>
          {loading ? <ActivityIndicator color="#14A38B" /> : <Text style={styles.arrow}>❯</Text>}
        </TouchableOpacity>
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
  iconContainer: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#14A38B', justifyContent: 'center', alignItems: 'center', marginTop: 40, marginBottom: 30 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#2D3436', marginBottom: 10 },
  subTitle: { fontSize: 14, color: '#636E72', textAlign: 'center', marginBottom: 40 },
  roleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 20, marginBottom: 15, width: '100%', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  cardIconBox: { width: 55, height: 55, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
  cardTextContainer: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#2D3436' },
  cardSub: { fontSize: 13, color: '#636E72' },
  arrow: { fontSize: 18, color: '#B2BEC3' }
});

export default SelectRoleScreen;