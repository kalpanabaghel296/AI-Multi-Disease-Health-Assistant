import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

export default App;

// import React from 'react';
// import { View, Text } from 'react-native';

// export default function App() {
//   return (
//     <View>
//       <Text>Hello World</Text>
//     </View>
//   );
// }