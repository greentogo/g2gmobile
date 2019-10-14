import { observable, action } from 'mobx';
import simpleStore from 'react-native-simple-store';
import axios from './apiClient';

class AppStore {
    @observable authToken = '';

    @observable user = null;

    @observable currentRoute = 'home';

    @observable resturants = null;

    constructor() {
        simpleStore.get('authToken').then((token) => {
            this.setAuthToken(token);
            this.authToken = token;
        });
        simpleStore.get('user').then((user) => {
            this.user = user;
        });
        simpleStore.get('resturants').then((resturants) => {
            this.resturants = resturants;
        });
    }

    reduceBoxes(subscriptions, type) {
        return subscriptions.reduce((sum, subscription) => {
            if (subscription.is_active) {
                return sum + subscription[type];
            }
            return sum;
        }, 0)
    }

    @action async setAuthToken(token) {
        axios.defaults.headers.common.Authorization = `Token ${token}`;
        this.authToken = token;
        await simpleStore.save('authToken', token);
    }

    @action clearAuthToken() {
        axios.defaults.headers.common.Authorization = '';
        this.authToken = null;
        this.user = null;
        simpleStore.save('authToken', null);
        simpleStore.save('user', null);
    }

    @action setCurrentRoute(navState) {
        if (navState && typeof navState.index === 'number'
            && navState.routes
            && navState.routes[navState.index]
            && navState.routes[navState.index].routeName) {
            this.currentRoute = navState.routes[navState.index].routeName;
        }
    }

    @action async getUserData() {
        try {
            const response = await axios.get('/me/');
            return this.setUserData(response.data.data);
        } catch (error) {
            axios.log('stores.js getUserData', error);
            if (error.code === 'ECONNABORTED' && this.user) {
                return this.user;
            }
            return this.clearAuthToken();
        }
    }

    @action async getResturantData() {
        try {
            const response = await axios.get('/restaurants/');
            this.resturants = response.data.data;
            simpleStore.save('resturants', response.data.data);
            return response.data.data;
        } catch (error) {
            axios.log('stores.js getResturantData', error);
            if (error.code === 'ECONNABORTED' && this.resturants) {
                return this.resturants;
            }
            return [];
        }
    }

    @action async setUserData(data) {
        this.user = data;
        if (data.subscriptions) {
            this.user.maxBoxes = this.reduceBoxes(data.subscriptions, 'max_boxes');
            this.user.availableBoxes = this.reduceBoxes(data.subscriptions, 'available_boxes');
        }
        simpleStore.save('user', data);
        return data;
    }
}

export default new AppStore();
