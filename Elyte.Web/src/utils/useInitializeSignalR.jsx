import * as signalR from "@microsoft/signalr";
import config from '../config';
import http from '../services/httpService';

export default function useInitializeSignalR () {
    const jwt = http.getJwt();

    if (!jwt) return { signalrClient: undefined };

    if (window.signalR) return { signalrClient: window.signalR };

    window.signalR = new signalR.HubConnectionBuilder()
        .withUrl(`${config.apiUrl}/chatHub`, { accessTokenFactory: () => jwt })
        .configureLogging(signalR.LogLevel.None)
        .build();

    return { signalrClient: window.signalR }
}