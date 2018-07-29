import React from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import styles from "../styles";


class ContainerSuccessScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            boxCount: this.props.navigation.state.params.boxCount,
            service: this.props.navigation.state.params.locationData.service,
            time: new Date()
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Check In/Out Success!',
            headerTitleStyle: { width: 300 },
            headerLeft: (
                <TouchableOpacity><Text style={styles.popToTopStyle} onPress={() => navigation.popToTop()}>X</Text></TouchableOpacity>
            )
        }
    };

    render() {
        return (
            <View style={styles.successTopContainer}>
                <Text style={styles.successText}>
                    Checked {this.state.service.toLowerCase()}
                </Text>
                <Text style={styles.successText}>
                    {this.state.boxCount === 1 ? "1 box" : `${this.state.boxCount} boxes`}
                </Text>
                {/* TODO: Give location name on successful checkOut and set it to state */
                }
                {/* <Text style={{color: '#628e86', textAlign: 'center', fontSize: 45}}>
                {this.state.location ? "from " + this.state.location : ""}
                </Text> */}
                <Text style={styles.successDateTimeText}>
                    {this.state.time ? this.state.time.toLocaleTimeString() : ""}
                </Text>
                <Text style={styles.successDateTimeText}>
                    {this.state.time ? this.state.time.toLocaleDateString() : ""}
                </Text>
                <View style={styles.successImageContainer}>
                    <Image
                        source={require('../assets/icons/GTG-Box-App.png')}
                        style={styles.successImage}
                    />
                </View>
            </View>
        )
    }
}

export default ContainerSuccessScreen;
