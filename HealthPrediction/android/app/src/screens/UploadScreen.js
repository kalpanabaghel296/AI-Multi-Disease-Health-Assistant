import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import axios from "axios";

export default function UploadScreen() {
  const [result, setResult] = useState(null);

  const sendDummyRequest = async () => {
    const res = await axios.post(
      "http://10.0.2.2:8000/assistant/query",
      {
        message: "Test message",
      }
    );

    setResult(res.data);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Upload Screen</Text>

      <Button title="Test API" onPress={sendDummyRequest} />

      {result && <Text>{JSON.stringify(result)}</Text>}
    </View>
  );
}