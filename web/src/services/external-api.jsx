import axios from "axios";

const externalApi = axios.create({
  baseURL: "https://api.screenshotmachine.com",
  headers: {}
});

export default externalApi;
