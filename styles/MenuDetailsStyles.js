
import { browserLocalPersistence } from 'firebase/auth';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DDD9',
    },
    scrollView: {
        padding: 16,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
        borderColor: '#D8D8D8',
        borderWidth: 0.5,
    },
    content: {
        padding: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        paddingHorizontal: 5,
        borderRadius: 8,
        padding: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        marginLeft: 5,
        color: '#4D4E53',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4D4E53',
        marginBottom: 10,
        marginTop: 15,
    },
    ingredient: {
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 8,
        padding: 10,
    },
    ingredientText: {
        fontSize: 16,
        color: '#4D4E53',
    },
    steps: {
        fontSize: 16,
        color: '#4D4E53',
        marginBottom: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 8,
        padding: 10,
    },
    notes: {
        fontSize: 16,
        color: '#4D4E53',
        marginBottom: 20,
        fontStyle: 'italic',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 8,
        padding: 10,
    },
    info: {
        fontSize: 16,
        color: '#999',
        marginBottom: 10,
    },
    
    headerTitle: {
        fontSize: 24,
        color: '#333',
        textAlign: 'center',
        flex: 1,
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4D4E53',
        marginBottom: 10,
        marginTop: 15,
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

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',    
        alignItems: 'center',        
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalContainer: {
        width: '80%',                
        backgroundColor: 'white',    
        borderRadius: 20,            
        padding: 30,                
        elevation: 5,               
        shadowColor: '#000',        
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        justifyContent: 'center',    
        alignItems: 'center',       
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    categoryItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    categoryText: {
        fontSize: 16,
        color: '#4D4E53',
    },
    addCategoryButton: {
        marginTop: 15,
        backgroundColor: '#C7BEB9',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addCategoryText: {
        color: '#000',
        fontSize: 16,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
    },
    cancelButton: {
        backgroundColor: '#C7BEB9',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
      },
      cancelButtonText: {
        fontWeight: 'bold',
        textAlign: 'center',
      },
      saveButton: {
        backgroundColor: '#C7BEB9',
        padding: 10,
        borderRadius: 5,
        flex: 1,
      },
      saveButtonText: {
        fontWeight: 'bold',
        textAlign: 'center',
      },
      selectedCategoryText: {
        fontWeight: 'bold', 
        color: '#4D4E53',  
    },

    addCategoryFooter: {
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    
});

export default styles;
