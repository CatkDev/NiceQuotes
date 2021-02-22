import React, { Component } from 'react';
import { Button, View } from 'react-native';

export default class StyledButton extends Component {
    render() {
        return (
            <View style={this.props.style}>
                <Button
                    title={this.props.title}
                    onPress={this.props.onPress}
                />
            </View>
        );
    }
}
