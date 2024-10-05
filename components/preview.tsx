import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  DimensionValue,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { PanGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { set } from "react-hook-form";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

const PreviewSingle = ({ after }: { after: string }) => {
  return (
    <View className="w-full  border-white border-[1px] rounded-xl overflow-hidden">
      <Image
        className="w-full aspect-square rounded-xl"
        source={{ uri: after }}
      />
    </View>
  );
};

const PreviewMultiple = ({
  before,
  after,
}: {
  before: string;
  after: string;
}) => {
  const { width } = useWindowDimensions();

  const wrapperWidth = width - 40;

  const lastPosition = useSharedValue(wrapperWidth / 2);

  const leftValue = useSharedValue(wrapperWidth / 2);

  const animatedStyle = useAnimatedStyle(() => ({
    width: leftValue.value,
  }));

  const bottomAnimatedStyle = useAnimatedStyle(() => ({
    right: ((leftValue.value / wrapperWidth) * 100 + "%") as DimensionValue,
  }));

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (leftValue.value > wrapperWidth) {
        return (leftValue.value = wrapperWidth);
      }
      if (leftValue.value < 0) {
        return (leftValue.value = 0);
      }
      leftValue.value = lastPosition.value - e.translationX;
    })
    .onEnd((e) => {
      lastPosition.value = leftValue.value;
    });

  return (
    <GestureHandlerRootView>
      <View className="w-full  border-white border-[1px] rounded-xl overflow-hidden">
        <Image
          className="w-full aspect-square rounded-xl"
          source={{ uri: before }}
        />
        <Animated.View
          style={[
            animatedStyle,
            {
              overflow: "hidden",
            },
          ]}
          className="absolute aspect-square h-full right-0 top-0"
        >
          <Image
            className="h-full aspect-square rounded-xl absolute right-0 "
            source={{ uri: after }}
          />
        </Animated.View>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[bottomAnimatedStyle]}
            className="absolute h-full  flex items-center justify-center"
          >
            <View className="rounded-full w-[64px] aspect-square border-[4px] flex-row justify-between items-center border-white absolute">
              <Entypo name="triangle-left" size={24} color={"white"} />
              <Entypo name="triangle-right" size={24} color={"white"} />
            </View>
            <View className="h-full w-[4px] bg-white"></View>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const Preview: {
  Single: ({ after }: { after: string }) => React.JSX.Element;
  Multiple: ({
    before,
    after,
  }: {
    before: string;
    after: string;
  }) => React.JSX.Element;
} = {
  Single: PreviewSingle,
  Multiple: PreviewMultiple,
};

export default Preview;
