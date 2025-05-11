import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { headerStyles } from "./Component/UI";
// Login Screen
import Login from "./Component/Login";
// Home Screen
import HomeTab from "./Component/HomeTab";
//Account Screens
import AccountTab from "./Component/Account/AccountTab";
import AccountInfo from "./Component/Account/AccountInfo";
import AccountAdd from "./Component/Account/AccountAdd";
import AccountEdit from "./Component/Account/AccountEdit";
//Course Screens
import CourseList from "./Component/Course/CourseList";
import CourseInfo from "./Component/Course/CourseInfo";
import CourseAdd from "./Component/Course/CourseAdd";
import CourseEdit from "./Component/Course/CourseEdit";
// Chapter Screens
import ChapterList from "./Component/Chapter/ChapterList";
import ChapterInfo from "./Component/Chapter/ChapterInfo";
import ChapterAdd from "./Component/Chapter/ChapterAdd";
import ChapterEdit from "./Component/Chapter/ChapterEdit";
// Question Screens
import QuestionTab from "./Component/Question/QuestionTab";
import QuestionInfo from "./Component/Question/QuestionInfo";
import QuestionAdd from "./Component/Question/QuestionAdd";
import QuestionEdit from "./Component/Question/QuestionEdit";
// Note Screens
import Note from "./Component/Question/Note";
import NoteEdit from "./Component/Question/NoteEdit";
// Quiz Screens
import QuizChapter from "./Component/Quiz/QuizChapter";
import QuizQuestion from "./Component/Quiz/QuizQuestion";
import QuizStart from "./Component/Quiz/QuizStart";
import QuizResult from "./Component/Quiz/QuizResult";
import QuizAnswer from "./Component/Quiz/QuizAnswer";
// Quiz History Screens
import HistoryDate from "./Component/QuizHistory/HistoryDate";
import HistoryList from "./Component/QuizHistory/HistoryList";
import HistoryInfo from "./Component/QuizHistory/HistoryInfo";

const stack = createStackNavigator();

const App = () => {
  return(
  <NavigationContainer>
    <stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerTitleStyle: headerStyles.text,
        headerTitleAlign: 'center',
      }}>
      <stack.Screen 
        name="Login" 
        component={Login}
        options = {{headerTitle: 'Login'}}/>
      <stack.Screen
        name="HomeTab"
        component={HomeTab}
        options={{
          headerTitle: 'Kaboot',
          headerLeft: () => null,
        }}/>
      <stack.Screen // Account Screens
        name="AccountTab"
        component={AccountTab}
        options={{headerTitle: 'Accounts'}}/>
      <stack.Screen
        name="AccountAdd"
        component={AccountAdd}
        options={{headerTitle: 'Create Account'}}/>
      <stack.Screen
        name="AccountInfo"
        component={AccountInfo}
        options={{headerTitle: 'Account Info'}}/>
      <stack.Screen
        name="AccountEdit"
        component={AccountEdit}
        options={{headerTitle: 'Edit Account'}}/>
      
      <stack.Screen // Course Screens
        name="CourseList"
        component={CourseList}
        options={{headerTitle: 'Select Course'}}/>
      <stack.Screen
        name="CourseAdd"
        component={CourseAdd}
        options={{headerTitle: 'Create Course'}}/>
      <stack.Screen
        name="CourseInfo"
        component={CourseInfo}
        options={{headerTitle: 'Course Info'}}/>
      <stack.Screen
        name="CourseEdit"
        component={CourseEdit}
        options={{headerTitle: 'Edit Course'}}/>
  
      <stack.Screen // Chapter Screens
        name="ChapterList"
        component={ChapterList}
        options={{headerTitle: 'Select Chapter'}}/>
      <stack.Screen
        name="ChapterAdd"
        component={ChapterAdd}
        options={{headerTitle: 'Create Chapter'}}/>
      <stack.Screen
        name="ChapterInfo"
        component={ChapterInfo}
        options={{headerTitle: 'Chapter Info'}}/>
      <stack.Screen
        name="ChapterEdit"
        component={ChapterEdit}
        options={{headerTitle: 'Edit Chapter'}}/>
      
      <stack.Screen // Question Screens
        name="QuestionTab"
        component={QuestionTab}
        options={{headerTitle: 'Questions/Notes'}}/>
      <stack.Screen
        name="QuestionAdd"
        component={QuestionAdd}
        options={{headerTitle: 'Create Question'}}/>
      <stack.Screen
        name="QuestionInfo"
        component={QuestionInfo}
        options={{headerTitle: 'Question Info'}}/>
      <stack.Screen
        name="QuestionEdit"
        component={QuestionEdit}
        options={{headerTitle: 'Edit Question'}}/>

      <stack.Screen // Note Screens
        name="Note" 
        component={Note}
        options={{headerTitle: 'Notes'}}/>
      <stack.Screen
        name="NoteEdit"
        component={NoteEdit}
        options={{headerTitle: 'Edit Note'}}/>
      
      <stack.Screen // Quiz Screens
        name="QuizChapter"
        component={QuizChapter}
        options={{headerTitle: 'Select Chapter'}}/>
      <stack.Screen
        name="QuizQuestion"
        component={QuizQuestion}
        options={{headerTitle: 'Question Amount'}}/>
      <stack.Screen
        name="QuizStart"
        component={QuizStart}
        options={{
          headerTitle: 'Quiz'
        }}/>
      <stack.Screen
        name="QuizResult"
        component={QuizResult}
        options={{
          headerTitle: 'Results',
          headerLeft: () => null,
        }}/>
      <stack.Screen
        name="QuizAnswer"
        component={QuizAnswer}
        options={{
          headerTitle: 'Answers',
        }}/>

      <stack.Screen // Quiz History Screens
        name="HistoryDate"
        component={HistoryDate}
        options={{headerTitle: 'Select Date'}}/>
      <stack.Screen
        name="HistoryList"
        component={HistoryList}
        options={{headerTitle: 'Quiz Attempts'}}/>
      <stack.Screen
        name="HistoryInfo"
        component={HistoryInfo}
        options={{headerTitle: 'Quiz Results'}}/>
    </stack.Navigator>
  </NavigationContainer>
  )
}

export default App;