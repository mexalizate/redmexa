import React, { useState, useCallback } from "react";

import MessageModal from "./MessageModal";

export default {
  component: MessageModal,
  title: "Form/MessageModal",
};

const user = {
  displayName: "Bill Murray",
  image: "https://loremflickr.com/200/200",
};
const groups = [
  {
    id: "a",
    name: "Groupe A",
  },
  {
    id: "b",
    name: "Équipe B",
  },
];
const events = [
  {
    id: "a",
    name: "Événement A",
    startTime: "2021-01-09 10:04:19",
    type: "G",
  },
  {
    id: "b",
    name: "Événement B",
    startTime: "2021-01-09 10:04:19",
    type: "M",
  },
  {
    id: "c",
    name: "Événement C",
    startTime: "2021-01-09 10:04:19",
    type: "A",
  },
  {
    id: "d",
    name: "Événement D",
    startTime: "2021-01-09 10:04:19",
    type: "O",
  },
  {
    id: "e",
    name: "Événement E",
    startTime: "2021-01-09 10:04:19",
    type: "A",
  },
];

export const Default = () => {
  const [messages, setMessages] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState(events.slice(0, 3));
  const [editedMessage, setEditedMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreEvents = useCallback(() => {
    setVisibleEvents(events);
  }, []);
  const handleSave = useCallback(async (message) => {
    setIsLoading(true);
    await new Promise((resolve) => {
      setTimeout(() => {
        setMessages((state) => [
          ...state.filter((m) => m.id !== message.id),
          { ...message, id: message.id || String(Date.now()) },
        ]);
        setIsLoading(false);
        setVisibleEvents(events.slice(0, 3));
        setEditedMessage(null);
        resolve();
      }, 2000);
    });
  }, []);

  const handleDismiss = useCallback(() => {
    setVisibleEvents(events.slice(0, 3));
    setEditedMessage(null);
  }, []);

  return (
    <div
      style={{
        background: "lightgrey",
        minHeight: "100vh",
        padding: "16px",
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          padding: "0",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <MessageModal
          key={messages.length}
          isLoading={isLoading}
          onSend={handleSave}
          onDismiss={handleDismiss}
          user={user}
          groups={groups}
          events={visibleEvents}
          loadMoreEvents={
            visibleEvents.length === events.length ? undefined : loadMoreEvents
          }
          message={editedMessage}
        />
      </div>
      {messages.map((message) => (
        <p
          style={{
            background: "white",
            borderRadius: "8px",
            maxWidth: "480px",
            padding: "0.875rem",
            margin: "8px auto",
            fontSize: "14px",
          }}
          key={message.id}
        >
          #{message.id}
          <br />
          <strong>{user.displayName}</strong>
          <br />
          {message.text}
          <br />
          <small>{message.linkedEvent.name}</small>
          <br />
          <button onClick={() => setEditedMessage(message)}>Modifier</button>
        </p>
      ))}
    </div>
  );
};
