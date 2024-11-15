import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',

        justifyContent: 'center',
        backgroundColor: '#E2DDD9',
    },
    backButton: {
        position: 'absolute',
        left: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        marginTop: 30,
    },
    headerTitle: {
        fontSize: 28,
        color: '#333',
        textAlign: 'center',
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 30,
    },
    profilePictureArea: {
        backgroundColor: '#E2DDD9',
        alignItems: 'center',
    },
    userName: {
        fontSize: 20,
        marginBottom: 20,
        marginTop: 0,
    },
    statsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    statCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        shadowColor: "#BEBEBE",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    statTitle: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    emailText: {
        fontSize: 16,
        marginBottom: 15,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    passwordButton: {
        backgroundColor: '#E2DDD9',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
        flex: 1,
        marginRight: 5,
    },
    passwordButtonText: {
        color: '#000000',
    },
    saveButton: {
        backgroundColor: '#E2DDD9',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
        flex: 1,
        marginLeft: 5,
    },
    saveButtonText: {
        color: '#000000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#E2DDD9',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#000000',
    },
    cancelButtonText: {
        color: '#000000',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingTop: 180,
        paddingHorizontal: 20,
    },
    profileInfoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 250,
        backgroundColor: '#E2DDD9',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        zIndex: 0,
    },
    editContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 15,
    },
    stratisticsContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
    },
});

export default styles;