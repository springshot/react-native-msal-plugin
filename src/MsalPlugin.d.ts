import { IAuthenticationResult, IPolicies } from "./MsalPluginInterfaces";
export default class MsalPlugin {
    private authority;
    private clientId;
    private b2cAuthority;
    constructor(authority: string, clientId: string);
    acquireTokenAsync: (scopes: string[], extraQueryParameters?: Record<string, string> | undefined) => Promise<IAuthenticationResult>;
    aquireTokenB2CAsync: (scopes: string[], policies: IPolicies, extraQueryParameters?: Record<string, string> | undefined, beforePasswordReset?: (() => {}) | undefined) => IAuthenticationResult;
    acquireTokenSilentAsync: (scopes: string[], userIdentitfier: string, authority: string) => Promise<IAuthenticationResult>;
    tokenCacheDeleteItem: (userIdentitfier: string) => Promise<void>;
    tokenCacheB2CDeleteItem: (authority: string, userIdentitfier: string) => Promise<void>;
    private resetPasswordAsync;
    private _addPolicyToAuthority;
}
