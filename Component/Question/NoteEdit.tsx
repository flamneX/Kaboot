import { useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { AppButton, QuestionField } from '../UI';
let host = require('../Config').settings.serverPath;

const NoteEdit = ({ route, navigation } : any) => {
  // Route Params
  const [courseID] = useState(route.params.courseID);
  const [chapterID] = useState(route.params.chapterID);
  const [note, setNote] = useState(route.params.note);

  // Save Changes made on note
  const editNote = async () => {
    let url = host + '/' + courseID + '/' + chapterID + '/note';
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({note: note}),
      });
      const result = await response.json();
      if (result.affected > 0) {
        Alert.alert("Success", "Note edited successfully.");
        navigation.goBack();
      }
    }
    catch (err) {
      Alert.alert("Error", "Failed to edit Note.");
    }
  }

  //Main Screen
  return (
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <View style={{ alignItems: 'center' }}>
        <QuestionField
          question = {note}
          placeholder = "Write Some Notes Here"
          onChangeText = {(text:any) => setNote(text)}/>
      </View>
      <View style={{ height:10 }}/>
      <AppButton
        title = 'Save Changes'
        onPress = {() => editNote()}/>
    </ScrollView>
  );
}

export default NoteEdit;