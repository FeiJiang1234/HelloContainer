const appStates = {
    isSignalRConnected: false,
    chatList: [],
    chatHistoryList: [],
    refreshAlarmQueue: 0
};

const AppActions = {
    SetSiganlRConnectionState: 'SetSiganlRConnectionState',
    UpdateChatList: 'UpdateChatList',
    UpdateChatHistoryList: "UpdateChatHistoryList",
    RefreshAlarmQueue: "RefreshAlarmQueue"
};

function appReducer (state, action) {
    switch (action.type) {
        case AppActions.SetSiganlRConnectionState:
            return { ...state, isSignalRConnected: action.payload }
        case AppActions.UpdateChatList:
            return { ...state, chatList: action.payload }
        case AppActions.UpdateChatHistoryList:
            return { ...state, chatHistoryList: action.payload }
        case AppActions.RefreshAlarmQueue:
            return { ...state, refreshAlarmQueue: state.refreshAlarmQueue + 1 }
    }
}

export { appStates, appReducer, AppActions }