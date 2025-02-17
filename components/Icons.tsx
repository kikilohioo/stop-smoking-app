import AntDesign from "@expo/vector-icons/AntDesign";
import Svg, { ClipPath, Defs, Ellipse, G, Path, SvgProps } from "react-native-svg";

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

export const CigarIcon = (props : SvgProps) => {
  return (
    <Svg
      width={800}
      height={800}
      viewBox="0 0 70.691 70.691"
      {...props}
    >
      <Path d="M68.25 40.624H1.5a1.5 1.5 0 0 0-1.5 1.5v11.162a1.5 1.5 0 0 0 1.5 1.5h66.75a1.5 1.5 0 0 0 1.5-1.5V42.124a1.5 1.5 0 0 0-1.5-1.5zm-47.5 3H61.5v8.162H20.75v-8.162zm46 8.162H64.5v-8.162h2.25v8.162zm-3.112-26.974c-1.121-2.938-.26-6.446 2.096-8.53a1.499 1.499 0 1 1 1.988 2.246c-1.417 1.254-1.956 3.447-1.281 5.215.349.914.993 1.76 1.677 2.655.76.997 1.546 2.028 2.054 3.299 1.327 3.331.031 7.499-2.952 9.487a1.497 1.497 0 0 1-2.08-.416 1.5 1.5 0 0 1 .416-2.08c1.817-1.212 2.639-3.85 1.829-5.88-.354-.89-.985-1.716-1.652-2.591-.784-1.025-1.592-2.086-2.095-3.405z" />
    </Svg>
  );
};

export const MordidaIcon = (props : SvgProps) => {
  return (
    <Svg
      width={34}
      height={34}
      viewBox="0 0 208.37 93.305"
      {...props}
    >
      <Defs>
        <ClipPath id="a">
          <Path
            d="M208.55 171.072H-.123s33.122 1.472 52.996-30.546c19.874-32.019 4.048-62.933 4.048-62.933"
          />
        </ClipPath>
      </Defs>
      <Path
        d="M56.786 77.778s42.446 93.47 152.312 93.47H.18Z"
        clipPath="url(#a)"
        transform="translate(-.18 -77.778)"
      />
    </Svg>
  );
};

export const RightShortRow = (props: IconProp) => {
  return <AntDesign name="rightcircleo" size={24} color="black" {...props} />;
}

export const RightRow = (props: IconProp) => {
  return <AntDesign name="arrowright" size={24} color="black" {...props} />;
}

export const PersonIcon = (props: IconProp) => {
  return <AntDesign name="user" size={24} color="black" {...props} />;
}

export const LocationIcon = (props: IconProp) => {
  return <AntDesign name="enviromento" size={24} color="black" {...props} />;
}
