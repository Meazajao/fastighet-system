export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  
  export function formatTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  export function formatDateTime(date: Date | string): string {
    return `${formatDate(date)} ${formatTime(date)}`;
  }
  
  export function getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  
  export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  }
  
  export function categoryLabel(category: string): string {
    const labels: Record<string, string> = {
      VVS: "VVS",
      EL: "El",
      VENTILATION: "Ventilation",
      HISS: "Hiss",
      LAUNDRY: "Tvättstuga",
      EXTERIOR: "Yttre miljö",
      OTHER: "Övrigt",
    };
    return labels[category] || category;
  }
  
  export function priorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      LOW: "Låg",
      MEDIUM: "Normal",
      HIGH: "Hög",
      URGENT: "Akut",
    };
    return labels[priority] || priority;
  }
  
  export function statusLabel(status: string): string {
    const labels: Record<string, string> = {
      OPEN: "Öppen",
      IN_PROGRESS: "Pågående",
      RESOLVED: "Löst",
      CLOSED: "Stängd",
    };
    return labels[status] || status;
  }
  
  export const statusConfig: Record<string, { color: string; bg: string; border: string }> = {
    OPEN: { color: "#0ea5e9", bg: "#f0f9ff", border: "#0ea5e9" },
    IN_PROGRESS: { color: "#7c3aed", bg: "#f5f3ff", border: "#7c3aed" },
    RESOLVED: { color: "#16a34a", bg: "#f0fdf4", border: "#16a34a" },
    CLOSED: { color: "#94a3b8", bg: "#f1f5f9", border: "#cbd5e1" },
  };
  
  export const priorityConfig: Record<string, { color: string; bg: string }> = {
    LOW: { color: "#94a3b8", bg: "#f1f5f9" },
    MEDIUM: { color: "#0ea5e9", bg: "#f0f9ff" },
    HIGH: { color: "#f97316", bg: "#fff7ed" },
    URGENT: { color: "#dc2626", bg: "#fef2f2" },
  };