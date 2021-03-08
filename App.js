import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    SafeAreaView,
    Alert
} from 'react-native';

import * as SQLite from 'expo-sqlite';

import Quote from './js/components/Quote';
import NewQuote from './js/components/NewQuote';
import StyledButton from './js/components/StyledButton';

const database = SQLite.openDatabase('quotes.db');

export default class App extends Component {
    state = { index: 0, showNewQuoteScreen: false, quotes: [] };

    _saveQuoteToDB(text, author, quotes) {
        database.transaction(
            transaction => transaction.executeSql(
                'INSERT INTO quotes (text,author) VALUES (?,?)',
                [text, author],
                (_, result) =>
                    (quotes[quotes.length - 1].id = result.insertId)
            )
        );
    }

    _removeQuoteFromDB(id) {
        database.transaction(
            transaction => transaction.executeSql(
                'DELETE FROM quotes WHERE id = ?',
                [id],
                (_, result) =>
                    console.log('ID gelöscht:', result.insertId)
            )
        );
    }

    _retrieveData() {
        database.transaction(
            transaction => transaction.executeSql(
                'SELECT * FROM quotes',
                [],
                (_, result) =>
                    this.setState({ quotes: result.rows._array })
            )
        );
    };

    _addQuote = (text, author) => {
        let { quotes } = this.state;
        if (text && author) {
            quotes.push({ text, author });
            this._saveQuoteToDB(text, author, quotes);
        }
        this.setState({
            index: quotes.length - 1,
            showNewQuoteScreen: false,
            quotes
        });
    };

    _displayNextQuote() {
        let { index, quotes } = this.state;
        let nextIndex = index + 1;
        if (nextIndex === quotes.length) nextIndex = 0;
        this.setState({ index: nextIndex });
    }

    _displayLastQuote() {
        let { index, quotes } = this.state;
        let lastIndex = index - 1;
        if (lastIndex === -1) lastIndex = quotes.length - 1;
        this.setState({ index: lastIndex });
    }

    _deleteButton() {
        Alert.alert(
            'Zitat löschen',
            'Dies kann nicht rückgängig gemacht werden!',
            [
                {
                    text: 'Abbrechen',
                    style: 'cancel'
                },
                {
                    text: 'Löschen',
                    style: 'destructive',
                    onPress: () => this._deleteQuote()
                }
            ]
        );
    }

    _deleteQuote() {
        let { index, quotes } = this.state;
        this._removeQuoteFromDB(quotes[index].id);
        quotes.splice(index, 1);
        this.setState({ index: 0, quotes });
    }

    componentDidMount() {
        database.transaction(
            transaction =>
                transaction.executeSql('CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY NOT NULL, text TEXT, author TEXT)'
                )
        );
        this._retrieveData();
    }

    render() {
        let { index, quotes } = this.state;
        const quote = quotes[index];
        let content = <Text style={{ fontSize: 36 }}>Keine Zitate</Text>;
        if (quote) {
            content = <Quote text={quote.text} author={quote.author} />
        }
        return (
            // JSX => JavaScript und XML
            <SafeAreaView style={styles.container}>
                <StyledButton
                    style={styles.newButton}
                    visible={true}
                    title='Neues Zitat'
                    onPress={() => this.setState({ showNewQuoteScreen: true })}
                />
                <StyledButton
                    style={styles.deleteButton}
                    visible={quotes.length >= 1}
                    title='Zitat löschen'
                    onPress={() => this._deleteButton()}
                />
                <NewQuote
                    visible={this.state.showNewQuoteScreen}
                    onSave={this._addQuote}
                />
                {content}
                <StyledButton
                    style={styles.nextButton}
                    visible={quotes.length > 1}
                    title='Nächstes Zitat'
                    onPress={() => this._displayNextQuote()}
                />
                <StyledButton
                    style={styles.lastButton}
                    visible={quotes.length > 1}
                    title='Letztes Zitat'
                    onPress={() => this._displayNextQuote()}
                />

            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee', //CSS => background-color
        alignItems: 'center',
        justifyContent: 'center'
    },
    lastButton: {
        position: 'absolute',
        bottom: 20,
        left: 20
    },
    nextButton: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 20 : 20,
        right: 20
    },
    newButton: {
        position: 'absolute',
        top: 50,
        right: 20
    },
    deleteButton: {
        position: 'absolute',
        top: 50,
        left: 20
    }
});
