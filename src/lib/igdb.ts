// src/lib/igdb.ts
import axios from "axios";

const CLIENT_ID = process.env.NEXT_PUBLIC_IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiration: number | null = null;

async function getTwitchAccessToken() {
  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token`,
      null,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      }
    );
    accessToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error("Error getting Twitch access token:", error);
    throw error;
  }
}

async function getValidAccessToken() {
  if (!accessToken || !tokenExpiration || Date.now() >= tokenExpiration) {
    return getTwitchAccessToken();
  }
  return accessToken;
}

export async function makeIGDBRequest(endpoint: string, data: string) {
  try {
    const token = await getValidAccessToken();
    console.log("Making IGDB request:", endpoint, data);
    const response = await axios({
      url: `https://api.igdb.com/v4/${endpoint}`,
      method: "POST",
      headers: {
        "Client-ID": CLIENT_ID!,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "text/plain",
      },
      data: data,
    });
    console.log("IGDB response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error making IGDB request:", error);
    if (axios.isAxiosError(error)) {
      console.error("Request details:", error.config);
      console.error("Response details:", error.response?.data);
    }
    throw error;
  }
}
