
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DDD9',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 8,
    },
    scrollView: {
        padding: 16,
    },
    recipeCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    recipeImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        objectFit: 'cover',
    },
    recipeDetails: {
        padding: 16,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
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
    recipeInfo: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
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
    title: {
        fontSize: 28,
        color: '#333',
        textAlign: 'center',
        flex: 1,
        marginHorizontal: 30,
    },
    recipeInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recipeInfo: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },

    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default styles;
