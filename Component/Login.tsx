import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, View, Alert } from "react-native";
import { AppButton, InputWithLabel, Timeout, Loading } from "./UI";
import AsyncStorage from '@react-native-async-storage/async-storage';
let host = require('./Config').settings.serverPath;

const Login = ({ navigation } : any) => {
  // Fetching States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Used Variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountList, setAccountList] = useState<any[]>([]);

  // Run when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Fetch data from server
  const fetchData = async () => {
    // 5s Timeout
    const timeoutID = setTimeout(() => {
      setError('Request timed out');
      setLoading(false);
    }, 5000);

    // Fetch Data
    setError('');
    setLoading(true);
    let url = host + '/account';
    try {
      const response = await fetch(url);
      const result = await response.json();
      setAccountList(result);

      // Sign Up if no accounts in database
      if (result.length == 0) {
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('password');
        Alert.alert("Error", "No accounts found,\nPlease create a new account");
        navigation.navigate('AccountAdd', {
          accountRole: 'ADMIN',
          header: 'Create Admin Account',
        });
      }
      // Try auto login
      else {
        let prevUsername = await AsyncStorage.getItem('username');
        let prevPassword = await AsyncStorage.getItem('password');
        if (prevUsername != null && prevPassword != null) {
          Login(prevUsername, prevPassword, result);
          Alert.alert("Login", "Welcome Back!");
        }
      }
    } 
    catch (err) {
      console.log("Error" + error)
    }
    finally {
      setLoading(false);
      clearTimeout(timeoutID);
    }

    return () => {clearTimeout(timeoutID)};
  }

  // Login Function
  const Login = (name: string, pass: string, accountList: any[]) => {
    for (let account of accountList) {
      if ((account.accountName).toString().toUpperCase() == name.toUpperCase() && (account.accountPass).toString() == pass) {
        AsyncStorage.setItem('username', name);
        AsyncStorage.setItem('password', pass);
        navigation.navigate('HomeTab', {
          account: account,
        });
        setUsername('');
        setPassword('');
        return;
      }
    }
    Alert.alert("Error", "Invalid Account ID or Password");
  }

  // Loading Screen
  if (loading) {
    return <Loading/>;
  }

  // Error Screen
  if (error) {
    return <Timeout
      error =  {error}
      onPress = {() => fetchData()}/>
  }
  
  // Main Screen
  return(
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <InputWithLabel
        label = "Username: "
        placeholder = "Enter your username"
        onChangeText = {(text:any) => setUsername(text)}
        value = {username}/>
      <InputWithLabel
        label = "Password:"
        placeholder = "Enter your password"
        onChangeText = {(text:any) => setPassword(text)}
        secureTextEntry={true}
        value = {password}/>
      <View style={{ height:10 }}/>
      <AppButton
        title= 'Login'
        onPress={() => Login(username, password, accountList)}/>
      <AppButton
        title = 'Sign Up'
        theme = 'primary' 
        onPress={() => navigation.navigate('AccountAdd', {
          accountRole: 'STUDENT',
          header: 'Create Student Account',
        })}/>
    </ScrollView>
  )
}

export default Login;