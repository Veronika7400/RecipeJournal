import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});

export default styles;