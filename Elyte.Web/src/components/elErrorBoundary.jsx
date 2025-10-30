import React from 'react';

const changedArray = (a, b) =>
    a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));

const initialState = {
    error: null,
};

class ErrorBoundary extends React.Component {
    static getDerivedStateFromError(error) {
        return { error };
    }

    state = initialState;
    resetErrorBoundary = (...args) => {
        this.props.onReset?.(...args);
        this.reset();
    };

    reset() {
        this.setState(initialState);
    }

    componentDidCatch(error, info) {
        this.props.onError?.(error, info);
    }

    componentDidUpdate(prevProps, prevState) {
        const { error } = this.state;
        const { resetKeys } = this.props;
        if (
            error !== null &&
            prevState.error !== null &&
            changedArray(prevProps.resetKeys, resetKeys)
        ) {
            this.props.onResetKeysChange?.(prevProps.resetKeys, resetKeys);
            this.reset();
        }
    }

    render() {
        const { error } = this.state;
        const { fallbackRender, FallbackComponent, fallback } = this.props;

        if (error !== null) {
            const props = {
                error,
                resetErrorBoundary: this.resetErrorBoundary,
            };

            if (React.isValidElement(fallback)) return fallback;
            if (typeof fallbackRender === 'function') return fallbackRender(props);
            if (FallbackComponent) return <FallbackComponent {...props} />;
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
