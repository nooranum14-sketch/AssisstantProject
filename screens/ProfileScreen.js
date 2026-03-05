import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  Image, ActivityIndicator, ScrollView 
} from 'react-native';
import ApiService from '../Service/apiService';

const ProfileScreen = ({ navigation, route }) => {
  const { storeId, userId } = route.params || {};
  
  const [userData, setUserData] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storeId && userId) fetchData();
  }, [storeId, userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch User Details
      const userRes = await fetch(`${ApiService.baseUrl}/users/userDetail/${userId}`);
      const userResult = await userRes.json();
      if (userResult.status) setUserData(userResult.data);

      // Fetch Store Details
      const storeRes = await fetch(`${ApiService.baseUrl}/store/getStoreById/${storeId}`);
      const storeResult = await storeRes.json();
      if (storeResult.status) setStoreData(storeResult.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#14A38B" style={{ marginTop: 100 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Profile */}
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: userData?.ProfilePicName 
              ? `${ApiService.baseUrl}/uploads/${userData.ProfilePicName}` 
              : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} 
            style={styles.userImage} 
          />
          <Text style={styles.userName}>{userData?.Name || "User Name"}</Text>
          <Text style={styles.userRole}>{userData?.Role}</Text>
        </View>

        {/* User Details Card */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>📧 Email</Text>
            <Text style={styles.value}>{userData?.Email || 'N/A'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>📞 Phone</Text>
            <Text style={styles.value}>{userData?.Phone || 'N/A'}</Text>
          </View>
        </View>

        {/* Store Info */}
        <Text style={styles.sectionTitle}>Store Information</Text>
        <View style={styles.card}>
          <View style={styles.storeInfoRow}>
            <Image 
              source={{ uri: storeData?.StoreLogo 
                ? `${ApiService.baseUrl}/uploads/${storeData.StoreLogo}` 
                : 'https://cdn-icons-png.flaticon.com/512/319/319289.png' }} 
              style={styles.storeLogoSmall} 
            />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.storeNameText}>{storeData?.StoreName}</Text>
              <Text style={styles.storeAddressText}>{storeData?.StoreAddress}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.logoutText}>↪ Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', elevation: 2 },
  backBtn: { fontSize: 28, color: '#2D3436' },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#2D3436' },
  scrollContent: { padding: 20 },
  profileSection: { alignItems: 'center', marginBottom: 25 },
  userImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#14A38B', marginBottom: 10 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#2D3436' },
  userRole: { fontSize: 14, color: '#14A38B', textTransform: 'capitalize', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  label: { color: '#7F8C8D', fontSize: 14, fontWeight: '600' },
  value: { color: '#2D3436', fontSize: 15, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#ECF0F1', marginVertical: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#636E72', marginBottom: 10, marginLeft: 5 },
  storeInfoRow: { flexDirection: 'row', alignItems: 'center' },
  storeLogoSmall: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#f0f0f0' },
  storeNameText: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  storeAddressText: { fontSize: 13, color: '#7F8C8D', marginTop: 4 },
  bottomContainer: { padding: 20, backgroundColor: '#fff' },
  logoutBtn: { backgroundColor: '#FF5A5F', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default ProfileScreen;