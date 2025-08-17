import React, { useLayoutEffect, useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useAppDispatch } from '../redux/hook';
import { useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import {fetchUsers} from '../redux/listSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../redux/store';
import { socket } from './Chat';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


const Home: React.FC<Props> = ({navigation}) => {

  const [namepage, setNamepage] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
    getEmail();
    const getName = async () => {
      const storedName = await AsyncStorage.getItem('name');
      if (storedName) {
        setNamepage(storedName);
      }
    }
    getName();
    dispatch(fetchUsers());
  }, [dispatch]);

  useLayoutEffect(() => {
    const checkAuth = async () => {
      try {
        AsyncStorage.getItem('isAuthenticated').then((value) => {
          if (!value) {
            Alert.alert('Session expirée', 'Vous avez été déconnecté avec succès.');
            navigation.replace('Login');
          }
// 🦊 CRITIQUE: Alors, tes `AsyncStorage.getItem('isAuthenticated').then((value) => ...)` dans un `useLayoutEffect`, c'est comme demander à un escargot de gagner une course de Formule 1 : ça se fait, mais c'est pas vraiment son truc. Pense à utiliser `await` directement pour une lecture plus synchrone et éviter des comportements inattendus.
        });
      } catch (error) {
        console.log('Erreur AsyncStorage', error);
      }
    }
    checkAuth();
  }, [navigation, dispatch]);

  const { items, status } = useSelector((state: RootState) => state.listUsers);
  console.log(items);

  const retourLogin = () => {
    dispatch(logout());
    socket.emit('logout', email);
    socket.disconnect();
    Alert.alert('Déconnexion', 'Vous avez été déconnecté avec succès.');
    navigation.replace('Login');
  }

  const chatUser = (user:any) => {
    navigation.navigate('Chat', {user});
  }
  
  return (
    <View  style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={retourLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>LogOut</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Bonjour {namepage} </Text>
      <ScrollView style={styles.scrollView}>
        {
          status === 'loading' ? (
            <Text>Loading...</Text>
          ) : status === 'failed' ? (
            <Text>Erreur de chargement des données.</Text>
          ) : (
            items.filter((user: any) => user.email !== email).map((user: any) => (
              <TouchableOpacity key={user._id} onPress={() => chatUser(user)} style={styles.userInfoContainer}>
                <Text>Name: {user.name}</Text>
                <Text>Email: {user.email}</Text>
              </TouchableOpacity>
            ))
          )
        }
      </ScrollView>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: 100,
    marginHorizontal: 15,
    backgroundColor: '#ff4d4d',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 50,
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  scrollView: {
    width: '80%',
  },
});

export default Home
