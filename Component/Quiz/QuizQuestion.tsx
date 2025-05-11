import { useState, useCallback} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, View, ScrollView } from "react-native";
import { AppButton, InputWithLabel, Loading, Timeout } from "../UI";
let host = require('../Config').settings.serverPath;

const QuizQuestion = ({route, navigation} : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [accountID] = useState(route.params.accountID);
  const [courseID] = useState(route.params.courseID);
  const [selectedChapter] = useState(route.params.selectedChapter);
  // Used Variables
  const [questionList, setQuestionList] = useState<any[]>([]);
  const [questionNo, setQuestionNo] = useState<any>();
  
  // Run when screen is focused
  useFocusEffect(
    useCallback(() => {
      setQuestionList([]);
      fetchData(selectedChapter)
    }, [])
  );

  // Fetch data from server
  const fetchData = async (chapterList : any) => {
    // 5s Timeout
    const timeoutID = setTimeout(() => {
      setError('Request timed out');
      setLoading(false);
    }, 5000);

    // Fetch list of questions of selected chapters
    setError('');
    setLoading(true);
    for (const chapterID of chapterList) {
      let url = host + '/' + courseID + "/" + chapterID + "/question";
      try {
        const response = await fetch(url);
        const result = await response.json();
        setQuestionList(prevList => [...prevList, ...result]);
      }
      catch (err) {
        setError("Failed to fetch Data");
      }
      finally {
        setLoading(false);
        clearTimeout(timeoutID);
      }
    };

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
      onPress = {() => {
        fetchData(selectedChapter)
      }}/>
  }

  // Main Screen
  return(
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <InputWithLabel
        label = "Questions available: "
        value = {questionList.length.toString()}
        editable = {false}/>
      <InputWithLabel 
        label = "No. of question: "
        value = {questionNo}
        inputMode = 'numeric'
        placeholder = "Enter question amount"
        onChangeText = {(text:any) => setQuestionNo(text)}/>
      <View style={{ height:10 }}/>
      <AppButton
        title = "Start Quiz"
        onPress = {() => {
          if (questionNo > 0 && questionNo <= questionList.length) {
            navigation.navigate('QuizStart', {
              accountID: accountID,
              courseID: courseID,
              questionList: questionList,
              questionNo: questionNo,
            });
          }
          else {
            Alert.alert("Error", "Invalid question amount.");
          }
        }}/>
    </ScrollView>
  )
}

export default QuizQuestion;