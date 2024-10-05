import { View, Text } from "react-native";
import React from "react";
import RNPickerSelect from "react-native-picker-select";

const Dropdown = ({ ...props }: RNPickerSelect["props"]) => {
  return <RNPickerSelect {...props} />;
};

export default Dropdown;
