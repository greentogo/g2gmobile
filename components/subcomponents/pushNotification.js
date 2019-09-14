import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import axios from '../../apiClient';

export default async function registerForPushNotificationsAsync(appStore) {
    try {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        const { status: existingStatusUser } = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        let finalStatusUser = existingStatusUser;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (existingStatusUser !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            finalStatusUser = status;
        }

        // Contiune if the user did granted permissions
        if (finalStatus === 'granted' || finalStatusUser === 'granted') {
            // Get the token that uniquely identifies this device
            const expoPushToken = await Notifications.getExpoPushTokenAsync();
            if (appStore.user.expoPushToken !== expoPushToken) {
                // PATCH the token to your backend server from where you can retrieve it to send push notifications.
                const body = { expoPushToken };
                const config = {
                    headers: {
                        Authorization: `Token ${appStore.authToken}`,
                    },
                };
                axios.patch('/me/', body, config);
            }
        }
    } catch (error) {
        axios.post('/log/', {
            context: 'registerForPushNotificationsAsync', error, message: error.message, stack: error.stack,
        });
    }
}
