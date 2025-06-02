// we will create a functions responsible for calling the auth endpoints

import instance from ".";
interface User {
  id: number;
  balance: number;
  image: string;
  username: string;
}
const me = async () => {
  const response = await instance.get<User>("auth/me");
  return response.data;
};
const getAllUsers = async () => {
  const response = await instance.get<User[]>("auth/users");
  return response.data;
};

const profile = async (image: string) => {
  const data = await instance.put("auth/profile", {
    image,
  });
  return data;
};
const user = async (userId: string) => {
  const data = await instance.get(`auth/user/${userId}`);
  return data;
};
export { getAllUsers, me, profile, user };
