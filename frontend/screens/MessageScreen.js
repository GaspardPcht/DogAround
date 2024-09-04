import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from 'moment';
import 'moment/locale/fr'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Input from "../Components/Input";

export default function MessageScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value); //Recuperation paramètres de l'utilsateur stocké dans le STORE
  const [message, setMessage] = useState('');
  const [update, setUpdate] = useState(false);
  const [dataMessage, setDataMessage] = useState([]);

  //Récupération props
  const discussion_id = route.params.discussion_id;
  const discussion_pseudo = route.params.discussion_pseudo;

  /* console.log(discussion_id) */

  //Fonction Retour au screen précédent
  const handleClickBack = () => {
    navigation.goBack();
  };

  //Fonction Récupération de tous les messages
  const getMessages = () => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/discussions/messages/${user.token}?id=${discussion_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.result && setDataMessage(data.messages);
      });
  }

  //Fonction Nouveau message
  const newMessage = (message) => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/discussions/messages/${user.token}?id=${discussion_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message
      })
    })
      .then((response) => response.json())
      .then((data) => {
        data.result && setUpdate(!update);
        setMessage('');
        Keyboard.dismiss();
      })
  };

  useEffect(() => {
    //Rafraichissement des messages
    const interval = setInterval(() => {
      getMessages();
    }, 10000);

    //Raz Interval
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    //Mise à jour de l'affichage des messages à l'initialisation ou qu'un nouveau message est émi
    getMessages();
  }, [update])

  //Rendu de la liste de messages affichés
  const listMessage = dataMessage.map((e, i) => {
    /* const hours = new Date(e.date).toLocaleTimeString().slice(0, 5); */
    /* const date = moment(e.date).locale('fr').format('lll'); */
    const date = moment(e.date).locale('fr').fromNow();
    if (user.pseudo !== e.pseudo) {
      return (
        <View key={i} style={styles.messageWrapper}>
          <View style={styles.messageBubble}>
            <View style={styles.messageHeader}>
              <Image
                source={e.avatar}
                style={styles.avatar}
              />
              <View style={styles.messageInfo}>
                <Text style={styles.messageName}>{e.pseudo}</Text>
                <Text style={styles.messageTime}>{date}</Text>
              </View>
            </View>
            <Text style={styles.messageText}>{e.message}</Text>
          </View>
        </View>
      )
    }
    //Message reçu
    else {
      return (
        <View key={i} style={[styles.messageWrapper, styles.messageWrapperSend]}>
          <View style={styles.messageBubbleSend}>
            <View style={styles.messageHeaderSend}>
              <Image
                source={e.avatar}
                style={styles.avatar}
              />
              <View style={styles.messageInfoSend}>
                <Text style={styles.messageNameSend}>{e.pseudo}</Text>
                <Text style={styles.messageTimeSend}>{date}</Text>
              </View>
            </View>
            <Text style={styles.messageTextSend}>{e.message}</Text>
          </View>
        </View>
      )
    }
  })

  const scroll = useRef();

  return (
    <View style={styles.container}>
      {/* <SafeAreaView/> */}
      <View style={styles.headerMessage}>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.8} onPress={handleClickBack}>
          <FontAwesome name="arrow-left" size={40} color="#000" style={{ zIndex:1}}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{discussion_pseudo}</Text>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
        <ScrollView contentContainerStyle={styles.messageContainer}
          keyboardDismissMode='on-drag'
          ref={scroll}
          onContentSizeChange={() => {
            scroll.current.scrollToEnd();
          }}>
          {listMessage}
        </ScrollView>
        <View style={styles.footer}>
          <Input style={styles.input} placeholder="Message..." value={message} onChangeText={(value) => setMessage(value)} />
          <TouchableOpacity style={styles.sendButton} activeOpacity={0.8} onPress={() => newMessage(message)}>
            <FontAwesome name="paper-plane" size={25} color="#7DBA84" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E9ED",
    paddingTop: 30,
    justifyContent: "space-between"
  },
  headerMessage: {
    height: 60,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: "center",
    height: 60,
    width: 60,
    zIndex:10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  messageContainer: {
    padding: 10,
  },
  messageWrapper: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  messageWrapperSend: {
    flexDirection: "row-reverse",
  },
  messageBubble: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    paddingBottom: 5,
    maxWidth: "80%",
    flex: 1,
  },
  messageBubbleSend: {
    backgroundColor: "#7DBA84",
    borderRadius: 15,
    padding: 10,
    paddingBottom: 5,
    maxWidth: "80%",
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  messageHeaderSend: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    justifyContent: "flex-start",
  },
  messageInfoSend: {
    marginRight: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  messageName: {
    fontWeight: "bold",
  },
  messageNameSend: {
    fontWeight: "bold",
  },
  messageTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  messageTimeSend: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    textAlign: "left",
  },
  messageText: {
    fontSize: 16,
  },
  messageTextSend: {
    fontSize: 16,
    color: "#FFF",
  },
  footer: {
    height: 60,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
