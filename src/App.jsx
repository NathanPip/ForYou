import Header from "./components/Header";
import Main from "./components/Main";
import React from 'react'
import Parse from 'parse/dist/parse.min.js';

Parse.initialize(import.meta.env.VITE_APP_ID, import.meta.env.VITE_JS_KEY)
Parse.serverURL = 'https://parseapi.back4app.com/'

function App() {
  return (
    <div className="container">
      <Header />
      <Main />
    </div>
  );
}

export default App;
