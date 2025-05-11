import { useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { InputWithLabel, AppButton } from "../UI";
let host = require('../Config').settings.serverPath;

const ChapterAdd = ({ route, navigation } : any) => {
  // Route Params  
  const [courseID] = useState(route.params.courseID);
  // Used Variables
  const [chapterNo, setChapterNo] = useState<any>();
  const [chapterName, setChapterName] = useState<any>('');

  // Add Chapter to database
  const addChapter = async () => {
    if (!chapterNo || !chapterName) {
      Alert.alert("Error", "All fields must be filled in.");
    }
    else if (!(chapterNo > 0)) {
      Alert.alert("Error", "Chapter No. must be a valid number");
    }
    else {
      let url = host + '/' + courseID + '/chapter';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chapterNo: chapterNo,
            chapterName: chapterName,
          }),
        });
        const result = await response.json();
        if (result.affected > 0) {
          Alert.alert("Success", "Chapter created successfully.");
          navigation.goBack();
        }
      }
      catch (err) {
        Alert.alert("Error", "Chapter No. already exists.");
      }
    }
  }

  // Main Screen
  return(
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <InputWithLabel 
        label = "Chapter No.:"
        value = {chapterNo}
        placeholder = "Enter Chapter Number"
        onChangeText = {(text:any) => setChapterNo(text)}/>
      <InputWithLabel 
        label = "Chapter Name:"
        value = {chapterName}
        placeholder = "Enter Chapter Name"
        onChangeText = {(text:any) => setChapterName(text)}/>
      <View style = {{ height:10 }}/>
      <AppButton
        title = 'Create Chapter'
        onPress={() => addChapter()}
      />
    </ScrollView>
  )
}

export default ChapterAdd;