import { useState } from 'react';
import { ScrollView, View, Alert, Text } from 'react-native';
import { AppButton, InputWithLabel, QuestionField, RadioWithLabel } from '../UI';
let host = require('../Config').settings.serverPath;

const QuestionEdit = ({ route, navigation } : any) => {
  // Route Params
  const [question] = useState(route.params.question);
  // Used Variables
  const [questionAsk, setQuestionAsk] = useState(question.questionAsk);
  const [questionOpt1, setQuestionOpt1] = useState(question.questionOpt1);
  const [questionOpt2, setQuestionOpt2] = useState(question.questionOpt2);
  const [questionOpt3, setQuestionOpt3] = useState(question.questionOpt3);
  const [questionOpt4, setQuestionOpt4] = useState(question.questionOpt4);
  const [questionAns, setQuestionAns] = useState(question.questionAns);

  // Save edits made on Question
  const editQuestion = async () => {
    if (!questionAsk || !questionOpt1 || !questionOpt2  || !questionOpt3 || !questionOpt4 || !questionAns) {
      Alert.alert("Error", "All fields must be filled in.");
    }
    else {
      let url = host + '/' + question.courseID + '/' + question.chapterID + '/question/' + question.questionID;
      try {
        const response = await fetch(url, {
          method: 'PUT',
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
          Alert.alert("Success", "Question edited successfully.");
          navigation.goBack();
        }
      }
      catch (err) {
        Alert.alert("Error", "Failed to edit Question.");
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
          value = {questionOpt4}
          placeholder = "Enter Option D"
          onChangeText = {(text:any) => setQuestionOpt4(text)}/>
        <Text style={{ fontSize:25, fontWeight: 'bold', height: 50, paddingTop: 10 }}>
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
          title = "Save Changes"
          onPress = {() => editQuestion()}/>
    </ScrollView>
  );
}

export default QuestionEdit;