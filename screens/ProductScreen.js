import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, 
  TouchableOpacity, FlatList, Modal, TextInput, Alert, ActivityIndicator 
} from 'react-native';
import ApiService from '../Service/apiService';

const ProductScreen = ({ navigation, route }) => {
  const { storeId } = route.params || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const fetchProducts = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const response = await fetch(`${ApiService.baseUrl}/products/store/${storeId}`);
      const result = await response.json();
      if (result.status) setProducts(result.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    const focusListener = navigation.addListener('focus', fetchProducts);
    return focusListener;
  }, [navigation, fetchProducts]);

  const openEdit = (product) => {
    setEditingProduct(product);
    setNewStock(product.StockQty.toString());
    setNewPrice(product.Price.toString());
    setModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editingProduct) return;
    try {
      const response = await fetch(
        `${ApiService.baseUrl}/products/inventory/${storeId}/${editingProduct.ProductID}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Price: newPrice, StockQty: newStock })
        }
      );
      const result = await response.json();
      if (!response.ok || !result.status) {
        throw new Error(result.message || "Failed to update product");
      }
      setModalVisible(false);
      fetchProducts();
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to update");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imgPlaceHolder}>
        <Text style={{ fontSize: 24 }}>📦</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.pName}>{item.ProductName}</Text>
        <Text style={styles.pCompany}>{item.Company}</Text>
        <View style={styles.row}>
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>Stock: {item.StockQty}</Text>
          </View>
          <Text style={styles.priceText}>Rs {item.Price}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => openEdit(item)}>
        <Text style={styles.editPencil}>✎</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerRow}>
          <Text style={styles.backBtn}>←</Text>
          <Text style={styles.headerTitle}>My Products</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0A845F" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.ProductID.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No products in inventory. Click + to add.</Text>}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity 
        style={styles.addBtn} 
        onPress={() => navigation.navigate('AddStoreProductScreen', { storeId })}
      >
        <Text style={styles.addBtnText}>+ Add Stock</Text>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Inventory</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Stock Qty"
              value={newStock}
              onChangeText={setNewStock}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Price"
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#0A845F' }]} onPress={saveEdit}>
                <Text style={{ color: '#fff' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { fontSize: 24, color: '#333', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  card: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 15, marginVertical: 8, padding: 15, borderRadius: 15, alignItems: 'center', elevation: 2 },
  imgPlaceHolder: { width: 55, height: 55, backgroundColor: '#f0f0f0', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  pName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  pCompany: { fontSize: 12, color: '#999', marginVertical: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  stockBadge: { backgroundColor: '#E0F2F1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  stockText: { color: '#0A845F', fontSize: 12, fontWeight: 'bold' },
  priceText: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  editPencil: { fontSize: 22, color: '#BDBDBD', padding: 5 },
  addBtn: { position: 'absolute', bottom: 20, alignSelf: 'center', width: '90%', backgroundColor: '#0A845F', paddingVertical: 15, borderRadius: 12, alignItems: 'center', elevation: 4 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalInput: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 0.45, padding: 15, borderRadius: 10, alignItems: 'center' }
});

export default ProductScreen;