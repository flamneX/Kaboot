import { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { headerStyles, inputStyles, QuestionField, RadioWithLabel } from '../UI';
import PagerView from 'react-native-pager-view';

const QuizAnswer = ({ route } : any) => {
  // Route Params
  const [questionList] = useState(route.params.questionList);
  const [answerList] = useState(route.params.answerList);

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
                containerStyle: {
                  backgroundColor: (question.questionAns == 'A' ? 'lightgreen' : undefined),
                  borderRadius: 15,
                },
                size: 30,
              }, {
                id: 'B',
                label: question.questionOpt2,
                containerStyle: {
                  backgroundColor: (question.questionAns == 'B' ? 'lightgreen' : undefined),
                  borderRadius: 15,
                },
                size: 30,
              }, {
                id: 'C',
                label: question.questionOpt3,
                containerStyle: {
                  backgroundColor: (question.questionAns == 'C' ? 'lightgreen' : undefined),
                  borderRadius: 15,
                },
                size: 30,
              }, {
                id: 'D',
                label: question.questionOpt4,
                containerStyle: {
                  backgroundColor: (question.questionAns == 'D' ? 'lightgreen' : undefined),
                  borderRadius: 15,
                },
                size: 30,
              }]}
              selectedId={answerList[index]}/>
          </View>
          <View style={inputStyles.bottomContainer}>
            <Text style={inputStyles.bottomLabel}>
              {(index == questionList.length-1 ? 'End of Quiz' : '<< Swipe >>')}
            </Text>
          </View>
        </ScrollView>
      )}
    </PagerView>
    );
}

export default QuizAnswer;