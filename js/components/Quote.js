import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';


/* export default function Quote(props) {
    const { text, author } = props;
    return (
        <Fragment>
            <Text>{text}</Text>
            <Text>-- {author}</Text>
        </Fragment>
    )
} */

export default class Quote extends Component {
    render() {
        const { text, author } = this.props;
        return (
            <View style={styles.container}>
                <Text style={[styles.text, { color: 'purple' }]}>{text}</Text>
                <Text style={styles.author}>&mdash; {author}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 10,
        elevation: 2, // nur Android
        backgroundColor: 'white',
        borderRadius: 4,
        // nur iOS
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 1.5
    },
    text: {
        fontSize: 26,
        fontStyle: 'italic',
        marginBottom: 10,
        textAlign: 'center'
    },
    author: {
        fontSize: 20,
        textAlign: 'right'
    }
});