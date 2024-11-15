import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    backgroundColor: 'rgba(226,221, 217, 0.9)',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  categoryList: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: 'rgba(226,221, 217, 0.9)',
    width: '45%',
    marginBottom: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#E2DDD9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#E2DDD9',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  addButtonModal: {
    backgroundColor: '#E2DDD9',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
});

export default styles;