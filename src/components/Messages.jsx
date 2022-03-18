import React, { useState, useRef, useEffect } from "react";
import { fetchMessages, sendMessage } from "../helpers/databaseFunctions";

export default function Messages() {
  const [messages, setMessages] = useState(null);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [user, setUser] = useState(null);
  const messageBox = useRef();

  //FETCHES ALL MESSAGES FROM THE DATABASE, 
  //calls the fetchMessages helper function which returns a response of all msgs data
  //filters only msg and msgFrom data from each object in msgs data and creates a new object, 
  //new object is pushed to array and, after iterations, messages state is set to said array
  useEffect(() => {
    const controller = new AbortController();
    if (user) {
      let msgRes = [];
      fetchMessages().then(msgs => {
        msgs.forEach(message => {
          let msg = message.get("msg");
          let msgFrom = message.get("msg_from");
          msgRes.push({ msg, msgFrom });
        });
      });
      setMessages(msgRes);
      // console.log(msgRes);
    }
    return () => controller.abort();
  }, [user]);

  //SETS THE INITIAL DISPLAYED MESSAGE, THE DISPLAYED MESSAGES ARRAY, AND THE MESSAGE ROTATION INTERVAL
  //checks for user, messages and if messages has any data
  //sets the msgsFrom from value to to opposite of the user signed in
  //filters all messages with corresponding msgFrom value and sets them to new array
  //set Displayed messages to this new array and pick first messages shown
  //finally set interval
  useEffect(() => {
    if (user && messages && messages.length) {
      let msgsFrom =
        user === "nathan"
          ? import.meta.env.VITE_GPASS
          : import.meta.env.VITE_HPASS;
      let filteredMessages = messages.filter(msg => msg.msgFrom === msgsFrom);
      setDisplayedMessages(filteredMessages);
      setCurrentMessage(
        filteredMessages[Math.floor(Math.random() * displayedMessages.length)]
          .msg
      );
      const interval = setInterval(rotateMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // SETS CURRENT MESSAGE TO A NEW RANDOM MESSAGE FROM displayedMessages
  const rotateMessages = () => {
    const randomIndex = Math.floor(Math.random() * displayedMessages.length);
    setCurrentMessage(displayedMessages[randomIndex].msg);
  };

  //POSTS NEW MESSAGE UP TO THE DATABASE
  //checks input value to make sure a user is not trying to sign in
  //if user is signing in with keyphrase then set user based on phrase
  //if user is already signed in && message != keyphrase && message.length > 0 then send Message up to database
  const handleMessageSubmit = () => {
    const input = messageBox.current.value;

    if (input === `hi ${import.meta.env.VITE_GPASS}`) {
      setUser(import.meta.env.VITE_HPASS);
      messageBox.current.value = "";
      return;
    }
    if (input === `hi ${import.meta.env.VITE_HPASS}`) {
      setUser(import.meta.env.VITE_GPASS);
      messageBox.current.value = "";
      return;
    }
    if (user && input.length > 0) {
      const sendMsg = async () => {
        try {
          await sendMessage(user, input);
          messageBox.current.value = "";
          messageBox.current.placeholder = "Message Sent!"
        } catch (err) {
          console.log(err)
          messageBox.current.value = "";
          messageBox.current.placeholder = "Message Failed to send! Text Your Boi Nather"
        }
      };
      sendMsg();
    }
  };

  return (
    <div className="messages">
      <p className="message__content">
        {currentMessage ? currentMessage : "For You"}
      </p>
      <textarea
        ref={messageBox}
        className="message__input"
        type="submit"
        placeholder={user ? `hi ${user}` : "hi hi"}
      ></textarea>
      <button className="message__button" onClick={handleMessageSubmit}>
        Send
      </button>
    </div>
  );
}
