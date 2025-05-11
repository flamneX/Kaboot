import { useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { InputWithLabel, AppButton } from "../UI";
let host = require('../Config').settings.serverPath;

const CourseAdd = ({ navigation } : any) => {
  // Used Variables
  const [courseCode, setCourseCode] = useState<any>('');
  const [courseName, setCourseName] = useState<any>('');

  // Add Course to database
  const addCourse = async () => {
    if (!courseCode || !courseName) {
      Alert.alert("Error", "All fields must be filled in.");
    }
    else if (courseCode.length != 8) {
      Alert.alert("Error", "Course Code must be 8 characters long.");
    }
    else {
      let url = host + '/course';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseCode: courseCode,
            courseName: courseName,
          }),
        });
        const result = await response.json();
        if (result.affected > 0) {
          Alert.alert("Success", "Course created successfully.");
          navigation.goBack();
        }
      }
      catch (err) {
        Alert.alert("Error", "Course Code already exists.");
      }
    }
  }

  // Main Screen
  return(
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <InputWithLabel 
        label = "Course Code:"
        value = {courseCode}
        placeholder = "Enter Course Code (8 Characters)"
        onChangeText = {(text:any) => setCourseCode(text)}/>
      <InputWithLabel 
        label = "Course Name:"
        value = {courseName}
        placeholder = "Enter Course Name"
        onChangeText = {(text:any) => setCourseName(text)}/>
      <View style = {{ height:10 }}/>
      <AppButton
        title = 'Create Course'
        onPress={() => addCourse()}
      />
    </ScrollView>
  )
}

export default CourseAdd;