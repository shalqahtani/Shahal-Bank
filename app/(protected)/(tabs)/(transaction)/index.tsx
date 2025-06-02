import { my } from "@/api/transactions";
import colors from "@/data/styling/colors";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TransactionList = () => {
  const FILTERS = ["All", "Deposit", "Withdraw", "Transfer"];
  interface Transaction {
    id: number;
    type: string;
    createdAt: string;
    amount: number;
  }
  const {
    data: transactions,
    isFetching,
    isError,
    refetch,
  } = useQuery<Transaction[]>({
    queryKey: ["my"],
    queryFn: my,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Helper to format date as DD-MM-YYYY
  /* function formatDDMMYYYY(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }*/
  const filteredTransactions = useMemo(() => {
    return (
      transactions &&
      transactions.filter((t) => {
        const matchesType =
          filter.toLowerCase() === "all"
            ? true
            : t.type.toLowerCase() === filter.toLowerCase();
        const matchesSearch =
          t.type.toLowerCase().includes(search.toLowerCase()) ||
          String(t.amount).includes(search) ||
          t.createdAt.includes(search);

        // Date filtering (normalize to DD-MM-YYYY)
        const tDate = new Date(t.createdAt);
        tDate.setHours(0, 0, 0, 0);

        let afterFrom = true;
        let beforeTo = true;
        //fromDate=01-06-2025
        if (fromDate.trim()) {
          //' 01/06/2025 ' = '01/06/2025'
          const from = parseDDMMYYYY(fromDate.trim());
          if (from instanceof Date && !isNaN(from.getTime())) {
            from.setHours(0, 0, 0, 0);
            afterFrom = tDate >= from;
          } else {
            afterFrom = true; // ignore invalid date
          }
        }
        if (toDate.trim()) {
          const to = parseDDMMYYYY(toDate.trim());
          if (to instanceof Date && !isNaN(to.getTime())) {
            to.setHours(0, 0, 0, 0);
            beforeTo = tDate <= to;
          } else {
            beforeTo = true; // ignore invalid date
          }
        }

        return matchesType && matchesSearch && afterFrom && beforeTo;
      })
    );
  }, [transactions, search, filter, fromDate, toDate]);

  if (isFetching) return <Text>Loading...</Text>;
  if (isError || !transactions)
    return <Text>Failed to load transactions.</Text>;
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Transactions</Text> */}
      {/* Search Bar */}
      <TextInput
        style={styles.search}
        placeholder="Search by type, amount, or date"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#aaa"
      />
      {/* Filter Radio Buttons */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={styles.radioContainer}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
          >
            <View style={styles.radioOuter}>
              {filter === f && <View style={styles.radioInner} />}
            </View>
            <Text
              style={{
                color: colors.primary,
                fontWeight: filter === f ? "bold" : "normal",
                marginLeft: 6,
              }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Date Filters */}
      <View style={styles.dateRow}>
        <TextInput
          style={styles.dateInput}
          placeholder="From Date (DD-MM-YYYY)"
          value={fromDate}
          onChangeText={setFromDate}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="To Date (DD-MM-YYYY)"
          value={toDate}
          onChangeText={setToDate}
          placeholderTextColor="#aaa"
        />
      </View>
      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        // keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.type}>
              {item.type.charAt(0).toUpperCase() +
                item.type.slice(1).toLowerCase()}
            </Text>
            <Text
              style={[
                styles.amount,
                {
                  color:
                    item.type.toLowerCase() === "deposit"
                      ? "green"
                      : item.type.toLowerCase() === "withdraw"
                      ? "red"
                      : colors.primary,
                },
              ]}
            >
              {item.type === "deposit"
                ? "+"
                : item.type === "withdraw"
                ? "-"
                : ""}{" "}
              KWD {item.amount}
            </Text>
            <Text style={styles.date}>
              {(() => {
                //Jan 0
                //Feb 1
                //Mar 2
                const d = new Date(item.createdAt); //'01/06/2025 12:33:01'
                const day = String(d.getDate()).padStart(2, "0"); //'01'
                const month = String(d.getMonth() + 1).padStart(2, "0"); //06
                const year = d.getFullYear();
                let hours = d.getHours();
                const minutes = String(d.getMinutes()).padStart(2, "0");
                //To display time in 12 HR format
                const ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                const hourStr = String(hours).padStart(2, "0");
                return `${day}/${month}/${year} ${hourStr}:${minutes} ${ampm}`;
              })()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

function parseDDMMYYYY(dateStr: string) {
  //"01-06-2025"
  const [day, month, year] = dateStr.split("-"); //divides string value to day=01, month=06, year=2025
  if (!day || !month || !year) return null;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.primary,
  },
  search: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    fontSize: 16,
    color: colors.primary,
    backgroundColor: "#f9fafb",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 16,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
    marginBottom: 8,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 6,
    minWidth: 130,
    marginRight: 8,
    fontSize: 15,
    color: colors.primary,
    backgroundColor: "#f9fafb",
  },
  item: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  type: {
    fontWeight: "bold",
    color: colors.black,
  },
  amount: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 4,
  },
  date: {
    color: "#888",
    fontSize: 12,
  },
});

export default TransactionList;
