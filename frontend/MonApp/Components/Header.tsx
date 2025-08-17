import { Text, View, StyleSheet } from 'react-native'

const Header = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> ChatBox </Text>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    height: 150,
    justifyContent: "flex-end",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  text: {
    color: "white",
    marginLeft: 20,
    fontWeight: "bold",
    marginBottom: 20,
    fontSize: 30,
  },
});

export default Header

