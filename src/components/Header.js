import React from 'react';

function Header(props) {
  return (
    <header className="header background">
      <div className="header__logo"></div>
      <p className="header__email">{props.currentEmail}</p>
      <a className="header__exit" onClick={props.signOut}>Выйти</a>
    </header>
  );
}

export default Header;
