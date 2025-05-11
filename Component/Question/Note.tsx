import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View, Dimensions } from 'react-native';
import { Loading, QuestionField, Timeout } from '../UI';
import { FloatingAction } from 'react-native-floating-action';
let host = require('../Config').settings.serverPath;

const Note = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [courseID] = useState(route.params.courseID);
  const [chapterID] = useState(route.params.chapterID);
  const [editable] = useState(route.params.editable);
  // Used Variables
  const [windowHeight] = useState(Dimensions.get('window').height);
  const [note, setNote] = useState<any>();
  
  // Run when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    },[])
  )

  // Fetch data from server
  const fetchData = async () => {
    // 5 sec Timeout
    const timeoutID = setTimeout(() => {
      setError('Request timed out');
      setLoading(false);
    }, 5000);

    // Fetch note
    setError('');
    setLoading(true);
    let url = host + '/' + courseID + '/' + chapterID + '/note';
    try {
      const response = await fetch(url);
      const result = await response.json();
      setNote(result);
    }
    catch (err) {
      setError("Failed to fetch data");
    }
    finally {
      setLoading(false);
      clearTimeout(timeoutID);
    }

    return () => clearTimeout(timeoutID);
  }

  // Loading Screen
  if (loading) {
    return <Loading/>
  }

  // Error Screen
  if (error) {
    return <Timeout
      error = {error}
      onPress = {() => fetchData()}
    />
  }

  //Main Screen
  return (
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <View style={{ alignItems: 'center' }}>
        <QuestionField
          question = {note}
          editable = {false}
          placeholder = {editable ? "Write Some Notes Here " : "No Notes Found"}/>
      </View>
      {editable ? (
        <FloatingAction
          distanceToEdge = {{ vertical : windowHeight*0.1, horizontal : 30}}
          actions = {[
            {
              text: 'Edit Note',
              icon: require("../Images/edit.jpg"),
              name: 'add'
            }
          ]}
          floatingIcon={require("../Images/options.jpg")}
          onPressItem={() => navigation.navigate('NoteEdit', {
            courseID: courseID,
            chapterID: chapterID,
            note: note,
          })}/>
      ) : (
        <View/>
      )}
    </ScrollView>
  );
}

export default Note;