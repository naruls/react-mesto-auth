import React from 'react';
import Main from './Main.js';
import Login from './Login.js';
import Register from './Register.js';
import api from '../utils/Api';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as mestoAuth from './Auth.js';

import {  Route, Redirect, Switch, withRouter } from 'react-router-dom';


import { CurrentUserContext } from '../contexts/CurrentUserContext';



function App(props) {
  const [currentEmail, setCurrentEmail] = React.useState('');
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [selectedCard, setSelectedCard] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [succesRegister, setSuccesRegister] = React.useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);



  React.useEffect(() => {
      api.getUserInfo()
        .then((data)=>{
          setCurrentUser( {...data} );
        })
        .catch((err) => {
          console.log(err)
        });
    }, []);


  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  {/*function handleConfirmClick() {
      setConfirmPopupOpen(true);
  }*/}

  function tokenCheck() {
      const jwt = localStorage.getItem('jwt');
       if (jwt){
        mestoAuth.getContent(jwt).then((res) => {
          if (res){
            setCurrentEmail(res.data.email);
            handleLogin();
            props.history.push("/");
            console.log(currentEmail)
          }
        }); 
      }
    } 
 function handleLogin() {
    setLoggedIn(true);
  } 

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setImagePopupOpen(false);
    setConfirmPopupOpen(false);
    setInfoTooltipOpen(false);
    setSelectedCard({});
  }

  function handleUpdateUser(data) {
    api.setUserInfo(data)
      .then(
      (data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(data) {
    api.setUserAvatar(data)
      .then(
      (data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(data) {
    api.postCard(data)
      .then(
      (data) => {
        setCards([data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [cards , setCards ] = React.useState([]);

  React.useEffect(() => {
    api.getInitialCards()
      .then((data)=>{
      setCards([...data])
    })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
   
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      setCards((state) => state.filter((c) => c !== card));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
      <Route exact path="/">
        {loggedIn ? <Redirect to="/mesto" /> : <Redirect to="/sign-in" />}
      </Route> 
      <ProtectedRoute path="/mesto"
      loggedIn={loggedIn}
      component={Main}
      onEditAvatar={handleEditAvatarClick} 
        onAddPlace ={handleAddPlaceClick} 
        onEditProfile={handleEditProfileClick}
        onCardClick={handleCardClick}
        onClose={closeAllPopups}
        cards={cards}
        isImageOpen={isImagePopupOpen}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete}
        card={selectedCard}/>
        currentEmail={currentEmail}
      <Route path="/sign-up">
        <Register setInfoTooltipOpen={setInfoTooltipOpen} setSuccesRegister={setSuccesRegister}/>
      </Route>
      <Route path="/sign-in">
        <Login handleLogin={handleLogin}/>
      </Route>
      </Switch>
      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/> 
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/> 
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddNewCard={handleAddPlaceSubmit}/>
      <InfoTooltip isInfoTooltipOpen={isInfoTooltipOpen} onClose={closeAllPopups} succesRegister={succesRegister}/>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
