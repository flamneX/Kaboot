import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, ScrollView } from "react-native";
import io from 'socket.io-client';
import { AppButton, InputWithLabel, Loading, Timeout } from "../UI";
let socketHost = require("../Config").settings.webSocket;
let host = require("../Config").settings.historyPath;

// Initialize web socket conection
var socket = io(socketHost + '/quiz', {
  transports: ['websocket'],
});

const HistoryInfo = ({route, navigation} : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [historyID] = useState(route.params.historyID);
  const [quizDate] = useState(route.params.quizDate);
  // Used Variables
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [questionList, setQuestionList] = useState<any[]>();
  const [answerList, setAnswerList] = useState<any[]>();

  // Run when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  )

  // Sends and receives data from websocket
  const connectSocket = (questionList: any[], answerList: any[]) => {
    // 5s Timeout
    const timeoutID = setTimeout(() => {
      setError('Request timed out');
      setLoading(false);
    }, 5000);
    
    setError('');
    setLoading(true);
    // Send answer for marking
    socket.emit('answer_client', {
      questionList: questionList,
      answerList: JSON.parse(JSON.stringify(answerList)),
    });

    // Receive marks
    socket.on('answer_server', (data:any) => {
      let result = JSON.parse(data);
      setCorrect(result.correct);
      setIncorrect(result.incorrect);

      setLoading(false);
      clearTimeout(timeoutID);
    });

    return () => clearTimeout(timeoutID);
  }

  // Fetch data from server
  const fetchData = async () => {
    // 5s Timeout
    const timeoutID = setTimeout(() => {
      setError('Request timed out');
      setLoading(false);
    }, 5000);

    // Fetch Data
    setError('');
    setLoading(true);
    let url = host + '/questionHistory/' + historyID;
    try {
      const response = await fetch(url);
      const result = await response.json();
      setQuestionList(result.questionList);
      setAnswerList(result.answerList);
      connectSocket(result.questionList, result.answerList);
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
      onPress = {() => fetchData()}/>
  }
  
  // Main Screen
  return(
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <InputWithLabel
        label = "Date Attempted: "
        value = {quizDate}
        editable = {false}/>
      <InputWithLabel
        label = "Correct : "
        value = {correct.toString() + " / " + (correct + incorrect).toString()}
        editable = {false}/>
      <InputWithLabel
        label = "Incorrect : "
        value = {incorrect.toString() + " / " + (correct + incorrect).toString()}
        editable = {false}/>
      <InputWithLabel
        label = "Marks: "
        value = {(correct/(correct + incorrect)*100).toString() + "%"}
        editable = {false}/>
      <View style={{ height:10 }}/>
      <AppButton
        title = "Check Answers"
        onPress = {() => {navigation.navigate("QuizAnswer", {
          questionList: questionList,
          answerList: answerList,
        })}}/>
    </ScrollView>
  )
}

export default HistoryInfo;