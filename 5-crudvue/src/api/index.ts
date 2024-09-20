import axios from "axios";

axios.defaults.baseURL = "/api";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.timeout = 2500;

export const addUser = (data) =>
  axios.post("/user", data).then((res) => res.data);

export const getList = (data) =>
  axios.get("/user", { params: data }).then((res) => res.data);

export const delUser = (data) =>
  axios.delete(`/user/${data.id}`).then((res) => res.data);

export const updateUser = (data) =>
  axios.patch(`/user/${data.id}`, data).then((res) => res.data);

export const oneToOneApi = (data) =>
  axios.post("/user/oneToOneApi", data).then((res) => res.data);

export const oneToManyApi = (data) =>
  axios.post("/user/oneToManyApi", data).then((res) => res.data);

export const manyToManyApi = (data) =>
  axios.post("/user/manyToManyApi", data).then((res) => res.data);
