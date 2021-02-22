import React, { Component } from 'react';
import { StyleSheet, View, Button, Platform, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Quote from './js/components/Quote';
import NewQuote from './js/components/NewQuote';
import StyledButton from './js/components/StyledButton';

const data = [
    {
        text: 'Probleme kann man niemals mit derselben Denkweise lösen, durch die sie entstanden',
        author: 'Albert Einstein'
    },
    {
        text: 'Man kann den Wind nicht ändern, aber man kann das Segel neu setzen',
        author: 'Aristoteles'
    },
    {
        text: 'Am Ende der Ausreden beginnt dein Leben',
        author: 'Internet'
    }
];

export default class App extends Component {
    state = { index: 0, showNewQuoteScreen: false, quotes: data }; // initialer Zustand

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
        console.log('componentDidMount!!!', this.state.quotes);
    }

    _addQuote = (text, author) => {
        let quotesArray = this.state.quotes;
        if (text && author) {
            quotesArray.push({ text, author });
            this._storeData(this.state.quotes);
        }
        this.setState({ showNewQuoteScreen: false, quotes: quotesArray });
    }

    componentDidMount() {
        //alert('componentDidMount!!!');
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
        //if (quote === undefined) quote = {};
        let nextIndex = index + 1;
        let lastIndex = index - 1;
        if (nextIndex === quotes.length) nextIndex = 0;
        if (lastIndex === -1) lastIndex = quotes.length - 1;
        return (
            // JSX => JavaScript und XML
            <SafeAreaView style={styles.container}>
                <StyledButton
                    style={styles.newButton}
                    title='Neues Zitat'
                    onPress={() => this.setState({ showNewQuoteScreen: true })}
                />
                <NewQuote
                    visible={this.state.showNewQuoteScreen}
                    onSave={this._addQuote}
                />
                <Quote text={quote.text} author={quote.author} />
                <StyledButton
                    style={styles.nextButton}
                    title='Nächstes Zitat'
                    onPress={() => this.setState({ index: nextIndex })}
                />
                <StyledButton
                    style={styles.lastButton}
                    title='Letztes Zitat'
                    onPress={() => this.setState({ index: lastIndex })}
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
    }
});
