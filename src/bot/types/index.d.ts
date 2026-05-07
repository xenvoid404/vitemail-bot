interface AdminSessionState {
    IDLE: {};
}

interface UserSessionState {
    IDLE: {};
    CREATE_EMAIL_CUSTOM: {
        step: 'INPUT_EMAIL';
    };
}

export type AdminSession = { [K in keyof AdminSessionState]: { type: K } & AdminSessionState[K] }[keyof AdminSessionState];
export type UserSession = { [K in keyof UserSessionState]: { type: K } & UserSessionState[K] }[keyof UserSessionState];
