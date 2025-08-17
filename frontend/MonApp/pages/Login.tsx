import React, { useState, useRef  } from 'react';
import { useDispatch } from 'react-redux';
import { setUserCredentials, setLoginStatus, setUserInfo } from '../redux/authSlice';
import { Text, View, Alert, StyleSheet, TextInput, TouchableOpacity, Pressable, ScrollView, KeyboardAvoidingView } from 'react-native'

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import api from '../api';


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login: React.FC<Props> = ({navigation, route}) => {

  console.log(route);
  const [focus, setFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const registerRoute = () => {
    navigation.navigate('Register');
    setEmail('');
    setPassword('');
  };

  const loginUser = async () => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      console.log(response);
      // Dispatch login action
      dispatch(setLoginStatus(true));
      dispatch(setUserCredentials({ token: response.data.token }));
      dispatch(setUserInfo({ email, name: response.data.name, id: response.data._id }));
      Alert.alert('Succès', 'Vous êtes connecté avec succès !');
      navigation.replace('Home');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const textEmail = (text: string) => {
    setEmail(text.toLowerCase());
  };

  const handlePressOutSide = () => {
    setFocus(false);
    emailInputRef.current?.blur();
    passwordInputRef.current?.blur();
  };

  return (
    <KeyboardAvoidingView style={styles.container2}>
      <ScrollView style={styles.scrollView}>
        <Pressable onPress={handlePressOutSide} style={styles.container2}>
          <View style={styles.container}>

            <View>
              <Text style={{...styles.label, marginTop: 100}}>Email :</Text>
              <TextInput
                ref={emailInputRef}
                keyboardType='email-address'
                editable
                onFocus={() => setFocus(true)}  
                autoFocus={focus}
                placeholder='Enter your email...'
                style={styles.input}
                onChangeText={textEmail}
                value={email}
              />
            </View>
            <View>
              <Text style={styles.label}>Password :</Text>
              <TextInput
                ref={passwordInputRef}  
                editable
                secureTextEntry
                placeholder='Enter your password...'
                style={styles.input}
                onChangeText={setPassword}
                value={password}
              />
            </View>
            <View style={styles.buttonContainer}>
              <View>
                <TouchableOpacity
                  onPress={loginUser}
                  style={{...styles.button, backgroundColor: '#000'}}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={registerRoute}
                  style={styles.button}
                >
                  <Text>Register</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Pressable>

      </ScrollView>

    </KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: 250,
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: 100,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flexGrow: 1,
  },
});

export default Login
