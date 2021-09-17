import React from 'react';
import { Link, useHistory } from 'react-router-dom';

function Header(props) {
  const history = useHistory();
  function signOut(){
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  }
  return (
    <header className="header background">
      <div className="header__logo"></div>
      <p className="header__email">{props.currentEmail}</p>
      <a className="header__exit" onClick={signOut}>Выйти</a>
    </header>
  );
}

export default Header;
