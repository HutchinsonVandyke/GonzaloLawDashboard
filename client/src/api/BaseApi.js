import axios from "axios";

// const port = process.env.PORT || 5000;
export default axios.create({
  baseURL: "/",
  responseType: "json"
});
