import { getInitials } from "@/lib/utils";
import { theme } from "@/lib/theme";

interface AvatarProps {
  name: string;
  size?: number;
  fontSize?: number;
}

export default function Avatar({ name, size = 32, fontSize = 11 }: AvatarProps) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: theme.colors.accentLight,
        border: `1px solid ${theme.colors.accentBorder}`,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: 600,
          color: theme.colors.accent,
        }}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}