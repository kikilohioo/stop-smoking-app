import { AntDesign } from "@expo/vector-icons";

type IconProp = {
  size?: number;
  color?: string;
};

export const HomeIcon = (props: IconProp) => {
  return <AntDesign name="home" size={24} color="black" {...props} />;
};
