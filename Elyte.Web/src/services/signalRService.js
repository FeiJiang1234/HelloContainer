const sendMessage = (receiverId, chatContent, sender) => {
    return window.signalR.invoke("SendMessage", receiverId, chatContent, sender);
}

const registerReceiveMessageEvent = (callback) => {
    window.signalR?.on("ReceiveMessage", callback);
}

const unregisterReceiveMessageEvent = () => {
    window.signalR?.off("ReceiveMessage");
}

const registerCheckIsExistUnreadItemEvent = (callback) => {
    window.signalR?.on("CheckIsExistUnreadItem", callback);
}

const markMessageAsRead = (senderId) => {
    if (window.signalR?.state === "Connected") {
        window.signalR.invoke("MarkMessageAsRead", senderId).catch(() => { });
    }
}

const registerRefreshChatListEvent = (callback) => {
    window.signalR?.on("RefreshChatList", callback);
}

const unregisterRefreshChatListEvent = () => {
    window.signalR?.off("RefreshChatList");
}

const sendTypingState = (receiverId, state) => {
    return window.signalR.invoke("SendTypingState", receiverId, state);
}

const registerReceiveTypingStateEvent = (callback) => {
    window.signalR?.on("ReceiveTypingState", callback);
}

const unregisterReceiveTypingStateEvent = () => {
    window.signalR?.off("ReceiveTypingState");
}

const registerReceiveNotificationEvent = (callback) => {
    window.signalR?.on("ReceiveNotification", callback)
}

const registerClearNotificationEvent = (callback) => {
    window.signalR?.on("ClearNotification", callback)
}

const registerRefreshGameEvent = (callback) => {
    window.signalR?.on("RefreshGame", callback);
}

const unregisterRefreshGameEvent = () => {
    window.signalR?.off("RefreshGame");
}

export default {
    sendMessage,
    registerReceiveMessageEvent,
    unregisterReceiveMessageEvent,
    registerCheckIsExistUnreadItemEvent,
    markMessageAsRead,
    registerRefreshChatListEvent,
    unregisterRefreshChatListEvent,
    sendTypingState,
    registerReceiveTypingStateEvent,
    unregisterReceiveTypingStateEvent,
    registerReceiveNotificationEvent,
    registerClearNotificationEvent,
    registerRefreshGameEvent,
    unregisterRefreshGameEvent
};