import './App.scss';
import {TonConnectUIProvider, THEME} from '@tonconnect/ui-react';
import React from "react";
import {TonProof} from "./components/TonProof/TonProof";
import {Header} from "./components/Header/Header";
import {
    BrowserRouter as Router,
} from "react-router-dom";

const manifestUrl = 'https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json';

function App() {
    return (
        <TonConnectUIProvider manifestUrl={manifestUrl} uiPreferences={{ theme: THEME.DARK }}>
            <Router>
            <div className="app">
                <Header />
                <TonProof />
            </div>
            </Router>
        </TonConnectUIProvider>

    )
}

export default App
