import { Permissions, Notifications } from 'expo';
import axios from '../../apiClient';

export default async function registerForPushNotificationsAsync(appStore) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    };

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    try {
        // Get the token that uniquely identifies this device
        const expoPushToken = await Notifications.getExpoPushTokenAsync();
        if (appStore.user.expoPushToken !== expoPushToken) {
            // PATCH the token to your backend server from where you can retrieve it to send push notifications.
            axios.patch('/me/', { expoPushToken }, {
                headers: {
                    'Authorization': `Token ${appStore.authToken}`
                }
            }).then((response) => {
                return;
            }).catch((error) => {
                axios.post('/log/', { 'context': 'pushNotification.js patch user', 'error': error, 'message': error.message, 'stack': error.stack });
                return;
            });
        }
    } catch (error) {
        axios.post('/log/', { 'context': 'pushNotification.js getExpoPushTokenAsync', 'error': error, 'message': error.message, 'stack': error.stack });
        return;
    }
    return;
}