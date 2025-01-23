import AntDesign from "@expo/vector-icons/AntDesign";

type IconProp = {
  size?: number;
  color?: string;
};

export const HomeIcon = (props: IconProp) => {
  return <AntDesign name="home" size={24} color="black" {...props} />;
};

export const ListIcon = (props: IconProp) => {
  return <AntDesign name="bars" size={24} color="black" {...props} />;
};

export const ConfigIcon = (props: IconProp) => {
  return <AntDesign name="setting" size={24} color="black" {...props} />;
};
