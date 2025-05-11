import { useCallback, useState } from "react";
import { ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { InputWithLabel, Loading, Timeout } from "../UI";
import { FloatingAction } from "react-native-floating-action";
let host = require('../Config').settings.serverPath;

// Actions for Floating Action
const actions = [
  {
    text: 'Edit Course',
    icon: require("../Images/edit.jpg"),
    name: 'edit'
  },
  {
    text: 'Delete Course',
    icon: require("../Images/delete.jpg"),
    name: 'delete'
  }
]

const CourseInfo = ({ route, navigation } : any) => {
  // Fetching States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Route Params
  const [courseID] = useState(route.params.courseID);
  // Used Variables
  const [course, setCourse] = useState<any>();
  let url = host + '/course/' + courseID;

  // Run when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Fetch data from server
  const fetchData = async () => {
    // 5 sec Timeout
    const timeoutID = setTimeout(() => {
      setError('Request timed out');
      setLoading(false);
    }, 5000);

    // Fetch info of specific course
    setError('');
    setLoading(true);
    try {
      const response = await fetch(url);
      const result = await response.json();
      setCourse(result);
      navigation.setOptions({headerTitle: result.courseCode});
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

  // Delete course
  const deleteCourse = async () => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({courseID: courseID}),
      });
      const result = await response.json();
      if (result.affected > 0) {
        Alert.alert("Success", "Course deleted successfully.");
        navigation.goBack();
      }
    }
    catch (err) {
      Alert.alert("Error", "Failed to delete Course.");
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

  // Main Screen
  return(
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <InputWithLabel 
        label = "Course Code:"
        value = {course.courseCode}
        editable = {false}/>
      <InputWithLabel 
        label = "Course Name:"
        value = {course.courseName}
        editable = {false}/>
      <FloatingAction 
        actions={actions}
        floatingIcon={require("../Images/options.jpg")}
        onPressItem={name=>{
          switch(name) {
            case 'edit':
              navigation.navigate('CourseEdit', {
                course: course,
              });
              break;
            case 'delete':
              Alert.alert('Confirm Deletion of: ', course.courseCode + ' ' + course.courseName + ' ?', [
                {
                  text: 'No',
                  onPress: () => {},
                },
                {
                  text: 'Yes',
                  onPress: () => deleteCourse(),
                }]);
              break;
          }
        }}
      />
    </ScrollView>
  );
}


export default CourseInfo;