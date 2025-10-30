import * as signalR from "@microsoft/signalr";
import { useEffect } from 'react';
import config from 'el/config/config'
import authStorage from 'el/auth/storage';

export default function useSignalR() {
    useEffect(() => {
        buildSignalR();
    }, []);

    const buildSignalR = async () => {
        const token = await authStorage.getToken();

        if (!token) return;
        if (global.signalr?.state === signalR.HubConnectionState.Connected) return;

        global.signalr = new signalR.HubConnectionBuilder()
            .withUrl(`${config.apiUrl}/chatHub`, { accessTokenFactory: () => token || '' })
            .configureLogging(signalR.LogLevel.None)
            .build();
        global.signalr.onreconnecting(() => console.log('connecting server'));
        global.signalr.onreconnected(() => console.log('connect successfully'));

        if (global.signalr.state !== signalR.HubConnectionState.Connected) {
            global.signalr.start();
        }
    };

    const open = () => {
        buildSignalR();
    };

    const refresh = () => {
        if (global.signalr && global.signalr?.state !== signalR.HubConnectionState.Connected) {
            global.signalr.start();
        }
    };

    const register = (event: string, callback: (...args: any[]) => any) => {
        if (global.signalr && global.signalr?.state === signalR.HubConnectionState.Connected) {
            global.signalr.on(event, callback);
        }
    };

    const unregister = (event: string) => {
        if (global.signalr && global.signalr?.state === signalR.HubConnectionState.Connected) {
            global.signalr.off(event);
        }
    };

    const invokeSendTypingState = (event: string, receiverId, typingState) => {
        if (global.signalr && global.signalr?.state === signalR.HubConnectionState.Connected) {
            global.signalr.invoke(event, receiverId, typingState);
        }
    }

    const invokeMarkMessageAsRead = (event: string, receiverId) => {
        if (global.signalr && global.signalr?.state === signalR.HubConnectionState.Connected) {
            global.signalr.invoke(event, receiverId);
        }
    }

    const invokeSendMessage = (event: string, receiverId, chatContent, sender, onSuccessCallback, onFailCallback) => {
        if (global.signalr && global.signalr?.state === signalR.HubConnectionState.Connected) {
            global.signalr.invoke(event, receiverId, chatContent, sender).then(onSuccessCallback).catch(onFailCallback);
        }
    }

    return { open, refresh, register, unregister, invokeSendTypingState, invokeMarkMessageAsRead, invokeSendMessage };
}