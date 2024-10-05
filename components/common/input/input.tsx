import { View, Text, TextInput } from "react-native";
import React from "react";

const Input = ({ label, ...props }: TextInput["props"] & { label: string }) => {
  return (
    <View className="space-y-[12px]">
      <Text className="text-white">{label}</Text>
      <TextInput
        className="text-white px-4 h-[56px] bg-transparent border-dark-border border-[1px] rounded-[12px]"
        {...props}
      />
    </View>
  );
};

export default Input;
