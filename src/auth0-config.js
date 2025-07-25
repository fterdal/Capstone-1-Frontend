export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || "franccesco.us.auth0.com",
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || "YVI08TG7FVmUomdxAYaLjyYzLBaMXlt5",
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
};
