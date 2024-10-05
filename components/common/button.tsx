import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import clsx from "clsx";

const Button = ({
  label,
  loading,
  ...props
}: TouchableOpacity["props"] & { label: string; loading?: boolean }) => {
  return (
    <TouchableOpacity
      {...props}
      className={clsx(
        props.className,
        "h-[56px] flex-row space-x-2 items-center justify-center bg-dark-green rounded-[12px] border-[1px] border-white"
      )}
    >
      <Text className="text-white">{label}</Text>
      {loading && <ActivityIndicator color={"white"} />}
    </TouchableOpacity>
  );
};

export default Button;
