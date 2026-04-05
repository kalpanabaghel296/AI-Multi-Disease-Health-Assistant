import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import axios from "axios";

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    const res = await axios.post(
      "http://10.0.2.2:8000/assistant/query",
      {
        message: message,
      }
    );

    setResponse(res.data.response);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Ask something..."
        value={message}
        onChangeText={setMessage}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Send" onPress={sendMessage} />

      <Text>{response}</Text>
    </View>
  );
}