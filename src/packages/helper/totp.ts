import * as otplib from 'otplib';

export const totp = { generate: (secret?: string) => otplib.authenticator.generate((secret || '')) };
