import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, 
  TouchableOpacity, Image, Alert, ActivityIndicator 
} from 'react-native';
import ApiService from '../Service/apiService';

const EmployeeStatusScreen = ({ route, navigation }) => {
  const { employee } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(employee?.Status || 'active');

  const handleUpdateStatus = async (newStatus) => {
    if (!employee || !employee.UserID) {
      Alert.alert("Error", "Employee data is missing.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${ApiService.baseUrl}/users/updateStatus/${employee.UserID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: newStatus })
      });

      const result = await response.json();

      if (!response.ok || result.status === false) {
        throw new Error(result.message || "Failed to update status");
      }

      setCurrentStatus(newStatus);
      Alert.alert("Success", `Employee status updated to ${newStatus}`);

    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text>No Employee Data Found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Image 
          source={{ 
            uri: employee.ProfilePicName 
              ? `${ApiService.baseUrl}/uploads/${employee.ProfilePicName}` 
              : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          }} 
          style={styles.largeProfilePic} 
        />
        
        <Text style={styles.nameHeader}>{employee.Name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{employee.Role || 'N/A'}</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>✉  Email</Text>
            <Text style={styles.value}>{employee.Email || 'N/A'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.label}>📞  Phone</Text>
            <Text style={styles.value}>{employee.Phone || 'N/A'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.label}>ⓘ  Status</Text>
            <Text style={[
              styles.value, 
              { color: currentStatus === 'active' ? '#27AE60' : '#E74C3C', fontWeight: 'bold', textTransform: 'capitalize' }
            ]}>
              {currentStatus}
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#14A38B" style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.activateBtn]}
              onPress={() => handleUpdateStatus('active')}
            >
              <Text style={styles.activateText}>Activate</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.fireBtn]}
              onPress={() => handleUpdateStatus('Suspended')}
            >
              <Text style={styles.fireText}>Fire</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  backBtn: { fontSize: 24, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 20, marginTop: 20 },
  largeProfilePic: { width: 150, height: 150, borderRadius: 75, marginBottom: 20, backgroundColor: '#ddd' },
  nameHeader: { fontSize: 24, fontWeight: 'bold', color: '#2D3436' },
  roleBadge: { backgroundColor: '#E2F7F3', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: 10, marginBottom: 30 },
  roleText: { color: '#0A845F', fontSize: 14, fontWeight: '600' },
  detailsCard: { backgroundColor: '#fff', width: '100%', borderRadius: 20, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  label: { color: '#636E72', fontSize: 15 },
  value: { color: '#2D3436', fontSize: 15, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F2F6' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 'auto', marginBottom: 30 },
  actionButton: { flex: 0.47, paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  activateBtn: { borderWidth: 1, borderColor: '#27AE60' },
  activateText: { color: '#27AE60', fontSize: 18, fontWeight: 'bold' },
  fireBtn: { backgroundColor: '#FF4757' },
  fireText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default EmployeeStatusScreen;