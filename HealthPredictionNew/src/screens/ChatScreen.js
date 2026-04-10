import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { askAssistant } from "../services/api";

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
  try {
    const res = await askAssistant(message);
    setResponse(res.data.response);
  } catch (err) {
    setResponse("Error connecting to assistant");
  }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Ask something..."
        value={message}
        onChangeText={setMessage}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Button title="Send" onPress={sendMessage} />

      <Text style={{ marginTop: 20 }}>{response}</Text>
    </View>
  );
}