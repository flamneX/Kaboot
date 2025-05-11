import { useEffect, useState } from 'react';
import { ScrollView, Image, Dimensions, View, Text, TextInput, TouchableNativeFeedback, StyleSheet } from 'react-native';
import { RadioGroup } from 'react-native-radio-buttons-group';
import { Picker } from '@react-native-picker/picker';

/**
 * InputWithLabel
 */
export const InputWithLabel = ( props: any ) => {
  return (
    <View style={inputStyles.container}>
      <Text style={inputStyles.label}>{props.label}</Text>
      <TextInput
        style={[inputStyles.input, props.style]}
        multiline = {true}
        {...props}
      />
    </View>
  );
}

/**
 * RadioWithLabel
 */
export const RadioWithLabel = ( props: any ) => {
  return <RadioGroup
      labelStyle={
        props.orientaion == 'horizontal' ? inputStyles.radioHorizontal : inputStyles.radioVertical}
      radioButtons={props.radioButtons}
      onPress={props.onPress}
      selectedId={props.selectedId}
      layout={props.orientaion == 'horizontal' ? 'row' : 'column'}
      {...props}/>
}

/**
 * Question Field
 */
export const QuestionField = ( props: any) => {
  return (
    <TextInput
      style = {inputStyles.questionField}
      multiline = {true}
      {...props}>
      {props.question}
    </TextInput>
  )
}

/**
 * Picker With Label
 */
export const PickerWithLabel = (props: any) => {
  return (
    <View style = {inputStyles.container}>
      <Text style = {inputStyles.label}>{props.label}</Text>
      <Picker 
        style = {inputStyles.picker}
        {...props}>
        {props.items.map((item:any) => {
          return (
            <Picker.Item 
              style={inputStyles.input}
              key={item.key}
              label={item.value} 
              value={item.key}
              />
          )
        })}
      </Picker>
    </View>
  )
}

/**
 * AppButton
 */
export const AppButton = ( props: any ) => {

  let backgroundColorTheme = '';

  if(props.theme) {
    switch(props.theme) {
      case 'info':
        backgroundColorTheme = '#FFFFFF';
        break;
      case 'primary':
        backgroundColorTheme = '#60717d';
        break;
      default:
        backgroundColorTheme = '#286090';
    }
  }
  else {
      backgroundColorTheme = '#286090';
  }

  return (
    <TouchableNativeFeedback
      onPress={props.onPress}
      onLongPress={props.onLongPress}>
      {props.icon ? (
        <View style={[buttonStyles.button, {backgroundColor: backgroundColorTheme, borderWidth:1 }]}>
          <Image source={props.icon} style = {{ width: 50, height: 50 }}/>
        </View>
      ) : (
        <View style={[buttonStyles.button, {backgroundColor: backgroundColorTheme, width: props.width}]}>
            <Text style={buttonStyles.buttonText}>{props.title}</Text>
        </View>
      )}
    </TouchableNativeFeedback>
  )
}

/**
 * Timeout Screen
 */
export const Timeout = ( props : any) => {
  return (
    <ScrollView 
    contentContainerStyle = {{ 
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style = {infoStyles.timeout}>Error: {props.error}</Text>
      <AppButton
        title = "Retry"
        onPress = {props.onPress}/>
    </ScrollView>
  )
}

/**
 * Loading Screen
 */
export const Loading = () => {
  const [loadingText, setLoadingText] = useState('Loading.');
  let counter = 0;

  useEffect(() => {
    const timer = setInterval(() => {
      if (counter < 2) {
        setLoadingText((prevText) => prevText + '.');
        counter++;
      }
      else {
        setLoadingText('Loading');
        counter = 0;
      }
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView 
    contentContainerStyle = {{ 
      flexGrow:1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style = {infoStyles.loading}>{loadingText}</Text>
    </ScrollView>
  )
}

// Styles
// Header styles
export const headerStyles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlignVertical: 'center',
    color: 'black',
  },
});

// Button styles
const buttonStyles = StyleSheet.create({
  button: {
    margin: 5,
    alignItems: 'center',
  },
  buttonText: {
    padding: 20,
    fontSize: 20,
    color: 'white',
  },
});

// Input styles
export const inputStyles = StyleSheet.create({
  container: {
    height: 100,
    flexDirection: 'row',
  },
  label: {
    flex: 1.5,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
    textAlignVertical: 'center',
  },
  input: {
    flex: 4,
    fontSize: 20,
    color: 'blue',
    borderBottomWidth:1,
  }, 
  picker: {
    height: 100,
    width: Dimensions.get('window').width*(4/5.5),
  },
  pickerLabel: {
    color: 'lightblue',
    margin: 10,
  },
  questionField: {
    width: Dimensions.get('window').width*0.95,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    fontSize: 22,
    color: 'black',
    padding: 10,
  },
  radioVertical: {
    fontSize: 22,
    color: 'black',
    padding: 10,
    flex: 1,
    flexDirection: 'row',
  },
  radioHorizontal: {
    fontSize: 22,
    color: 'black',
    padding: 10,
  },
  bottomContainer: {
    flex:1,
    alignItems:'center',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  bottomLabel: {
    fontSize: 30,
    padding: 10,
    textAlignVertical: 'center',
  }
});

// Text display info styles
const infoStyles = StyleSheet.create({
  loading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'grey',
    textAlignVertical: 'center',
  }, 
  timeout: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    textAlignVertical: 'center',
  }
})

// List display styles
export const listStyles = StyleSheet.create({
  container: {
    padding:10, 
    borderBottomWidth: 2,
    alignItems: 'flex-start',
    flexDirection: 'row',
    verticalAlign: 'bottom',
  },
  header: {
    fontSize:30,
    fontWeight:'bold',
  },
  description: {
    fontSize:20,
  }
})

// Tab bar styles
export const tabBarStyle = StyleSheet.create({
  topBar: {
    height: Dimensions.get('window').height * 0.06,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  topBarLabel: {
    fontSize: 18,
    textTransform: 'none',
  },
  bottomBar: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: Dimensions.get('window').height * .08,
    position: 'absolute',
    backgroundColor: 'grey',
  }
})