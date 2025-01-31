import AntDesign from "@expo/vector-icons/AntDesign";

type IconProp = {
  size?: number
  color?: string
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

export const SocialIcon = (props: IconProp) => {
  return <AntDesign name="team" size={24} color="green" {...props} />;
};

export const EmotionalIcon = (props: IconProp) => {
  return <AntDesign name="hearto" size={24} color="blue" {...props} />;
};

export const ConductualIcon = (props: IconProp) => {
  return <AntDesign name="meh" size={24} color="orange" {...props} />;
};

export const PhysiologicalIcon = (props: IconProp) => {
  return <AntDesign name="medicinebox" size={24} color="red" {...props} />;
};
