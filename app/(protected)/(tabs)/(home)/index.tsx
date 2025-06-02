import { deposit, withdraw } from "@/api/transactions";
import { me } from "@/api/users";
import colors from "@/data/styling/colors";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Home = () => {
  const [balance, setBalance] = useState(0);
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");

  const handleSwitch = () => {
    setMode(mode === "deposit" ? "withdraw" : "deposit");
  };

  interface User {
    id: number;
    image: string;
    username: string;
    balance: number;
  }

  const {
    data: user,
    isFetching,
    isError,
    refetch,
  } = useQuery<User>({
    queryKey: ["getMe"],
    queryFn: me,
    refetchOnWindowFocus: true, // <-- add this line
    refetchOnMount: true, // <-- add this line for extra safety
  });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  const mdeposit = useMutation({
    mutationKey: ["deposit"],
    mutationFn: (amount: number) => deposit(amount),
    onSuccess: () => {
      alert("Deposit done!");
      refetch();
    },
  });

  const mwithdraw = useMutation({
    mutationKey: ["withdraw"],
    mutationFn: (amount: number) => withdraw(amount),
    onSuccess: () => {
      alert("Withdraw done!");
      refetch();
    },
  });

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (mode === "deposit") {
      setBalance(balance + numAmount);
      mdeposit.mutate(numAmount);
    } else if (mode === "withdraw" && numAmount <= balance) {
      setBalance(balance - numAmount);
      mwithdraw.mutate(numAmount);
    }

    setAmount("");
  };

  return (
    <View style={styles.container}>
      {/* Balance Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Available Balance :</Text>
        <Text style={styles.balanceText}>
          {user && user.balance.toFixed(2)} KWD
        </Text>
      </View>

      {/* Deposit/Withdraw Card */}
      <View style={styles.card}>
        <View style={styles.switchContainer}>
          <Text style={[styles.modeLabel, mode === "deposit" && styles.bold]}>
            Deposit
          </Text>
          <Switch
            value={mode === "withdraw"}
            onValueChange={handleSwitch}
            trackColor={{ false: "#ccc", true: colors.primary }}
            thumbColor={colors.white}
          />
          <Text style={[styles.modeLabel, mode === "withdraw" && styles.bold]}>
            Withdraw
          </Text>
        </View>

        <TextInput
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          style={styles.input}
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    maxWidth: 400,
    marginHorizontal: "auto",
    marginTop: 40,
    gap: 24,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    alignItems: "center",
  },
  cardTitle: {
    marginBottom: 16,
    fontSize: 16,
  },
  balanceText: {
    fontSize: 26,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modeLabel: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  input: {
    padding: 8,
    borderRadius: 6,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    width: "80%",
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
