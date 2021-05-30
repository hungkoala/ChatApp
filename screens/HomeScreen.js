import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Title} from 'react-native-paper';
import {AuthContext} from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';
import Loading from '../components/Loading';
import firestore from '@react-native-firebase/firestore';
import {List, Divider} from 'react-native-paper';
import {Touchable, TouchableOpacity} from 'react-native';

export default function HomeScreen({navigation}) {
  const {logout, user} = useContext(AuthContext);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('THREADS')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            name: '',
            ...documentSnapshot.data(),
          };
        });
        if (loading) {
          setLoading(false);
        }

        console.log('rooms ', threads);

        setThreads(threads);
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Room', {thread: item});
            }}>
            <List.Item
              title={item.name}
              description={
                item.latestMessage
                  ? item.latestMessage.text
                  : 'Item description'
              }
              titleNumberOfLines={1}
              descriptionNumberOfLines={1}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
            />
          </TouchableOpacity>
        )}
      />

      {/* <Title>Home Screen</Title> */}
      {/* <Title>All chat rooms will be listed here</Title> */}
      {/* <Title>{user.uid}</Title> */}
      {/* <FormButton
        modeValue="contained"
        title="Logout"
        onPress={() => logout()}
      /> */}
      {/* <FormButton
        modeValue="contained"
        title="Add Room"
        onPress={() => navigation.navigate('AddRoom')}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
});
