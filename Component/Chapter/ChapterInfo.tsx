import { useCallback, useState } from "react";
import { ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { InputWithLabel, Loading, Timeout } from "../UI";
import { FloatingAction } from "react-native-floating-action";
let host = require('../Config').settings.serverPath;

// Actions for Floating Action
const actions = [
  {
    text: 'Edit Chapter',
    icon: require("../Images/edit.jpg"),
    name: 'edit'
  },
  {
    text: 'Delete Chapter',
    icon: require("../Images/delete.jpg"),
    name: 'delete'
  }
]

const ChapterInfo = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [chapterID] = useState(route.params.chapterID);
  const [courseID] = useState(route.params.courseID);
  // Used Variables
  const [chapter, setChapter] = useState<any>();
  let url = host + '/' + courseID + '/chapter/' + chapterID;

  // Run when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  )

  // fetch data from server
  const fetchData = async () => {
    // 5s Timeout
    const timeoutID = setTimeout(() => {
      setError('Request timed out');
      setLoading(false);
    }, 5000);

    // Fetch info of specific chapter
    setError('');
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setChapter(result);
      navigation.setOptions({headerTitle: result.chapterName});
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

  // Delete Chapter
  const deleteChapter = async () => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({chapterID: chapterID}),
      });
      const result = await response.json();
      if (result.affected > 0) {
        Alert.alert("Success", "Chapter deleted successfully.");
        navigation.goBack();
      }
    }
    catch (err) {
      Alert.alert("Error", "Failed to delete Chapter.");
    }
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

  // Main Screen
  return(
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <InputWithLabel 
        label = "Chapter No. :"
        value = {(chapter.chapterNo).toString()}
        editable = {false}/>
      <InputWithLabel 
        label = "Chapter Name:"
        value = {chapter.chapterName}
        editable = {false}/>
      <FloatingAction 
        actions={actions}
        floatingIcon={require("../Images/options.jpg")}
        onPressItem={name=>{
          switch(name) {
            case 'edit':
              navigation.navigate('ChapterEdit', {
                chapter: chapter,
              });
              break;
            case 'delete':
              Alert.alert('Confirm Deletion of: ', chapter.chapterNo + '. ' + chapter.chapterName + ' ?', [
                {
                  text: 'No',
                  onPress: () => {},
                },
                {
                  text: 'Yes',
                  onPress: () => deleteChapter(),
                }]);
              break;
          }
        }}
      />
    </ScrollView>
  );
}

export default ChapterInfo;