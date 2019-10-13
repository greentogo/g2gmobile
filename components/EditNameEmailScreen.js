import React from 'react';
import {
    TouchableOpacity,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import {
    Content,
    Text,
    Form,
    Item,
    Input,
    Label,
    Spinner,
} from 'native-base';
import styles from '../styles';
import axios from '../apiClient';

@inject('appStore')
@observer
class EditNameEmailScreen extends React.Component {
    static navigationOptions = {
        title: 'Edit Name and Email',
        headerTitleStyle: { width: 300 },
    };

    constructor(props) {
        super(props);
        this.state = {
            ...this.props.appStore.user,
            emailInput: this.props.appStore.user.email,
            nameInput: this.props.appStore.user.name,
            error: [],
            message: undefined,
        };
        this.attemptEdit = this.attemptEdit.bind(this);
    }

    attemptEdit() {
        this.setState({ error: [], message: undefined, loading: true }, async () => {
            try {
                const body = {
                    name: this.state.nameInput,
                    email: this.state.emailInput,
                };
                const config = {
                    headers: {
                        Authorization: `Token ${this.props.appStore.authToken}`,
                    },
                };
                const response = await axios.patch('/me/', body, config);
                this.props.appStore.setUserData(response.data.data);
                this.setState({ loading: false, message: 'Information Updated!' });
            } catch (error) {
                if (error.response && error.response.data && error.response.data.data && error.response.data.data.error) {
                    this.setState({ error: [error.response.data.data.error], loading: false });
                } else {
                    this.setState({ error: ['We are sorry, we are having trouble processing your request. Please try again later.'], loading: false });
                    axios.log('EditNameEmailScreen.js attemptEdit', error);
                }
            }
        });
    }

    render() {
        const loadingSpinner = this.state.loading
            ? <Spinner color={styles.primaryColor} />
            : null;
        let errorMessages = null;
        if (this.state.error[0] !== undefined) {
            errorMessages = this.state.error.map(error => <Text key={`${error.trim()}`} style={styles.errorStyle}>{error}</Text>);
        }
        const message = this.state.message
            ? <Text style={styles.centeredText}>{this.state.message}</Text>
            : null;
        return (
            <Content style={styles.container}>
                <Form>
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            onChangeText={text => this.setState({ emailInput: text })}
                            value={this.state.emailInput}
                        />
                    </Item>
                    <Item floatingLabel last>
                        <Label>Name</Label>
                        <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={text => this.setState({ nameInput: text })}
                            value={this.state.nameInput}
                        />
                    </Item>
                    {errorMessages}
                    {message}
                    {loadingSpinner}
                    <TouchableOpacity style={styles.loginButton} onPress={this.attemptEdit}>
                        <Text style={styles.boldCenteredText}>Update</Text>
                    </TouchableOpacity>
                </Form>
            </Content>
        );
    }
}

export default EditNameEmailScreen;
