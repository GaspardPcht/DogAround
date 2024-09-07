import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Dimensions
} from "react-native";
import TextContainer from "../Components/TextContainer";
import Input from "../Components/Input";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ModalInvitation from "../Components/ModalInvitation";
import ModalInvitationAnswer from "../Components/ModalInvitationAnswer";
import { useSelector } from "react-redux";
import { useIsFocused } from '@react-navigation/native';

import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

export default function ChatScreen({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalAnswerVisible, setIsModalAnswerVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchContacts, setSearchContacts] = useState([]);
  /* const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); */
  const [contacts, setContacts] = useState([]);
  // Sélection de l'utilisateur dans le store Redux
  const user = useSelector((state) => state.user.value);

  // Hook pour vérifier si l'écran est actuellement focalisé
  const isFocused = useIsFocused();

  /* console.log(contacts) */

  // Fonction pour réinitialiser la recherche de contacts
  const onClearPress = () => {
    setSearchContacts([]);
  };

  // Fonction pour rechercher un contact
  const searchContact = (query) => {
    // Empêche la recherche avec une requête vide
    if (query === "") {
      return;
    }

    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/${user.token}/pseudos?search=${query}`,
      {
        method: "GET", // Méthode HTTP utilisée pour la requête
        headers: {
          "Content-Type": "application/json", // En-tête pour indiquer le type de contenu
        },
      }
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        if (data.result) {
          // Filtre les pseudos déjà en contact et ceux de l'utilisateur
          const pseudoFilter = data.pseudos.filter((e) => {
            return (
              e !== user.pseudo &&
              !contacts.some((contact) => {
                return e === contact.pseudo;
              })
            );
          });

          // Crée des suggestions de contacts
          const suggestions = pseudoFilter.map((data, i) => {
            return { id: i + 1, title: data };
          });

          setSearchContacts(suggestions); // Met à jour les contacts suggérés
        } else {
          setSearchContacts([]); // Réinitialise les contacts suggérés en cas d'erreur
        }
      });
  };

  // Fonction pour récupérer la liste des contacts
  const contactMessage = () => {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/contacts/${user.token}`,
      {
        method: "GET", // Méthode HTTP utilisée pour la requête
        headers: {
          "Content-Type": "application/json", // En-tête pour indiquer le type de contenu
        },
      }
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        if (data.result) {
          /* console.log(data.contacts) */
          // Met à jour les contacts en inversant l'ordre
          setContacts(
            data.contacts
              .map((contact) => ({
                pseudo: contact.pseudo, // Pseudo du contact
                avatar: contact.avatar, // Avatar du contact
                invitation: contact.invitation, // Statut de l'invitation
                discussion: contact.discussion, // Discussion associée
              }))
              .reverse() // Inverse l'ordre des contacts
          );
        } else {
          setContacts([]); // Réinitialise les contacts en cas d'erreur
        }
      });
  };

  // Fonction pour fermer la modal d'invitation
  const handleCloseModal = () => {
    setIsModalVisible(false); // Cache la modal
    setSearchContacts([]); // Réinitialise les contacts recherchés
  };

  // Fonction pour ouvrir la modal d'invitation
  const handleOpenInvitation = (contact) => {
    setSelectedContact(contact); // Définit le contact sélectionné
    setSearchContacts([]); // Réinitialise les contacts recherchés
    setIsModalVisible(true); // Affiche la modal
  };

  // Fonction pour fermer la modal de réponse à une invitation
  const handleCloseModalAnswer = () => {
    setIsModalAnswerVisible(false); // Cache la modal de réponse
  };

  // Fonction pour ouvrir la modal de réponse à une invitation
  const handleOpenInvitationAnswer = (contact) => {
    setSelectedContact(contact); // Définit le contact sélectionné
    setIsModalAnswerVisible(true); // Affiche la modal de réponse
  };

  // Fonction pour envoyer une invitation
  const handleClickForInvitation = () => {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/invitation/${user.token}`,
      {
        method: "POST", // Méthode HTTP utilisée pour la requête
        headers: { "Content-Type": "application/json" }, // En-tête pour indiquer le type de contenu
        body: JSON.stringify({ pseudo: selectedContact }), // Corps de la requête avec le pseudo du contact sélectionné
      }
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        if (data.result) {
          setIsModalVisible(false); // Cache la modal
          /* setSearchQuery(""); */
          setSearchContacts([]); // Réinitialise les contacts recherchés
          contactMessage(); // Met à jour la liste des contacts
        }
      });
  };

  // Fonction pour répondre à une invitation
  const handleClickForInvitationAnswer = (answer) => {
    fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_ADDRESS}/users/invitation/${user.token}`,
      {
        method: "PUT", // Méthode HTTP utilisée pour la requête
        headers: { "Content-Type": "application/json" }, // En-tête pour indiquer le type de contenu
        body: JSON.stringify({ pseudo: selectedContact, answer: answer }), // Corps de la requête avec le pseudo du contact sélectionné et la réponse
      }
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        if (data.result) {
          setIsModalAnswerVisible(false); // Cache la modal de réponse
          contactMessage(); // Met à jour la liste des contacts
        }
      });
  };

  // Fonction pour ouvrir l'écran de message avec des props
  const handleClickOpenMessage = (contact) => {
    setIsModalVisible(false); // Cache la modal
    setIsModalAnswerVisible(false); // Cache la modal de réponse
    if (contact.invitation === "accepted") {
      // Si l'invitation est acceptée, navigue vers l'écran de message avec les props
      navigation.navigate("Message", {
        discussion_pseudo: contact.pseudo,
        discussion_id: contact.discussion._id,
      });
    } else if (contact.invitation === "received") {
      // Si l'invitation est reçue, ouvre la modal de réponse à l'invitation
      handleOpenInvitationAnswer(contact.pseudo);
    }
  };

  // Fonction pour afficher un nouveau message
  const showNewMessage = (contact) => {
    try {
      if (
        contact.invitation === "accepted" &&
        contact.discussion.newMessage.pseudo !== null &&
        contact.discussion.newMessage.pseudo !== user.pseudo
      ) {
        return (
          <Text style={[styles.invitationText, { color: "#0000CC" }]}>
            Nouveau message
          </Text>
        );
      }
    } catch (error) {
      console.error(error); // Affiche l'erreur dans la console
    }
  };

  // Utilisation de useEffect pour appeler contactMessage lorsque l'écran est focalisé
  useEffect(() => {
    if (isFocused) {
      contactMessage();
    }
  }, [isFocused]);

  // Rendu de la liste de contacts affichés
  const listContacts = contacts
    .sort((a, b) => a.pseudo.localeCompare(b.pseudo)) // Trie les contacts par pseudo
    .map((contact, i) => {
      return (
        <TouchableOpacity
          key={i} // Clé unique pour chaque contact
          style={styles.contactRow} // Style pour chaque ligne de contact
          onPress={() => handleClickOpenMessage(contact)} // Fonction appelée lors de la pression sur un contact
        >
          <Image source={contact.avatar} style={styles.avatar} />{" "}
          {/* Avatar du contact */}
          <View style={styles.contactInfo}>
            <TextContainer
              title={contact.pseudo} // Pseudo du contact
              style={styles.containerNewMessage}
            />
            {contact.invitation === "issued" && (
              <Text style={[styles.invitationText]}>Attente réponse</Text> // Affiche "Attente réponse" si l'invitation est en attente
            )}
            {contact.invitation === "received" && (
              <Text style={[styles.invitationText, { color: "#00CC00" }]}>
                Invitation ?
              </Text> // Affiche "Invitation ?" si l'invitation est reçue
            )}
            {contact.invitation === "denied" && (
              <Text style={[styles.invitationText, { color: "#FF0000" }]}>
                Refusée
              </Text> // Affiche "Refusée" si l'invitation est refusée
            )}
            {showNewMessage(contact)}{" "}
            {/* Affiche "Nouveau message" si applicable */}
          </View>
        </TouchableOpacity>
      );
    });

  const scroll = useRef(); // Référence pour l'élément de défilement

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsModalVisible(false);
        setIsModalAnswerVisible(false);
      }}
      accessible={false}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <View style={styles.container}>
          <View style={styles.searchAndContactContainer}>
            <Text style={styles.text}>CONTACTS</Text>

            <AutocompleteDropdown
              emptyResultText="Aucun résultat"
              debounce={500}
              onChangeText={(value) => searchContact(value)}
              onSelectItem={(item) => item && handleOpenInvitation(item.title)}
              dataSet={searchContacts}
              textInputProps={{
                placeholder: "Rechercher un(e) ami(e)",
                style: {
                  fontSize: 16,
                },
              }}
              direction={Platform.select({ ios: "down" })}
              inputContainerStyle={styles.inputdropdownContainer}
              containerStyle={styles.dropdownContainer}
              suggestionsListContainerStyle={styles.suggestionListContainer}
              suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
              clearOnFocus={false}
              closeOnSubmit={true}
              onClear={() => onClearPress()}
            />
          </View>

          <View style={styles.messagerieContainer}>
            <View style={styles.messagerie}>
              <Text style={styles.text}>MESSAGERIE</Text>
              <TouchableOpacity
                style={styles.IconMessagerie}
                onPress={contactMessage}
              >
                <FontAwesome name="rotate-right" size={30} color="#416165" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {listContacts}
            </ScrollView>
          </View>

          <ModalInvitation
            visible={isModalVisible}
            onClose={handleCloseModal}
            onSelect={handleClickForInvitation}
            name={selectedContact}
          />

          <ModalInvitationAnswer
            visible={isModalAnswerVisible}
            onClose={handleCloseModalAnswer}
            onSelect={handleClickForInvitationAnswer}
            name={selectedContact}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#E8E9ED",
    paddingTop: 40,
  },
  text: {
    color: "#416165",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Commissioner_700Bold",
    padding: 10,
  },
  searchAndContactContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "80%"
  },
  messagerieContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 15,
  },
  scrollView: {
    flexGrow: 0,
    width: "80%",
    height: Dimensions.get('window').height * 0.6,
    /* borderBottomWidth: 1, */
    borderBottomColor: "#ddd",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    /* borderWidth:1, */
    borderRadius: 8,
    backgroundColor: '#FFF'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  contactInfo: {
    /* flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", */
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  containerNewMessage: {
    color: "#416165",
    fontSize: 16,
    fontWeight: "normal",
    /* flexShrink: 1, */
  },
  invitationText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "bold",
    /* flexGrow: 1, */
    /* textAlign: "right", */
    /* width:10, */
  },
  messagerie: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10
  },
  IconMessagerie: {

  },
  dropdownContainer: {
    width: '100%',
  },
  inputdropdownContainer: {
    backgroundColor: '#ffffff',
  },
  suggestionListContainer: {
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
  },
});
