import { useState, useEffect } from 'react';
import { ScrollView, View, Alert, Text, Dimensions } from 'react-native';
import io from 'socket.io-client';
import { AppButton, Loading, QuestionField, Timeout, RadioWithLabel, headerStyles, inputStyles } from '../UI';
import PagerView from 'react-native-pager-view';
let host = require("../Config").settings.webSocket;

// Initialize web socket conection
var socket = io(host + '/quiz', {
  transports: ['websocket'],
});

const QuizStart = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [accountID] = useState(route.params.accountID);
  const [courseID] = useState(route.params.courseID);
  // Used Variables
  const [questionList, setQuestionList] = useState<any[]>([]);
  const [answerList, setAnswerList] = useState<string[]>([]);
  
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
    setAnswerList([]);
    // Send questionList to server to randomize
    socket.emit('question_client', {
      questionList: route.params.questionList,
      questionNo: route.params.questionNo,
    });

    // Receive randomized questionList
    socket.on('question_server', (data:any) => {
      let result = JSON.parse(data);
      setQuestionList(result.questionList);
      for (let i = 0; i < result.questionList.length; i++) {
        setAnswerList(prevAnswer => [...prevAnswer, '']);
      }
      clearTimeout(timeoutID);
      setLoading(false);
    });

    return () => clearTimeout(timeoutID);
  };

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
  return (
    <PagerView style={{ flex: 1 }} initialPage={0}>
      {questionList.map((question:any, index:any) => 
        <ScrollView contentContainerStyle = {{ flexGrow:1 }} key = {index}>
          <Text style={headerStyles.text}> Question: {index+1}</Text>
          <View style={{ alignItems: 'center' }}>
            <QuestionField 
              question = {question.questionAsk}
              editable = {false}/>
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <RadioWithLabel
              radioButtons={[{
                id: 'A',
                label: question.questionOpt1,
                size: 30,
              }, {
                id: 'B',
                label: question.questionOpt2,
                size: 30,
              }, {
                id: 'C',
                label: question.questionOpt3,
                size: 30,
              }, {
                id: 'D',
                label: question.questionOpt4,
                size: 30,
              }]}
              selectedId={answerList[index]}
              onPress={(value:any) => {
                const newList = [...answerList];
                newList[index] = value;
                setAnswerList(newList);
              }}/>
            </View>
            <View style={inputStyles.bottomContainer}>
              {index == questionList.length-1 ? (
                <AppButton
                title = "Submit"
                width = {Dimensions.get('window').width*0.99}
                onPress = {() => Alert.alert("Finish?", "Compelete and Submit the quiz?", [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                  }, {
                    text: 'Confirm',
                    onPress: () => navigation.navigate('QuizResult', {
                      accountID: accountID,
                      courseID: courseID,
                      questionList: questionList,
                      answerList: answerList,
                    })
                  }
                ])}/>
              ) : (
                <Text style={inputStyles.bottomLabel}>{"<< Swipe >>"}</Text>
              )}
          </View>
        </ScrollView>
      )}
    </PagerView>
    );
}

export default QuizStart;