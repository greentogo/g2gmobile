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

const ListMenuItem = (props) => {
    const iconColor = props.color || styles.primaryColor;
    const onPress = props.onPress || function () { };
    const background = props.backgroundColor
        ? {
            borderRadius: 40,
            width: 30,
            height: 30,
            backgroundColor: props.backgroundColor,
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
                        <MaterialIcons style={{ color: iconColor }} size={30} name={props.icon} />
                    </View>
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                    <Text>{props.text}</Text>
                </Body>
            </ListItem>
        </TouchableHighlight>
    );
};

export default ListMenuItem;
