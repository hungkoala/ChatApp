import {use} from 'ast-types';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';
import {IconButton} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import firestore, {firebase} from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import {sync} from 'command-exists';
import {cat} from 'shelljs';
import {doc} from 'prettier';

const seed = [
  {
    _id: 0,
    text: 'New room created.',
    createdAt: new Date().getTime(),
    system: true,
  },
  {
    _id: 1,
    text: 'hello!',
    createdAt: new Date().getTime(),
    user: {
      _id: 2,
      name: 'Test User',
    },
  },
];

export default function RoomScreen({route}) {
  const {user} = useContext(AuthContext);
  const currentUser = user.toJSON();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const {thread} = route.params;

  useEffect(() => {
    const messagesListener = firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const loadedMessages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email,
            };
          }
          return data;
        });

        if (loading) {
          setLoading(false);
        }
        setMessages(loadedMessages);
      });
    return () => messagesListener();
  }, [thread]);

  function handleSend(newMessage = []) {
    firestore()
      .collection('THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text: newMessage[0].text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );

    firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text: newMessage[0].text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
        },
      })
      .catch(e => console.log('saving message error ....', e));

    setMessages(GiftedChat.append(messages, newMessage));
  }

  function renderBubble(props) {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: '#6646ee',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} color="#6646ee" />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={36} color="#6646ee" />
      </View>
    );
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessage => {
        handleSend(newMessage);
      }}
      user={{_id: currentUser.uid, name: currentUser.email}}
      renderBubble={renderBubble}
      placeholder="Type your message here..."
      showUserAvatar
      renderSend={renderSend}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      renderLoading={renderLoading}
    />
  );
}

// Step 5: add corresponding styles
const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // rest remains same
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
