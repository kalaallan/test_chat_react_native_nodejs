import React, { useState } from 'react'
import { Text, View, StyleSheet, TextInput, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert, TouchableWithoutFeedback  } from 'react-native'
import { RootStackParamList } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import api from '../api';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register: React.FC<Props> = ({navigation}) => {

  const [focus, setFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const textEmail = (text: string) => {
    setEmail(text.toLowerCase().trim());
  };


  const retourLogin = () => {
    navigation.goBack();
  };

  const enregistrerUser = async () => {
    try {
      if(email !== '' && password !== ''){
        if (email.includes('@')) {
          const response = await api.post('/api/auth/register', { email, password, name });
          if (response.status === 201) { 
            // Handle successful registration
            Alert.alert('Succès', 'Votre compte a été créé. Vous pouvez maintenant vous connecter.');
            navigation.goBack();
          }else {
            console.error('Registration failed:', response.data);
          }
        }else {
          Alert.alert('Erreur', 'Veuillez entrer une adresse e-mail valide.');
        }
      } else {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      }

    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior='padding'  style={styles.container2}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View>
              <Text style={{...styles.label, marginTop: 100}}>Name :</Text>
              <TextInput
                editable
                placeholder='Enter your nom...'
                style={styles.input}
                onChangeText={setName}
                value={name}
              />
            </View>
            <View>
              <Text style={styles.label}>Email :</Text>
              <TextInput
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
                  onPress={enregistrerUser}
                  style={{...styles.button, backgroundColor: '#000'}}
                >
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={retourLogin}
                  style={styles.button}
                >
                  <Text>Login</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>
      </TouchableWithoutFeedback>


    </KeyboardAvoidingView>

  )
}

const styles = StyleSheet.create({
  container: {    
    backgroundColor: '#F5F5F5',
    paddingBottom: 40,
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
    width: '100%',
    justifyContent: 'center',

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
    backgroundColor: '#F5F5F5',
  },
});

export default Register
