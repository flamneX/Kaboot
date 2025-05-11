import { useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { InputWithLabel, AppButton } from "../UI";
let host = require('../Config').settings.serverPath;

const ChapterEdit = ({ route, navigation } : any) => {
  // Route Params
  const [chapter] = useState(route.params.chapter);
  // Used Variables
  const [chapterNo, setChapterNo] = useState(chapter.chapterNo);
  const [chapterName, setChapterName] = useState(chapter.chapterName);

  // Save edits made on Chapter
  const editChapter = async () => {
    if (!chapterNo || !chapterName) {
      Alert.alert("Error", "All fields must be filled in.");
    }
    else if (!(chapterNo > 0)) {
      Alert.alert("Error", "Chapter No. must be a valid number");
    }
    else {
      let url = host + '/' + chapter.courseID + '/chapter/' + chapter.chapterID;
      try {
        const response = await fetch(url, {
          method: 'PUT',
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
          Alert.alert("Success", "Chapter edited successfully.");
          navigation.goBack();
        }
      }
      catch (err) {
        Alert.alert("Error", "Error in editing Chapter.");
      }
    }
  }

  // Main Screen
  return(
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <InputWithLabel 
        label = "Chapter No.: "
        value = {(chapterNo).toString()}
        placeholder = "Enter Chapter Number"
        onChangeText = {(text:any) => setChapterNo(text)}/>
      <InputWithLabel 
        label = "Chapter Name:"
        value = {chapterName}
        placeholder = "Enter Chapter Name"
        onChangeText = {(text:any) => setChapterName(text)}/>
      <View style={{ height:10 }}/>
      <AppButton
        title = 'Save Changes'
        onPress={() => editChapter()}
      />
    </ScrollView>
  )
}

export default ChapterEdit;