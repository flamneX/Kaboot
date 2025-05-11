import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View, Alert } from 'react-native';
import { Loading, QuestionField, RadioWithLabel, Timeout } from '../UI';
import { FloatingAction } from 'react-native-floating-action';
let host = require('../Config').settings.serverPath;

// Actions for Floating Action
const actions = [
  {
    text: 'Edit Question',
    icon: require("../Images/edit.jpg"),
    name: 'edit'
  },
  {
    text: 'Delete Question',
    icon: require("../Images/delete.jpg"),
    name: 'delete'
  }
]

const QuestionInfo = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [courseID] = useState(route.params.courseID);
  const [chapterID] = useState(route.params.chapterID);
  const [questionID] = useState(route.params.questionID);
  // Used Variables
  const [question, setQuestion] = useState<any>();
  let url = host + '/' + courseID + '/' + chapterID + '/question/' + questionID;
  
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

    // Fetch info of specific question
    setError('');
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setQuestion(result);
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

  // Delete question
  const deleteQuestion = async () => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({questionID: questionID}),
      });
      const result = await response.json();
      if (result.affected > 0) {
        Alert.alert("Success", "Question deleted successfully.");
        navigation.goBack();
      }
    }
    catch (err) {
      Alert.alert("Error", "Failed to delete Question.");
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

  //Main Screen
  return (
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
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
          selectedId={question.questionAns}
        />
      </View>
      <FloatingAction 
        actions={actions}
        floatingIcon={require("../Images/options.jpg")}
        onPressItem={name=>{
          switch(name) {
            case 'edit':
              navigation.navigate('QuestionEdit', {
                question: question,
              });
              break;
            case 'delete':
              Alert.alert('Confirm Deletion of: ', 'Question?', [
                {
                  text: 'No',
                  onPress: () => {},
                },
                {
                  text: 'Yes',
                  onPress: () => deleteQuestion(),
                }]);
              break;
          }
        }}
      />
    </ScrollView>
  );
}

export default QuestionInfo;