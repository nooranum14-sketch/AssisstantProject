import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

const StoreDashScreen = ({ navigation, route }) => {
  // 1. Receive StoreID and UserID from Login
  const { storeId, userId } = route.params || {};

  const actions = [
    { id: 1, title: 'Products', icon: '📦', bgColor: '#E8F0FE', nav: 'ProductScreen' },
    { id: 2, title: 'Employees', icon: '👤', bgColor: '#FFF4E5', nav: 'EmployeeScreen' },
    { id: 3, title: 'Orders', icon: '📄', bgColor: '#FCE8FF', nav: '' },
    { id: 4, title: 'Profile', icon: '🏠', bgColor: '#E2F7F3', nav: 'ProfileScreen' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
               <Text style={{fontSize: 20}}>🏪</Text>
            </View>
            <View>
              <Text style={styles.storeTitle}>My Store</Text>
              <Text style={styles.subTitle}>Dashboard</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            {actions.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.gridItem}
                // 2. Pass both storeId and userId
                onPress={() => item.nav ? navigation.navigate(item.nav, { storeId: storeId, userId: userId }) : null}
              >
                <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#0A845F', padding: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingBottom: 35 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  storeTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  subTitle: { color: '#D1EAE2', fontSize: 14 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { backgroundColor: 'rgba(255,255,255,0.15)', width: '47%', padding: 15, borderRadius: 15 },
  statNum: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#D1EAE2', fontSize: 13, marginTop: 4 },
  body: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '47%', backgroundColor: '#fff', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardText: { fontSize: 16, fontWeight: '600', color: '#444' }
});

export default StoreDashScreen;