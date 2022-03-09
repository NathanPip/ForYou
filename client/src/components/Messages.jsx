import React, { useState, useRef, useEffect } from "react";

export default function Messages() {
  const [messages, setMessages] = useState(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [msgFor, setMsgFor] = useState(null);
  const [user, setUser] = useState(null);

  const messageBox = useRef();
// checks local storage for user and signs them in
//if there is a user signed in fetch the messages from the database corresponding to said user
  useEffect(() => {
    const controller = new AbortController();
    setUser(localStorage.getItem('user'));
    if (user) {
      const fetchMessages = async () => {
        let msgs = await fetch(`/message/${user}`);
        msgs = await msgs.json();
        setMessages(msgs);
      };
      fetchMessages().catch(console.error);
    }
    return () => controller.abort();
  }, [user]);

  //sets the intitial current message and sets the interval for message rotation
  useEffect(() => {
    if (user && messages) {
      setCurrentMessage(messages[Math.floor(Math.random() * messages.length)].message);
      const interval = setInterval(rotateMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [messages]);

  //sets a currentmessage to a new random message from messages
  const rotateMessages = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setCurrentMessage(messages[randomIndex].message);
  };

  const handleMessageSubmit = () => {
    const input = messageBox.current.value;
    //checks to see if passcodes were entered and sets user if correct code is entered.
    //if message is not a passcode and user is signed in then upload message ot database
    if (input === `hi ${REACT_APP_GPASS}`) {
      setMsgFor(REACT_APP_GPASS);
      setUser(REACT_APP_HPASS);
      localStorage.setItem('user', REACT_APP_HPASS)
      messageBox.current.value = ''
    } else if (input === `hi ${REACT_APP_HPASS}`) {
      setMsgFor(REACT_APP_HPASS);
      setUser(REACT_APP_GPASS);
      localStorage.setItem('user', REACT_APP_GPASS)
      messageBox.current.value = ''
    } else if (user && input.length > 4) {
      (async function() {
        await fetch("/message/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: input,
            msgFor: msgFor
          })
        });
        messageBox.current.value = ''
        messageBox.current.placeholder = "message sent"
      })();
    }
  };

  return (
    <div className="messages">
      <p className="message__content">{currentMessage ? currentMessage : 'For You'}</p>
      <textarea
        ref={messageBox}
        className="message__input"
        type="submit"
        placeholder={user ? `hi ${user}` : 'hi hi'}
      ></textarea>
      <button className="message__button" onClick={handleMessageSubmit}>
        Send
      </button>
    </div>
  );
}
