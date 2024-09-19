import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import Btn from "../Components/Button";
import { addFavorite, removeFavorite } from "../reducers/user";
import moment from "moment";
import "moment/locale/fr";

export default function PoiScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const [poiInfos, setPoiInfos] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likedCompt, setLikedCompt] = useState(Math.floor(Math.random() * 10));
  const [showNewComment, setShowNewComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      pseudo: "Alain",
      avatar: require("../assets/avatars/chien_1.png"),
      date: "le 13 août à 15:32",
      text: "Superbe endroit pour se reposer!",
    },
    {
      pseudo: "Jessi",
      avatar: require("../assets/avatars/chien_19.png"),
      date: "le 13 août à 12:15",
      text: "J'ai adoré ce coin de promenade!",
    },
    {
      pseudo: "John",
      avatar: require("../assets/avatars/chien_21.png"),
      date: "le 12 août à 18:42",
      text: "J'ai vu des très beaux photos de ce lieu!",
    },
    {
      pseudo: "Momo",
      avatar: require("../assets/avatars/chien_25.png"),
      date: "le 11 août à 12:04",
      text: "C'est la plus belle de la ville",
    },
  ]);

  const isFocused = useIsFocused();
  const [isModalVisible, setModalVisible] = useState(false);
  const horaires = poiInfos.horaires || [];
  const id = route.params.google_id;
  const date = moment().locale("fr").format("lll");

  const user = useSelector((state) => state.user.value);
  const places = useSelector((state) => state.places.value);
  const pseudo = user.pseudo;

  useEffect(() => {
    if (isFocused && id) {
      fetch(`${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/places/id/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.place) {
            setPoiInfos({
              _id: data.place._id,
              image: data.place.image,
              nom: data.place.nom,
              adresse: data.place.adresse,
              horaires: data.place.horaires,
              description: data.place.description,
              categorie: data.place.categorie,
              location: data.place.location,
            });
          }
        });
    }
  }, [isFocused]);

  const handleClickCloseScreen = () => {
    navigation.navigate("TabNavigator", { screen: "Map" });
  };

  const hearthHandlePress = () => {
    if (!user.favorites.includes(id)) {
      dispatch(addFavorite(id));
      setIsFavorite(true);
    } else {
      dispatch(removeFavorite(id));
      setIsFavorite(false);
    }
  };

  const likePress = () => {
    setLikedCompt(isLiked ? likedCompt - 1 : likedCompt + 1);
    setIsLiked(!isLiked);
  };

  const handlePressNewComment = () => {
    setShowNewComment(!showNewComment);
  };

  const handleClickGoToEvent = () => {
    navigation.navigate("Event", { nom: poiInfos.nom, image: poiInfos.image });
  };

  const handleClickGoToNewEvent = () => {
    navigation.navigate("NewEvent", {
      nom: poiInfos.nom,
      image: poiInfos.image,
    });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const taggleModal = () => {
    setShowNewComment(!showNewComment);
  };

  const AddComment = () => {
    const nouveauCommentaire = {
      pseudo: user.pseudo,
      avatar: user.avatar,
      date: date,
      text: newComment,
    };
    setNewComment("");
    setComments([nouveauCommentaire, ...comments]);
    taggleModal();
  };

  const formatedComments = comments.map((comment, i) => (
    <View style={styles.commentaireContainer} key={i}>
      <View style={styles.commentTitle}>
        <Image style={styles.userAvatar} source={comment.avatar} />
        <View style={styles.commentTextContainer}>
          <Text style={styles.commentPseudo}>{comment.pseudo}</Text>
          <Text style={styles.commentTime}>{comment.date}</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        </View>
      </View>
    </View>
  ));

  const handleNewComment = () => {
    const CommentToAdd = {
      pseudo: user.pseudo,
      avatar: user.avatar,
      date: new Date(),
      text: newComment,
    };
    setNewComment(CommentToAdd);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7DBA84" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={handleClickCloseScreen}
            style={styles.closeIcon}
          >
            <FontAwesome name="times" size={25} color="#FFF" />
          </TouchableOpacity>
          <Image source={{ uri: poiInfos.image }} style={styles.headerImage} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{poiInfos.nom}</Text>
            <TouchableOpacity onPress={hearthHandlePress}>
              <FontAwesome
                name="heart"
                style={[
                  styles.heartIcon,
                  { color: isFavorite ? "#FF0000" : "#FFFFFF" },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <View style={styles.detail}>
            <Text style={styles.KeyText}>Adresse:</Text>
            <Text style={styles.infoText}>{poiInfos.adresse}</Text>
          </View>
          <View style={styles.HorairesModale}>
            <Text style={styles.horaires}>Horaires:</Text>
            <FontAwesome
              onPress={toggleModal}
              name="caret-down"
              size={25}
              color="#000"
            />
          </View>
          <View style={styles.DescriptionContainer}>
            <Text style={styles.KeyText}>Description:</Text>
            <Text style={styles.infoText}>{poiInfos.description}</Text>
          </View>

          <Btn
            title="Créer un événement"
            style={styles.boutonItineraire}
            onPress={handleClickGoToNewEvent}
          />

          <View style={styles.commentaireHeader}>
            <Text style={styles.KeyText}>Commentaires:</Text>
            <FontAwesome
              name="plus"
              style={styles.plusIcon}
              onPress={taggleModal}
            />
          </View>

          <View style={styles.ZoneCommentaire}>
            <Modal
              transparent={true}
              visible={showNewComment}
              onRequestClose={taggleModal}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.commentTitle}>
                    <View style={styles.avatarContainer}>
                      <Image source={user.avatar} style={styles.userAvatar} />
                    </View>
                    <View style={styles.commentTextContainer}>
                      <Text style={styles.commentPseudo}>{user.pseudo}</Text>
                      <Text style={styles.commentTime}>{date}</Text>
                    </View>
                  </View>
                  <View style={styles.commentTextContainer}>
                    <TextInput
                      multiline={true}
                      placeholder="nouveau commentaire"
                      style={styles.commentInput}
                      onChangeText={(text) => setNewComment(text)}
                      value={newComment}
                    />
                  </View>
                  <View style={styles.btnContainer}>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={handleNewComment}
                    >
                      <Btn title="Valider" onPress={AddComment} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            {formatedComments}
          </View>
        </View>
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Horaires Complet</Text>
              <ScrollView>
                {horaires !== "non disponible" ? (
                  horaires.map((horaire, index) => (
                    <View key={index} style={styles.horaireItem}>
                      <Text>{horaire}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.horaireText}>
                    Aucun horaire disponible
                  </Text>
                )}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleModal}
              >
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#FFF",
  },
  headerContainer: {
    position: "relative",
  },
  titleContainer: {
    top: 104,
    position: "absolute",
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  likeZone: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  likeText: {
    marginLeft: 8,
    fontSize: 20,
    color: "#416165",
    fontWeight: "bold",
  },
  eventButton: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    height: 30,
    width: 125,
    justifyContent: "center",
    marginVertical: 5,
    marginLeft: 20,
    marginRight: 15,
    fontSize: "12",
    paddingVertical: 1,
  },
  commentButton: {
    width: "90%",
    height: 30,
    marginBottom: 15,
    alignItems: "center",
    marginLeft: 20,
    fontSize: "12",
    paddingVertical: 1,
  },
  boutonItineraire: {
    width: "90%",
    height: 30,
    marginBottom: 5,
    alignItems: "center",
    marginLeft: 20,
    fontSize: "12",
    paddingVertical: 1,
  },
  eventButton: {
    fontSize: 8,
    paddingHorizontal: 10,
    paddingVertical: 1,
    height: 30,
    width: 125,
    justifyContent: "center",
    marginRight: 15,
  },
  addEventBtn: {
    marginLeft: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    height: 25,
    width: 30,
    justifyContent: "center",
  },
  eventButtonText: {
    fontSize: 8,
    textAlign: "center",
  },
  detailContainer: {
    paddingTop: 10,
    zIndex: 3,
    paddingHorizontal: 16,
    borderRadius: 10,
    margin: 1,
  },
  plusIcon: {
    fontSize: 25,
    color: "#000",
    marginRight: 8,
  },
  detail: {
    textAlign: "justify",
    flexWrap: "nowrap",
    fontSize: 14,
    color: "#416165",
    paddingLeft: 10,
    paddingRight: 15,
  },
  KeyText: {
    flexWrap: "nowrap",
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    paddingLeft: 10,
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 1,
    color: "#666",
    paddingLeft: 10,
  },
  DescriptionContainer: {
    alignContent: "flex-start",
    marginBottom: 15,
    paddingLeft: 10,
    marginRight: 16,
  },
  descriptionText: {
    textAlign: "justify",
    flexWrap: "nowrap",
    fontSize: 14,
    color: "#416165",
    paddingLeft: 10,
    paddingRight: 15,
  },
  btnContainer: {
    alignItems: "center",
  },
  modalBtn: {
    alignItems: "center",
    paddingVertical: 2,
    height: 50,
  },
  commentaireContainer: {
    margin: 10,
  },
  commentaireHeader: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ZoneCommentaire: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E8E9ED",
    marginBottom: 30,
  },
  userAvatar: {
    height: 40,
    width: 40,
  },
  commentTitle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  commentPseudo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "##795C5F",
    paddingRight: 10,
  },
  commentText: {
    width: 250,
    flexWrap: "wrap",
    alignItems: "flex-start",
    fontSize: 16,
    color: "#333",
    paddingRight: 10,
    marginTop: 2,
  },
  commentTextContainer: {
    alignItems: "flex-start",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#7DBA84",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  HorairesModale: {
    flexDirection: "row",
    margin: 20,
  },
  horaires: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginRight: 10,
  },
  horaireItem: {
    marginVertical: 5,
    padding: 4,
  },
  titleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  headerImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  heartIcon: {
    fontSize: 24,
    right: 2,
  },
  closeIcon: {
    padding: 10,
    position: "absolute",
    top: 1,
    right: 10,
    zIndex: 2,
  },
});
