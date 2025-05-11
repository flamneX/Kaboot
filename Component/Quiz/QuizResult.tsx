import { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import io from 'socket.io-client';
import { AppButton, InputWithLabel, Loading, Timeout } from "../UI";
let host = require("../Config").settings.webSocket;

// Initialize web socket conection
var socket = io(host + '/quiz', {
  transports: ['websocket'],
});

const QuizResult = ({route, navigation} : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [accountID] = useState(route.params.accountID);
  const [courseID] = useState(route.params.courseID);
  const [questionList] = useState(route.params.questionList);
  const [answerList] = useState(route.params.answerList);
  // Used Variables
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [quizDate, setQuizDate] = useState();
  
  // Run when mounting
  useEffect(() => {
    connectSocket();
  }, []);
  
  // Sends and receives data from websocket
  const connectSocket = () => {
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

    // Send data to store in Database
    socket.emit('quiz_submit_client', {
      questionList: questionList,
      answerList: JSON.parse(JSON.stringify(answerList)),
      accountID: JSON.parse(JSON.stringify(accountID)),
      courseID: JSON.parse(JSON.stringify(courseID)),
    });

    // Receive marks
    socket.on('answer_server', (data:any) => {
      let result = JSON.parse(data);
      setCorrect(result.correct);
      setIncorrect(result.incorrect);
      setQuizDate(result.quizDate);

      setLoading(false);
      clearTimeout(timeoutID);
    });

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
      onPress = {() => connectSocket()}/>
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
      <AppButton
        title = "Back to Home Screen"
        theme = "primary"
        onPress = {() => {
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
        }}/>
    </ScrollView>
  )
}

export default QuizResult;