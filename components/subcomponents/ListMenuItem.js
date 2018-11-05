import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    View,
} from 'react-native';
import {
    Body,
    ListItem,
    Text,
    Left,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../styles';

// PureComponents dont render as often as stateless functions, and are therefore faster
/* eslint-disable react/prefer-stateless-function */
class ListMenuItem extends React.PureComponent {
    render() {
        const iconColor = this.props.color || styles.primaryColor;
        const onPress = this.props.onPress || function () { };
        const background = this.props.backgroundColor
            ? {
                borderRadius: 40,
                width: 30,
                height: 30,
                backgroundColor: this.props.backgroundColor,
            } : null;
        return (
            <TouchableHighlight>
                <ListItem
                    style={{
                        flex: 1, height: 80, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: styles.primaryColor, backgroundColor: styles.primaryCream,
                    }}
                    icon
                    onPress={onPress}
                >
                    <Left>
                        <View style={background}>
                            <MaterialIcons style={{ color: iconColor }} size={30} name={this.props.icon} />
                        </View>
                    </Left>
                    <Body style={{ borderBottomWidth: 0 }}>
                        <Text>{this.props.text}</Text>
                    </Body>
                </ListItem>
            </TouchableHighlight>
        );
    }
}

export default ListMenuItem;
