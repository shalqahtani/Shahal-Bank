import { me, profile } from "@/api/users";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const MyProfile = () => {
  const [image, setImage] = useState<string | null>(null);
  interface User {
    id: number;
    balance: number;
    image: string;
    username: string;
  }
  const {
    data: user,
    isFetching,
    isError,
    refetch,
  } = useQuery<User>({
    queryKey: ["me"],
    queryFn: me,
    refetchOnWindowFocus: true, // <-- add this line
    refetchOnMount: true, // <-- add this line for extra safety
  });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  const mprofile = useMutation({
    mutationKey: ["register"],
    mutationFn: () => profile(image || ""),
    onSuccess: () => {
      alert("Profile updated successfully!");
      // Optionally, you can refetch the user data to get the updated profile
      refetch();
    },
  });
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (
      !result.canceled &&
      result.assets &&
      result.assets.length > 0 &&
      result.assets[0].uri
    ) {
      setImage(result.assets[0].uri); // Only set the URI string
      mprofile.mutate();
    }
  };

  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 40,
        padding: 24,
        backgroundColor: "#fff",
        borderRadius: 16,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <TouchableOpacity onPress={pickImage}>
        <View
          style={{
            backgroundColor: "#e5e7eb",
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          {(image || (user && user.image)) && (
            <Image
              source={{ uri: image || (user && user.image) }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                marginBottom: 5,
                marginTop: 15,
              }}
            />
          )}

          <TouchableOpacity style={{ marginTop: 5 }} onPress={pickImage}>
            <Text style={{ color: "#888" }}>Upload</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>
        {user && user.username}
      </Text>
      <Text style={{ color: "#888", fontSize: 16 }}>
        Available Balance : {user && user.balance} KWD
      </Text>
    </View>
  );
};

export default MyProfile;
