import React, {useState, useEffect, useRef} from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import {Camera, CameraType} from 'expo-camera'; 
import * as MediaLibrary from 'expo-media-library';
import TaskInputField from './components/TaskInputField';
import TaskItem from './components/TaskItem';
import Button from './components/Button';


export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setflash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takeAPicture = async () => {
    if(cameraRef) {
      try{
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      }catch(e){
        console.log(e);
      }
    }
  };

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('Saved To Gallery!');
        setImage(null);
      } catch (e) {
        console.log(e);
      }
    }
  };


  if(hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const addTask = (task) => {
    if (task == null) return;
    setTasks([...tasks, task]);
    Keyboard.dismiss();
  }

  const deleteTask = (deleteIndex) => {
    setTasks(tasks.filter((value, index) => index != deleteIndex));
  }

  return (
    <View style={styles.container}>
      {!image ?
      <Camera
        syle={styles.camera}
        type={type}
        flashMode={flash}
        ref={cameraRef}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 30,
          backgroundColor: '#1E1A3C',
        }}>
          <Button icon={'retweet'} onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back)
            }}/>
            <Button icon={'flash'} 
            color={flash === Camera.Constants.FlashMode.off ? 'white' : 'yellow'}
            onPress={() => {
              setflash(flash === Camera.Constants.FlashMode.on
                ? Camera.Constants.FlashMode.on 
                : Camera.Constants.FlashMode.off
                )
            }} />
        </View>
      </Camera>
      :
      <Image source={{uri: image}} style={styles.camera}/>
      }
      <View>
        {image ?
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 50
        }}>
          <Button title={'Re-take'} icon='retweet' onPress={() => setImage(null)} />
          <Button title={'Save'} icon='check' onPress={saveImage} />
        </View>
        :
        
        <Button title={'Take a pciture '} icon="camera" onPress={takeAPicture}/>
        }   
      </View>

        <Text style={styles.heading}>TODO LIST</Text>
      <ScrollView style={styles.scrollView}>
        {
        tasks.map((task, index) => {
          return (
            <View key={index} style={styles.taskContainer}>
              <TaskItem index={index + 1} task={task} deleteTask={() => deleteTask(index)}/>
            </View>
          );
        })
      }
      </ScrollView>
      <TaskInputField addTask={addTask}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#1E1A3C',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 20,
  },
  scrollView: {
    marginBottom: 70,
  },
  taskContainer: {
    marginTop: 20,
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },

});