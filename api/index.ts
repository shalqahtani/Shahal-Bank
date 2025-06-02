import axios from "axios";
import { getToken } from "./storage";
const instance = axios.create({
  baseURL: "https://react-bank-project.eapi.joincoded.com/mini-project/api/",
});

//Athourization
instance.interceptors.request.use(async (req) => {
  const token = await getToken();

  //alert("token :" + token);
  if (token) {
    //  alert("token :" + token);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
export default instance;
