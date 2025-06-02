import instance from ".";
interface Transaction {
  id: number;
  type: string;
  createdAt: string;
  amount: number;
}
const my = async () => {
  const response = await instance.get<Transaction[]>("transactions/my");
  // alert(response.data);
  console.log(response.data);
  return response.data;
};

const deposit = async (amount: number) => {
  const data = await instance.put("transactions/deposit", {
    amount,
  });
  return data;
};
const withdraw = async (amount: number) => {
  const data = await instance.put("transactions/withdraw", {
    amount,
  });
  return data;
};
const transfer = async (amount: number, username: string) => {
  const data = await instance.put(`transactions/transfer/${username}`, {
    amount,
  });

  return data;
};
export { deposit, my, transfer, withdraw };
