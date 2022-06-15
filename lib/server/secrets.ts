import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

const secretsManager = new SecretsManagerClient({ region: "us-east-1" });

export interface Secrets {
  AZURE_TENANT: string;
  AZURE_SECRET: string;
  AZURE_CLIENT_ID: string;
  AZURE_OBJECT_ID: string;
  AZURE_KEY_ID: string;
  NEXTAUTH_SECRET: string;
}

export default secretsManager
  .send(
    new GetSecretValueCommand({
      SecretId: "newsrevealer-ui",
    })
  )
  .then((response): Secrets => {
    if (response.SecretString) {
      return JSON.parse(response.SecretString);
    } else {
      throw new Error("Invalid secret string returned from Secrets Manager");
    }
  });
