import React from 'react';
import { AppLoading, registerRootComponent } from 'expo';
import { observer } from 'mobx-react';
import App from './components/App';
import store from './stores';

@observer class GreenToGo extends React.Component {
    constructor() {
        super();
        this.state = { loaded: true };
        // Uncomment for font loading
        // this.state = { loaded: false };
    }

    // async componentDidMount() {
    //     await Font.loadAsync({
    //         Roboto: require('native-base/Fonts/Roboto.ttf'),
    //         Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    //     });
    //     this.setState({ loaded: true });
    // }

    render() {
        if (this.state.loaded) {
            return (
                <App store={store} />
            );
        }
        return <AppLoading />;
    }
}

registerRootComponent(GreenToGo);
