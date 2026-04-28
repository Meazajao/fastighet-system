function getInitials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }
  
  interface AvatarProps {
    name: string;
    size?: "sm" | "md" | "lg";
  }
  
  export default function Avatar({ name, size = "md" }: AvatarProps) {
    const sizes = {
      sm: "w-[22px] h-[22px] text-[9px]",
      md: "w-[32px] h-[32px] text-[11px]",
      lg: "w-[40px] h-[40px] text-[14px]",
    };
  
    return (
      <div className={`${sizes[size]} bg-accent-light border border-accent-border rounded-full flex items-center justify-center shrink-0`}>
        <span className="font-medium text-accent">
          {getInitials(name)}
        </span>
      </div>
    );
  }