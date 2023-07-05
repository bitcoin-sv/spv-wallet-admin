const config = {
    loginTitle: process.env.REACT_APP_LOGIN_TITLE,
    loginSubtitle: process.env.REACT_APP_LOGIN_SUBTITLE,
    transportType: process.env.REACT_APP_TRANSPORT_TYPE,
    serverUrl: process.env.REACT_APP_SERVER_URL,
    hideServerUrl: process.env.REACT_APP_HIDE_SERVER_URL,
}

export const useConfig = function() {
    return {
        ...config
    }
}