export const statusBadgeStyle = (status: string): React.CSSProperties => {
    const map: Record<string, { color: string; background: string }> = {
      OPEN: { color: "#005b99", background: "#f0f6fc" },
      IN_PROGRESS: { color: "#5b21b6", background: "#f5f3ff" },
      RESOLVED: { color: "#0f6e56", background: "#e1f5ee" },
      CLOSED: { color: "#6b7a8d", background: "#f4f5f7" },
    };
    const s = map[status] || map.CLOSED;
    return {
      fontSize: "10px",
      fontWeight: 500,
      padding: "2px 8px",
      whiteSpace: "nowrap",
      ...s,
    };
  };
  
  export const priorityBadgeStyle = (priority: string): React.CSSProperties => {
    const map: Record<string, { color: string; background: string }> = {
      LOW: { color: "#6b7a8d", background: "#f4f5f7" },
      MEDIUM: { color: "#005b99", background: "#f0f6fc" },
      HIGH: { color: "#c8a000", background: "#fefce8" },
      URGENT: { color: "#a32d2d", background: "#fff0f0" },
    };
    const s = map[priority] || map.MEDIUM;
    return {
      fontSize: "10px",
      fontWeight: 500,
      padding: "2px 8px",
      whiteSpace: "nowrap",
      ...s,
    };
  };
  
  export const borderLeftColor = (status: string): string => {
    const map: Record<string, string> = {
      OPEN: "#005b99",
      IN_PROGRESS: "#5b21b6",
      RESOLVED: "#0f6e56",
      CLOSED: "#c8cdd8",
      URGENT: "#a32d2d",
    };
    return map[status] || "#c8cdd8";
  };
  
  export const statusLabel = (status: string): string => ({
    OPEN: "Öppen",
    IN_PROGRESS: "Pågående",
    RESOLVED: "Löst",
    CLOSED: "Stängd",
  }[status] || status);
  
  export const priorityLabel = (priority: string): string => ({
    LOW: "Låg",
    MEDIUM: "Normal",
    HIGH: "Hög",
    URGENT: "Akut",
  }[priority] || priority);
  
  export const categoryLabel = (category: string): string => ({
    VVS: "VVS",
    EL: "El",
    VENTILATION: "Ventilation",
    HISS: "Hiss",
    LAUNDRY: "Tvättstuga",
    EXTERIOR: "Yttre miljö",
    OTHER: "Övrigt",
  }[category] || category);