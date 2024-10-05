import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Input from "@/components/common/input/input";
import Button from "@/components/common/button";
import axios from "axios";
import { RestoreModelInputType } from "@/types/common";
import { set, useForm } from "react-hook-form";
import Preview from "@/components/preview";
import { useSharedValue } from "react-native-reanimated";
import clsx from "clsx";
import Dropdown from "@/components/common/dropdown";
import { Feather } from "@expo/vector-icons";

const mockImage =
  "https://cdn.discordapp.com/attachments/1284803549871472641/1292193453954044015/WhatsApp_Image_2024-10-05_at_21.35.03.jpeg?ex=6702d86f&is=670186ef&hm=b173e8749059ecef5bf193112c12d1676ac371aa6da3189db32816ef9e692742&";

const Screen = () => {
  const [resultImage, setResultImage] = useState<string | null>(null);
  const { watch, setValue } = useForm<{
    image: string;
    prompt: string;
    modelName: any;
  }>({
    defaultValues: {
      image: mockImage,
      prompt: "",
      modelName: "onlyPrompt",
    },
  });

  const aiModels: AiModelType[] = ["prompt", "prompt+restore", "restore"];

  type AiModelType = "prompt" | "prompt+restore" | "restore";

  const models: Record<AiModelType, any> = {
    prompt: {
      logo: {
        options: {
          refine: "no_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: true,
          high_noise_frac: 0.8,
          negative_prompt: "",
          prompt_strength: 0.8,
          num_inference_steps: 50,
        },
        modelName:
          "mejiabrayan/logoai:67ed00e8999fecd32035074fa0f2e9a31ee03b57a8415e6a5e2f93a242ddd8d2",
      },
      textToImage: {
        modelName:
          "prompthero/dreamshaper:6197db9cdf865a7349acaf20a7d20fe657d9c04cc0c478ec2b23565542715b95",
      },
    },
    "prompt+restore": {
      "fix+prompt": {
        modelName:
          "mv-lab/instructir:e98baeb90b5cd143a86aa2a9deeffb2852c3bebbd428f3cdf5da1b31fb99d3a3",
      },
    },
    restore: {
      fix: {
        options: {
          upscale: 2,
          face_upsample: true,
          background_enhance: true,
          codeformer_fidelity: 0.1,
        },
        modelName:
          "sczhou/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
      },
    },
  };

  const [tab, setTab] = useState<AiModelType>("prompt");

  const { image, prompt, modelName } = watch();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setResultImage(null);
    setValue("image", "");
    setValue("prompt", "");
    setLoading(false);
  }, [tab]);

  const generateImage = async () => {
    setLoading(true);
    setResultImage(null);
    if (process.env.EXPO_PUBLIC_BE_URL) {
      try {
        const data: { prompt: string; image?: string } = {
          prompt,
        };
        if (tab === "prompt+restore") {
          data["image"] = image;
        }

        console.log(models[tab]);
        const options = models[tab][modelName.split("::")[0]].options;
        const res = await axios.post(
          process.env.EXPO_PUBLIC_BE_URL + "/run-ai",
          {
            prompt,
            image,
            model: modelName.split("::")[1],
            options: options ?? {},
          }
        );
        console.log(res.data);
        if (Array.isArray(res.data)) {
          setResultImage(res.data[0] as string);
        } else {
          setResultImage(res.data as string);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 bg-back">
      <SafeAreaView className="flex-1">
        <View className=" rounded-full mx-auto flex-row space-x-3 px-2 py-1 border-dark-border border-[1px]">
          {aiModels.map((model) => (
            <TouchableOpacity
              key={model}
              onPress={() => {
                setTab(model);
              }}
              className={clsx(
                "rounded-full overflow-hidden  px-2 py-1",
                tab === model && "bg-white"
              )}
            >
              <Text
                className={clsx(
                  "whitespace-nowrap  font-bold capitalize",
                  tab !== model && "text-white"
                )}
                numberOfLines={1}
              >
                {model}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Dropdown
          Icon={() => <Feather name="chevron-down" color={"white"} size={24} />}
          style={{
            inputIOSContainer: {
              backgroundColor: "#1E1E1E",
              borderColor: "white",
              borderWidth: 1,
              margin: 20,
            },
            inputIOS: {
              textAlign: "center",
              paddingVertical: 12,
              color: "white",
            },
            iconContainer: {
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              paddingHorizontal: 12,
            },
          }}
          items={Object.entries(models[tab]).map(([key, value]) => ({
            label: key
              .split(" ")
              .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
              .join(" "),
            value: key + "::" + (value as any).modelName,
          }))}
          value={modelName}
          onValueChange={(value) => setValue("modelName", value)}
        />
        <View className="flex-1 px-[20px] pt-[20px] space-y-[24px]">
          {tab !== "prompt" && (
            <Input
              onChange={() => {
                setResultImage(null);
              }}
              value={image}
              onChangeText={(value) => setValue("image", value)}
              label="Image"
            />
          )}
          <View className="h-[16px]"></View>
          {tab !== "restore" && (
            <Input
              value={prompt}
              onChangeText={(value) => setValue("prompt", value)}
              label="Prompt"
            />
          )}
          <Button loading={loading} onPress={generateImage} label="Generate" />
          <View className="h-[32px]"></View>
          {resultImage && tab === "prompt" && (
            <Preview.Single after={resultImage} />
          )}
          {resultImage && tab !== "prompt" && (
            <Preview.Multiple before={image} after={resultImage} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Screen;
