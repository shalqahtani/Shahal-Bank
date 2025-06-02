import { getAllUsers } from "@/api/users";
import colors from "@/data/styling/colors";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface User {
  id: number;
  image: string;
  username: string;
  balance: number;
}

const UserCard = ({ user }: { user: User }) => (
  <View style={styles.card}>
    {user.image && (
      <Image source={{ uri: user.image }} style={styles.image} />
    )}
    <Text style={styles.name}>{user.username}</Text>
    <Text style={styles.email}>{user.balance}</Text>
  </View>
);

const UsersScreen = () => {
  const {
    data: users,
    isFetching,
    isError,
  } = useQuery<User[]>({
    queryKey: ["getUsers"],
    queryFn: getAllUsers, //
  });

  if (isFetching) return <Text>Loading...</Text>;
  if (isError || !users) return <Text>Failed to load users.</Text>;
  console.log("users : " + users);
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </View>
    </View>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 20,
    margin: 8,
    width: "100%",
    maxWidth: "16.66%",
    minWidth: 180,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  email: {
    color: "#888",
    fontSize: 15,
  },
});
