import { useState } from 'react';
import { ScrollView, View, Alert, Text } from 'react-native';
import { AppButton, InputWithLabel, QuestionField, RadioWithLabel } from '../UI';
let host = require('../Config').settings.serverPath;

const QuestionAdd = ({ route, navigation } : any) => {
  // Route Params
  const [courseID] = useState(route.params.courseID);
  const [chapterID] = useState(route.params.chapterID);
  // Used Variables
  const [questionAsk, setQuestionAsk] = useState('');
  const [questionOpt1, setQuestionOpt1] = useState('');
  const [questionOpt2, setQuestionOpt2] = useState('');
  const [questionOpt3, setQuestionOpt3] = useState('');
  const [questionOpt4, setQuestionOpt4] = useState('');
  const [questionAns, setQuestionAns] = useState('');

  // Add Question to database
  const addQuestion = async () => {
    if (!questionAsk || !questionOpt1 || !questionOpt2  || !questionOpt3 || !questionOpt4 || !questionAns) {
      Alert.alert("Error", "All fields must be filled in.");
    }
    else {
      let url = host + '/' + courseID + '/' + chapterID + '/question';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionAsk: questionAsk,
            questionOpt1: questionOpt1,
            questionOpt2: questionOpt2,
            questionOpt3: questionOpt3,
            questionOpt4: questionOpt4,
            questionAns: questionAns,
          }),
        });
        const result = await response.json();
        if (result.affected > 0) {
          Alert.alert("Success", "Question created successfully.");
          navigation.goBack();
        }
      }
      catch (err) {
        Alert.alert("Error", "Failed to create Question.");
      }
    }
  }

  //Main Screen
  return (
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <View style={{ alignItems: 'center' }}>
        <QuestionField 
          question = {questionAsk}
          placeholder = "Enter Question"
          onChangeText = {(text:any) => setQuestionAsk(text)}/>
        <InputWithLabel
          label = 'Option A: '
          value = {questionOpt1}
          placeholder = "Enter Option A"
          onChangeText = {(text:any) => setQuestionOpt1(text)}/>
        <InputWithLabel
          label = 'Option B: '
          value = {questionOpt2}
          placeholder = "Enter Option B"
          onChangeText = {(text:any) => setQuestionOpt2(text)}/>
        <InputWithLabel
          label = 'Option C: '
          value = {questionOpt3}
          placeholder = "Enter Option C"
          onChangeText = {(text:any) => setQuestionOpt3(text)}/>
        <InputWithLabel
          label = 'Option D: '
          placeholder = "Enter Option D"
          value = {questionOpt4}
          onChangeText = {(text:any) => setQuestionOpt4(text)}/>
        <Text style={{ fontSize:25 , fontWeight:'bold', height: 50, paddingTop: 10 }}>
          Answer:
        </Text>
        <RadioWithLabel
          radioButtons = {[{
            id: 'A',
            label: 'A',
            size: 30,
          }, {
            id: 'B',
            label: 'B',
            size: 30,
          }, {
            id: 'C',
            label: 'C',
            size: 30,
          }, {
            id: 'D',
            label: 'D',
            size: 30,
          }]}
          onPress = {setQuestionAns}
          selectedId = {questionAns}
          orientaion = 'horizontal'/>
      </View>
      <AppButton
        title = "Create Question"
        onPress = {() => addQuestion()}/>
    </ScrollView>
  );
}

export default QuestionAdd;