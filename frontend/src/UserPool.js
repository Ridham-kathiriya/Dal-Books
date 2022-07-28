import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_m6LuHVf0a",
  ClientId: "62n91akuolkhauklj1pfpgkdjv",
};

export default new CognitoUserPool(poolData);