import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DDD9',
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
        paddingHorizontal: 20,
    },
    backButton: {
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontSize: 28,
        color: '#333',
        textAlign: 'center',
        flex: 1,
        textTransform: 'uppercase',
    },
    filterButton: {
        paddingHorizontal: 10,
    },
    content: {
        padding: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
        borderColor: '#D8D8D8',
        borderWidth: 0.5,
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
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
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
    scrollView: {
        paddingHorizontal: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#999',
        textDecorationLine: 'underline',
    },
    fabContainer: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 60,
        paddingVertical: 10,
    },
    fab: {
        backgroundColor: '#505050',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
    deleteButton: {
        backgroundColor: '#C7BEB9',
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    deleteButtonText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

   

});

export default styles;