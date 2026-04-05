import React from "react";
import { View, Text, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        AI Healthcare App
      </Text>

      <Button
        title="Upload Medical Report"
        onPress={() => navigation.navigate("Upload")}
      />

      <Button
        title="Ask AI Assistant"
        onPress={() => navigation.navigate("Chat")}
      />
    </View>
  );
}