"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const react_native_1 = require("react-native");
const { RNMsalPlugin } = react_native_1.NativeModules;
const RESET_PASSWORD_CODE = "AADB2C90118";
const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));
class MsalPlugin {
    constructor(authority, clientId) {
        this.acquireTokenAsync = (scopes, extraQueryParameters) => {
            return RNMsalPlugin.acquireTokenAsync(this.b2cAuthority, this.clientId, react_native_1.Platform.OS === "ios" ? scopes : scopes.join(","), JSON.stringify(extraQueryParameters));
        };
        this.aquireTokenB2CAsync = (scopes, policies, extraQueryParameters, beforePasswordReset) => {
            this._addPolicyToAuthority(policies.signUpSignInPolicy);
            return RNMsalPlugin.acquireTokenAsync(this.b2cAuthority, this.clientId, react_native_1.Platform.OS === "ios" ? scopes : scopes.join(","), JSON.stringify(extraQueryParameters)).catch((error) => {
                if (error.message.includes(RESET_PASSWORD_CODE) &&
                    policies.passwordResetPolicy) {
                    if (beforePasswordReset) {
                        beforePasswordReset();
                    }
                    return this.resetPasswordAsync(scopes, policies.passwordResetPolicy, extraQueryParameters);
                }
                else {
                    throw error;
                }
            });
        };
        this.acquireTokenSilentAsync = (scopes, userIdentitfier, authority) => {
            return RNMsalPlugin.acquireTokenSilentAsync(authority, this.clientId, react_native_1.Platform.OS === "ios" ? scopes : scopes.join(","), userIdentitfier);
        };
        this.tokenCacheDeleteItem = (userIdentitfier) => {
            return RNMsalPlugin.tokenCacheDeleteItem(this.authority, this.clientId, userIdentitfier);
        };
        this.tokenCacheB2CDeleteItem = (authority, userIdentitfier) => {
            return RNMsalPlugin.tokenCacheDeleteItem(authority, this.clientId, userIdentitfier);
        };
        this.resetPasswordAsync = (scopes, passwordResetPolicy, extraQueryParameters) => {
            const self = this;
            this._addPolicyToAuthority(passwordResetPolicy);
            // had to use a delay otherwise exception is thrown, only one interactive session allowed
            // if anyone knows a better way feel free to fix
            return delay(1000).then(() => {
                return RNMsalPlugin.acquireTokenAsync(self.b2cAuthority, self.clientId, react_native_1.Platform.OS === "ios" ? scopes : scopes.join(","), JSON.stringify(extraQueryParameters));
            });
        };
        this.authority = authority;
        this.clientId = clientId;
        this.b2cAuthority = authority;
    }
    _addPolicyToAuthority(policy) {
        this.b2cAuthority = this.authority + "/" + policy;
    }
}
exports.default = MsalPlugin;
