import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, 
  TouchableOpacity, FlatList, Image, ActivityIndicator, Alert 
} from 'react-native';
import ApiService from '../Service/apiService';

const EmployeeScreen = ({ navigation, route }) => {
  const { storeId } = route.params || {};
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const response = await fetch(`${ApiService.baseUrl}/users/store/${storeId}`);
      const result = await response.json();
      if (result.status) {
        setEmployees(result.data);
      } else {
        Alert.alert("Error", result.message || "Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Unable to fetch employees from server");
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEmployees();
    });
    return unsubscribe;
  }, [navigation, fetchEmployees]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('EmployeeStatusScreen', { employee: item })}
    >
      <View style={styles.cardContent}>
        <Image 
          source={{ 
            uri: item.ProfilePicName 
              ? `${ApiService.baseUrl}/uploads/${item.ProfilePicName}`
              : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
          }}
          style={styles.profilePic}
        />
        <View style={styles.textContainer}>
          <Text style={styles.empName}>{item.Name}</Text>
          <Text style={[
            styles.empStatus, 
            { color: item.Status === 'active' ? '#27AE60' : '#E74C3C' }
          ]}>
            {item.Status || 'Active'}
          </Text>
        </View>
      </View>
      <Text style={styles.arrowIcon}>❯</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employees</Text>
        <TouchableOpacity onPress={fetchEmployees}>
          <Text style={styles.refreshIcon}>↻</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0A845F" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={employees}
          renderItem={renderItem}
          keyExtractor={item => item.UserID.toString()}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No employees found. Click + to hire.
            </Text>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddEmployeeScreen', { storeId })}
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>Add Employee</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, backgroundColor:'#fff' },
  backBtn: { fontSize:24, fontWeight:'bold' },
  headerTitle: { fontSize:20, fontWeight:'bold' },
  refreshIcon: { fontSize:24, color:'#0A845F', fontWeight:'bold' },
  emptyText: { textAlign:'center', marginTop:50, color:'#7f8c8d', fontSize:16 },
  card: { backgroundColor:'#fff', borderRadius:15, padding:15, marginBottom:15, flexDirection:'row', alignItems:'center', justifyContent:'space-between', elevation:2 },
  cardContent: { flexDirection:'row', alignItems:'center' },
  profilePic: { width:60, height:60, borderRadius:30, marginRight:15, backgroundColor:'#f0f0f0' },
  textContainer: { justifyContent:'center' },
  empName: { fontSize:17, fontWeight:'600', color:'#2C3E50' },
  empStatus: { fontSize:14, marginTop:4, textTransform:'capitalize' },
  arrowIcon: { fontSize:18, color:'#BDC3C7' },
  fab: { position:'absolute', bottom:30, right:20, backgroundColor:'#0A845F', flexDirection:'row', paddingVertical:12, paddingHorizontal:20, borderRadius:15, alignItems:'center', elevation:5 },
  fabIcon: { color:'#fff', fontSize:22, fontWeight:'bold', marginRight:8 },
  fabText: { color:'#fff', fontSize:16, fontWeight:'600' }
});

export default EmployeeScreen;