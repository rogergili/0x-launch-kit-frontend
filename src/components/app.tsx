import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { UI_UPDATE_CHECK_INTERVAL, UPDATE_ETHER_PRICE_INTERVAL, USE_DARK_THEME } from '../common/constants';
import {
    initializeAppNoMetamaskOrLocked,
    updateMarketPriceEther,
    updateStore,
    useDarkThemeTemplate,
} from '../store/actions';
import { getWeb3State } from '../store/selectors';
import { StoreState, Web3State } from '../util/types';

interface OwnProps {
    children: React.ReactNode;
}

interface StateProps {
    web3State: Web3State;
}

interface DispatchProps {
    onInitMetamaskState: () => any;
    onUpdateStore: () => any;
    onUpdateMarketPriceEther: () => any;
    useDarkThemeTemplate: (useDarkTheme: boolean) => any;
}

type Props = OwnProps & DispatchProps & StateProps;

class App extends React.Component<Props> {
    private _updateStoreInterval: number | undefined;
    private _updatePriceEtherInterval: number | undefined;

    public componentDidMount = () => {
        this.props.onInitMetamaskState();
        this.props.useDarkThemeTemplate(USE_DARK_THEME);
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>, prevState: Readonly<Props>, snapshot?: any) => {
        const { web3State } = this.props;
        if (web3State !== prevProps.web3State) {
            if (web3State === Web3State.Done) {
                this._activatePollingUpdates();
            } else {
                // If the user is currently using the dApp with the interval and the metamask status changed, the polling is removed
                this._deactivatePollingUpdates();
            }
        }
    };

    public componentWillUnmount = () => {
        clearInterval(this._updateStoreInterval);
        clearInterval(this._updatePriceEtherInterval);
    };

    public render = () => this.props.children;

    private readonly _activatePollingUpdates = () => {
        // Enables realtime updates of the store using polling
        if (UI_UPDATE_CHECK_INTERVAL !== 0 && !this._updateStoreInterval) {
            this._updateStoreInterval = window.setInterval(async () => {
                this.props.onUpdateStore();
                this.setState({
                    isActiveCheckUpdates: true,
                });
            }, UI_UPDATE_CHECK_INTERVAL);
        }

        // Enables realtime updates of the price ether using polling
        if (!this._updatePriceEtherInterval && UPDATE_ETHER_PRICE_INTERVAL !== 0) {
            this._updatePriceEtherInterval = window.setInterval(async () => {
                this.props.onUpdateMarketPriceEther();
            }, UPDATE_ETHER_PRICE_INTERVAL);
        }
    };

    private readonly _deactivatePollingUpdates = () => {
        if (this._updateStoreInterval) {
            clearInterval(this._updateStoreInterval);
            this._updateStoreInterval = undefined;
        }

        if (this._updatePriceEtherInterval) {
            clearInterval(this._updatePriceEtherInterval);
            this._updatePriceEtherInterval = undefined;
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return {
        onInitMetamaskState: () => dispatch(initializeAppNoMetamaskOrLocked()),
        onUpdateStore: () => dispatch(updateStore()),
        onUpdateMarketPriceEther: () => dispatch(updateMarketPriceEther()),
        useDarkThemeTemplate: (useDarkTheme: boolean) => dispatch(useDarkThemeTemplate(useDarkTheme)),
    };
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);

export { App, AppContainer };
