import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../../style.scss';
import {TonProofDemoApi} from "../../services/TonProofDemoApi";
import {useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {CHAIN} from "@tonconnect/ui-react";
import {
    useLocation
} from "react-router-dom";

export const TonProof = () => {
    const query = useQuery();
    console.log(query.get("giveawayId"));

    // const [data, setData] = useState({});
    const wallet = useTonWallet();
    const [authorized, setAuthorized] = useState(false);
    const [tonConnectUI] = useTonConnectUI();

    const firstProofLoading = useRef<boolean>(true);

    const recreateProofPayload = useCallback(async () => {
        if (firstProofLoading.current) {
            tonConnectUI.setConnectRequestParameters({ state: 'loading' });
            firstProofLoading.current = false;
        }

        const payload = await TonProofDemoApi.generatePayload();

        if (payload) {
            tonConnectUI.setConnectRequestParameters({ state: 'ready', value: payload });
        } else {
            tonConnectUI.setConnectRequestParameters(null);
        }
    }, [tonConnectUI, firstProofLoading])

    if (firstProofLoading.current) {
        recreateProofPayload();
    }

    useEffect(() =>
        tonConnectUI.onStatusChange(async w => {
            console.log('wallet', w);
            console.log('ci', w.connectItems);
            if (!w || w.account.chain === CHAIN.TESTNET) {
                TonProofDemoApi.reset();
                setAuthorized(false);
                return;
            }

            if (w.connectItems?.tonProof && 'proof' in w.connectItems.tonProof) {
                await TonProofDemoApi.checkProof(w.connectItems.tonProof.proof, w.account);
            }

            if (!TonProofDemoApi.accessToken) {
                tonConnectUI.disconnect();
                setAuthorized(false);
                return;
            }

            setAuthorized(true);
        }), [tonConnectUI]);


    const handleClick = useCallback(async () => {
        if (!wallet) {
            return;
        }
        const response = await TonProofDemoApi.getAccountInfo(wallet.account);

        console.log(response);
        // setData(response);
    }, [wallet]);

    if (!authorized) {
        return null;
    }

    return (
        <div className="ton-proof-demo">
            <h3>Demo backend API with ton_proof verification</h3>
    {authorized ? (
        <button onClick={handleClick}>
            Call backend getAccountInfo()
    </button>
    ) : (
        <div className="ton-proof-demo__error">Connect wallet to call API</div>
    )}
        </div>
);
}

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}
