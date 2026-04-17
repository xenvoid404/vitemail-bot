type IdleState = {
    type: 'IDLE';
};

type EmailCustomState = {
    type: 'CREATE_EMAIL_CUSTOM';
    step: 'INPUT_EMAIL';
};

export type UserSessionState = IdleState | EmailCustomState;
