import { BearerStrategy } from "passport-azure-ad"

export const authorizationStrategy = (config) => {

    const auth = {
        tenantID: config.authentication.tenantId,
        clientID: config.authentication.clientId,
        audience: config.authentication.audience,
        authority: "login.microsoftonline.com",
        version: "v2.0",
        discovery: ".well-known/openid-configuration",
        scope: config.authentication.scopes,
        validateIssuer: false,
        passReqToCallback: false,    
        loggingLevel: "info",
    }

    const options = {
        identityMetadata: `https://${auth.authority}/${auth.tenantID}/${auth.version}/${auth.discovery}`,
        issuer: `https://${auth.authority}/${auth.tenantID}/${auth.version}`,
        clientID: auth.clientID,
        audience: auth.audience,
        validateIssuer: auth.validateIssuer,
        passReqToCallback: auth.passReqToCallback,
        loggingLevel: auth.loggingLevel,
        //scope: auth.scope
        //loggingNoPII: false,
        allowMultiAudiencesInToken:true
    };

    const bearerStrategy = new BearerStrategy(options, (token, done) => {        
        // Send user info using the second argument
        done(null, {}, token);
    });

    return bearerStrategy
}