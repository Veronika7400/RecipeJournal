import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useTranslation } from 'react-i18next';

const KeepAwakeToggle = () => {
    const [isKeepAwake, setIsKeepAwake] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
   
    const handleToggle = async (value) => {
        setIsLoading(true); 
        try {
            if (value) {
                await activateKeepAwakeAsync(); 
            } else {
                deactivateKeepAwake(); 
            }
            setIsKeepAwake(value); 
        } catch (error) {
            console.error("Error toggling keep awake mode:", error);
            alert(t('error_toggling_mode')); 
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>
                {isLoading ? t('updating') : t('keep_screen_on')} 
            </Text>
            <Switch
                value={isKeepAwake}
                onValueChange={handleToggle}
                disabled={isLoading} 
                trackColor={{ false: "#D9D0C5", true: "#CFC8C3" }}
                thumbColor={isKeepAwake ? "#CFC8C3" : "#D9D0C5"}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    toggleLabel: {
        fontSize: 14,
        color: '#333',
        fontWeight: '350',
    },
});

export default KeepAwakeToggle;
