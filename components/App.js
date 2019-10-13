import React from 'react';
import { ScreenOrientation } from 'expo';
import Constants from 'expo-constants';
import { observer, Provider } from 'mobx-react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation-stack';
import styles from '../styles';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import MapScreen from './MapScreen';
import ScanQRCode from './ScanQRCode';
import SubmissionScreen from './SubmissionScreen';
import ContainerSuccessScreen from './ContainerSuccessScreen';
import AccountScreen from './AccountScreen';
import SubscriptionScreen from './SubscriptionScreen';
import EditNameEmailScreen from './EditNameEmailScreen';
// import { MaterialIcons } from '@expo/vector-icons';

const RootStack = createStackNavigator(
    {
        home: HomeScreen,
        map: MapScreen,
        scanQRCode: ScanQRCode,
        submission: SubmissionScreen,
        containerSuccessScreen: ContainerSuccessScreen,
        account: AccountScreen,
        subscription: SubscriptionScreen,
        editnameemail: EditNameEmailScreen,
    },
    {
        initialRouteName: 'home',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: styles.primaryColor,
            },
            headerTintColor: '#ffffff',
            tintColor: styles.primaryCream,
            borderTopWidth: Constants.statusBarHeight,
            headerTitleStyle: {
                color: '#ffffff',
                fontWeight: 'bold',
            },
        },
    },
);

// const RootStack = createBottomTabNavigator(
//     {
//         home: HomeScreen,
//         map: MapScreen,
//         scanQRCode: ScanQRCode,
//         submission: SubmissionScreen,
//         containerSuccessScreen: ContainerSuccessScreen,
//         account: AccountScreen,
//         subscription: SubscriptionScreen,
//         editnameemail: EditNameEmailScreen,
//     },
//     {
//         initialRouteName: 'scanQRCode',
//         order: ['account', 'scanQRCode', 'map'],
//         tabBarOptions: {
//             activeTintColor: '#e91e63',
//             tintColor: 'white',
//             inactiveTintColor: 'white',
//             labelStyle: {
//                 fontSize: 12,
//             },
//             style: {
//                 backgroundColor: styles.primaryColor,
//             },
//         },
//         defaultNavigationOptions: ({ navigation }) => ({
//             tabBarIcon: ({ focused, tintColor }) => {
//                 console.log(navigation);
//                 // You can return any component that you like here! We usually use an
//                 // icon component from react-native-vector-icons
//                 return <MaterialIcons name='map' size={25} color='white' />;
//             },
//             headerStyle: {
//                 backgroundColor: styles.primaryColor,
//             },
//             headerTintColor: '#ffffff',
//             tintColor: styles.primaryCream,
//             borderTopWidth: Constants.statusBarHeight,
//             headerTitleStyle: {
//                 color: '#ffffff',
//                 fontWeight: 'bold',
//             },
//         }),
//     },
// );

const AppNav = createAppContainer(RootStack);

@observer
class App extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.props.appStore.getUserData();
    //     this.props.appStore.getResturantData();
    // }

    async componentDidMount() {
        await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT_UP);
    }

    render() {
        const { store } = this.props;
        if (!store.authToken) {
            return <LoginScreen store={store} />;
        }
        return (
            <Provider appStore={store}>
                <AppNav
                    onNavigationStateChange={(prevState, newState) => {
                        store.setCurrentRoute(newState);
                    }}
                />
            </Provider>
        );
    }
}

export default App;
