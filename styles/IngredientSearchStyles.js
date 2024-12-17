import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2DDD9',
  },
  header: {
    backgroundColor: 'rgba(226,221, 217, 0.9)',
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    color: '#333',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 30,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#CFC8C3',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  recipeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  recipeInfo: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
    padding: 10,
  },
  recipeCard: {
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    overflow: 'hidden',
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '350',
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 0, 
    backgroundColor: '#E2DDD9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#E2DDD9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  activeTab: {
    backgroundColor: '#CFC8C3', 
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: '#333',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#333',
    fontWeight: 'bold',
  },

  activeContentBackground: {
    backgroundColor: '#CFC8C3', 
    flex: 1,
    borderTopLeftRadius: 0,      
    borderTopRightRadius: 0,
    paddingTop: 15,              
    paddingHorizontal: 10,
    paddingBottom: 20,         
  },
  recipeDetail: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10, 
  },
  
  recipeDetails: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8, 
    flexShrink: 1, 
  },
});

export default styles;