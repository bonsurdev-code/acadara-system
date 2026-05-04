import { OAuth2Client } from "google-auth-library";
import axios from "axios";

export const verifyGoogleToken = async (accessToken) => {
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return {
    provider: "google",
    provider_id: data.sub,
    email: data.email,
    name: data.name,
  };
};

export const verifyFacebookToken = async (accessToken) => {
  const { data } = await axios.get(
    `https://graph.facebook.com/me`,
    {
      params: {
        fields: "id,name,email",
        access_token: accessToken,
      },
    }
  );

  return {
    provider: "facebook",
    provider_id: data.id,
    email: data.email,
    name: data.name
  };
};