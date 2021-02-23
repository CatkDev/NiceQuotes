import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, Platform, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Quote from './js/components/Quote';
import NewQuote from './js/components/NewQuote';
import StyledButton from './js/components/StyledButton';


export default class App extends Component {
    state = { index: 0, showNewQuoteScreen: false, quotes: [] };

    _storeData = async (quotes) => {
        try {
            const jsonQuotes = JSON.stringify(quotes)
            await AsyncStorage.setItem('@storage_Quotes', jsonQuotes)
        } catch (e) {
            // saving error
        }
    }

    _getData = async () => {
        try {
            const jsonQuotes = await AsyncStorage.getItem('@storage_Quotes');
            return jsonQuotes != null ? JSON.parse(jsonQuotes) : null;
        } catch (e) {
            // error reading value
        }
    }

    async _retrieveData() {
        if (this._getData !== null) {
            const tmpData = await this._getData();
            this.setState({ quotes: tmpData });
        }
    }

    _addQuote = (text, author) => {
        let quotesArray = this.state.quotes;
        if (text && author) {
            quotesArray.push({ text, author });
            this._storeData(this.state.quotes);
        }
        this.setState({ index: quotesArray.length - 1, showNewQuoteScreen: false, quotes: quotesArray });
    }

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
        let { index, quotes } = this.state;
        quotes.splice(index, 1);
        this._storeData(quotes);
        this.setState({ index: 0, quotes });
    }

    componentDidMount() {
        console.log(this.state.quotes.length);
        this._retrieveData();
    }

    // Die Render Methode sorgt für die richtige Darstellung im UI
    // render: Darstellung der Komponente im UI
    // render wird automatisch ausgeführt:
    // a) Komponente erscheint im UI (initialer Zustand in state)
    // b) Zustand ändert sich (state) [ ==> this.setState(...)]
    // c) props ändern sich
    render() {
        let { index, quotes } = this.state;
        let quote = quotes[index];
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
                    visible={quotes.length >= 1}
                    title='Nächstes Zitat'
                    onPress={() => this._displayNextQuote()}
                />
                <StyledButton
                    style={styles.lastButton}
                    visible={quotes.length >= 1}
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
