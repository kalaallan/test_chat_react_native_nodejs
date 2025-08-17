import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export const socket = io('http://10.0.2.2:5000');

const Chat: React.FC<Props> = ({route}) => {

  const { user } = route.params;
  const [message, setMessage] = useState<{ message: string; userId: string }>({ message: '', userId: ''});
  const [messages, setMessages] = useState<{ message: string; userId: string }[]>([]);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  useLayoutEffect(() => {
    const id = async () => {
      const idStorage = await AsyncStorage.getItem('email');
      const nameStorage = await AsyncStorage.getItem('name');
      if (idStorage) {
        setUserId(idStorage);
      }
      if (nameStorage) {
        setUserName(nameStorage);
      }
    }
    id();
  }, [user]);

  useEffect(() => {
    socket.on('message', async (newMessage) => {
      await setMessages(prev => [...prev, {
        message: newMessage.message,
        userId: newMessage.userId,
      }]);
    });

    return () => {
      socket.off('message');
    };
  }, [userId, user.email]);

  const sendMessage = async () => {
    try {
      await socket.emit('sendMessage', { message: message.message, userId: userId, receiverId: user.email });
      setMessage({ message: '', userId: userId });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View  style={styles.container}>
      <View>
        <Text>Chat avec {user.name}</Text>
      </View>
      
      <View style={styles.zoneMessage}>
        <ScrollView>
          {
            messages.map((msg, index) => (
              <View key={index} style={userId === msg.userId ? styles.messageContainer2 : styles.messageContainer}>
                <Text style={userId === msg.userId ? styles.nomUser2 : styles.nomUser}>{userName}</Text>
                <View style={userId === msg.userId ? styles.messageContent2 : styles.messageContent}>
                  <Text style={userId === msg.userId ? styles.messageText2 : styles.messageText}>{msg.message}</Text>
                </View>
              </View>
            ))
          }
        </ScrollView>
      </View>
      
      <View style={styles.footer}>
          <TextInput 
            editable
            placeholder="Type your message..." 
            style={styles.input} 
            value={message.message}
            onChangeText={(text) => setMessage({ message: text, userId: userId})}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  zoneMessage: {
    backgroundColor: '#fff',
    flex: 1,
    marginVertical: 20,
    width: '95%',
    borderRadius: 5,
    padding: 10,
  },
  input: {
    marginBottom: 30,
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 35,
    padding: 15,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageContainer: {
    alignItems: 'flex-start',
  },
  messageContainer2: {
    alignItems: 'flex-end',
  },
  messageContent: {
    margin: 5,
    backgroundColor: '#F0F0F0',
    borderRadius: 35,
    padding: 10,
    flexDirection: 'row',
    maxWidth: '50%',
    maxHeight: 200,
  },
  messageContent2: {
    margin: 5,
    backgroundColor: '#F0F0F0',
    borderRadius: 35,
    padding: 10,
    flexDirection: 'row',
    maxWidth: '50%',
    maxHeight: 200
  },
  messageText: {
    marginLeft: 5,
  },
  messageText2: {
    marginLeft: 5,
  },
  nomUser: {
    fontWeight: 'bold',
    marginLeft: 15,
  },
  nomUser2: { 
    fontWeight: 'bold',
    marginRight: 15,
  }
  
});

export default Chat
