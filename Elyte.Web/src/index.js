import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import { StyledEngineProvider } from '@mui/material/styles';
import { ElSnackbar, ElErrorBoundary } from 'components';
import ErrorPage from 'pages/Home/errorPage';

(() => {
    Array.isNullOrEmpty = function (array) {
        return !Array.isArray(array) || array.length <= 0 || array === [];
    }

    String.prototype.endWith = function (str) {
        if (str === null || str === undefined || str === "" || this.length === 0 || str.length > this.length) {
            return false;
        }

        return this.substring(this.length - str.length) === str;
    }

    String.prototype.startWith = function (str) {
        if (str === null || str === undefined || str === "" || this.length === 0 || str.length > this.length) {
            return false;
        }

        return this.substring(0, str.length) === str;
    }

    String.prototype.isNullOrEmpty = String.isNullOrEmpty = function (str) {
        return str === null || str === "" || str.length === 0 || str === undefined;
    }
})()

ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <ElErrorBoundary FallbackComponent={ErrorPage}>
                    <App />
                </ElErrorBoundary>
            </BrowserRouter>
        </ThemeProvider>
    </StyledEngineProvider>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

window.onerror = function (errorMessage, scriptURI, lineNo, columnNo, error) {
    console.log('errorMessage', errorMessage);
    console.log('scriptURI', scriptURI);
    console.log('lineNo', lineNo);
    console.log('columnNo', columnNo);
    console.log('error', error);
};

window.onunhandledrejection = event => {
    console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
};

window.elyte = {
    warning: message => {
        if (message) {
            let div = document.createElement('div');
            ReactDOM.render(<ElSnackbar severity="warning">{message}</ElSnackbar>, div);
            document.body.appendChild(div);
        }
    },
    info: message => {
        if (message) {
            let div = document.createElement('div');
            ReactDOM.render(<ElSnackbar severity="info">{message}</ElSnackbar>, div);
            document.body.appendChild(div);
        }
    },
    error: message => {
        if (message) {
            let div = document.createElement('div');
            ReactDOM.render(<ElSnackbar severity="error">{message}</ElSnackbar>, div);
            document.body.appendChild(div);
        }
    },
    success: message => {
        if (message) {
            let div = document.createElement('div');
            ReactDOM.render(<ElSnackbar severity="success">{message}</ElSnackbar>, div);
            document.body.appendChild(div);
        }
    },
};
