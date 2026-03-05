// viewModels/authViewModel.js

import { useState } from "react";
import { Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // REMOVED
import ApiService from "../Service/apiService"; // Use Capital A and S

const useAuthViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ================= LOGIN =================
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ApiService.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.status === false) {
        throw new Error(result.message || "Invalid email or password");
      }

      // Save token (Disabled for now since storage is removed)
      // await AsyncStorage.setItem("token", result.token);
      // await AsyncStorage.setItem("user", JSON.stringify(result.data));

      return result;

    } catch (err) {
      setError(err.message);
      Alert.alert("Login Failed", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ================= SIGNUP =================
  const signup = async (name, phone, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ApiService.baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          Phone: phone,
          Email: email,
          Password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.status === false) {
        throw new Error(result.message || "Signup failed");
      }

      Alert.alert("Success", "User registered successfully");

      return result;

    } catch (err) {
      setError(err.message);
      Alert.alert("Signup Failed", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signup,
    loading,
    error,
  };
};

export default useAuthViewModel;