import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import { Camera, CameraType } from 'expo-camera'
import { useEffect, useState, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons'

export default function App() {
  const camRef = useRef(null)
  const [type, setType] = useState(CameraType.back)
  const [hasPermission, setHasPermission] = useState(null)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [open, setOpen] = useState(false)

  // permitir uso da camera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, [])

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Acesso negado!</Text>;
  }

  // tirar foto
  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync()
      setCapturedPhoto(data.uri)
      setOpen(true)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={camRef}
      >
        <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 13,
              left: 20,
            }}
            onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back)
            }}>
            <Text style={{ fontSize: 20, color: '#FFF' }}>
              Virar
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <FontAwesome name='camera' size={23} color='#FFF' />
        </TouchableOpacity>
      </Camera>

      {/* mostrar foto */}
      {capturedPhoto &&
        <Modal
          animationType='slide'
          transparent={false}
          statusBarTranslucent={true}
          visible={open}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ImageBackground
              style={styles.picture}
              source={{ uri: capturedPhoto }}
            >
              <TouchableOpacity style={{ marginBottom: 50}} onPress={() => setOpen(false)}>
                <FontAwesome name='window-close' size={50} color='#FF0000' />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </Modal>

      }

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    margin: 20,
    borderRadius: 10,
    height: 50,
  },
  picture: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
