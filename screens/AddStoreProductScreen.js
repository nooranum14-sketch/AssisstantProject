import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, 
  TouchableOpacity, FlatList, TextInput, 
  Alert, ActivityIndicator 
} from 'react-native';

import ApiService from '../Service/apiService';

const AddStoreProductScreen = ({ navigation, route }) => {
  const { storeId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const response = await fetch(
        `${ApiService.baseUrl}/products/catalog`
      );

      const result = await response.json();

      if (result.status) {
        setProducts(result.data);
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load catalog.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedProducts(prev => {
      const updated = { ...prev };

      if (updated[id]) {
        delete updated[id];
      } else {
        updated[id] = { price: '', stock: '' };
      }

      return updated;
    });
  };

  const updateValue = (id, field, value) => {
    setSelectedProducts(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleAddToStore = async () => {
    const keys = Object.keys(selectedProducts);

    if (keys.length === 0) {
      Alert.alert("Select Products", "Please select at least one product.");
      return;
    }

    const items = keys.map(id => ({
      ProductID: parseInt(id),
      Price: parseFloat(selectedProducts[id].price) || 0,
      StockQty: parseInt(selectedProducts[id].stock) || 0
    }));

    try {
      const response = await fetch(
        `${ApiService.baseUrl}/products/bulk/${storeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: items })
        }
      );

      const result = await response.json();

      if (result.status) {
        Alert.alert("Success", result.message);
        navigation.goBack();
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const selectedCount = Object.keys(selectedProducts).length;

  if (loading) {
    return (
      <ActivityIndicator 
        size="large" 
        color="#14B8A6" 
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Products</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.ProductID.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign:'center', marginTop:20 }}>
            No products in catalog.
          </Text>
        }
        renderItem={({ item }) => {
          const isSelected = !!selectedProducts[item.ProductID];
          const productData = selectedProducts[item.ProductID] || { price:'', stock:'' };

          return (
            <View style={[styles.card, isSelected && styles.cardSelected]}>
              <View style={styles.cardTop}>
                <TouchableOpacity
                  onPress={() => toggleSelect(item.ProductID)}
                  style={styles.checkbox}
                >
                  <View style={[styles.checkInner, isSelected && styles.checked]}>
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </TouchableOpacity>

                <View style={styles.imgBox}>
                  <Text style={{ fontSize:24 }}>📦</Text>
                </View>

                <View style={{ flex:1 }}>
                  <Text style={styles.pName}>{item.ProductName}</Text>
                  <Text style={styles.pCompany}>{item.Company}</Text>
                </View>
              </View>

              {isSelected && (
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Sale Price</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0.0"
                      keyboardType="numeric"
                      value={productData.price}
                      onChangeText={(val) =>
                        updateValue(item.ProductID, 'price', val)
                      }
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Stock Qty</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="0"
                      keyboardType="numeric"
                      value={productData.stock}
                      onChangeText={(val) =>
                        updateValue(item.ProductID, 'stock', val)
                      }
                    />
                  </View>
                </View>
              )}
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={[
          styles.bottomBtn,
          selectedCount === 0 && { backgroundColor:'#ccc' }
        ]}
        disabled={selectedCount === 0}
        onPress={handleAddToStore}
      >
        <Text style={styles.bottomBtnText}>
          Add {selectedCount} Products to Stock
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#F4F7F9' },

  header: {
    flexDirection:'row',
    alignItems:'center',
    padding:20,
    backgroundColor:'#fff',
    borderBottomWidth:1,
    borderBottomColor:'#eee'
  },

  backBtn: { fontSize:24, marginRight:20, color:'#333' },
  headerTitle: { fontSize:18, fontWeight:'bold', color:'#333' },

  card: {
    backgroundColor:'#fff',
    marginHorizontal:15,
    marginVertical:8,
    borderRadius:15,
    padding:15,
    elevation:2
  },

  cardSelected: {
    backgroundColor:'#E0F2F1',
    borderWidth:1,
    borderColor:'#14B8A6'
  },

  cardTop: { flexDirection:'row', alignItems:'center' },

  checkbox: { marginRight:15 },

  checkInner: {
    width:22,
    height:22,
    borderWidth:2,
    borderColor:'#9CA3AF',
    borderRadius:4,
    justifyContent:'center',
    alignItems:'center'
  },

  checked: {
    backgroundColor:'#14B8A6',
    borderColor:'#14B8A6'
  },

  checkMark: {
    color:'#fff',
    fontSize:12,
    fontWeight:'bold'
  },

  imgBox: {
    width:50,
    height:50,
    backgroundColor:'#F3F4F6',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginRight:15
  },

  pName: { fontSize:15, fontWeight:'600', color:'#333' },
  pCompany: { fontSize:12, color:'#9CA3AF' },

  inputRow: {
    flexDirection:'row',
    marginTop:15,
    paddingTop:15,
    borderTopWidth:1,
    borderTopColor:'#B2DFDB',
    justifyContent:'space-between'
  },

  inputGroup: { width:'47%' },

  inputLabel: {
    fontSize:12,
    color:'#555',
    marginBottom:5,
    fontWeight:'500'
  },

  input: {
    backgroundColor:'#fff',
    borderRadius:8,
    padding:10,
    fontSize:14,
    borderWidth:1,
    borderColor:'#B2DFDB',
    color:'#333'
  },

  bottomBtn: {
    position:'absolute',
    bottom:20,
    alignSelf:'center',
    width:'90%',
    backgroundColor:'#14B8A6',
    padding:15,
    borderRadius:12,
    alignItems:'center',
    elevation:3
  },

  bottomBtnText: {
    color:'#fff',
    fontWeight:'bold',
    fontSize:16
  }
});

export default AddStoreProductScreen;