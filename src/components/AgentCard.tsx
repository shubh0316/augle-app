"use client";

type AgentStatus = "waiting" | "streaming" | "completed" | "active";

interface AgentCardProps {
  name: string;
  initial: string;
  task: string;
  model: string;
  status: AgentStatus;
  accentColor?: string;
}

const statusColors: Record<AgentStatus, string> = {
  waiting: "#524c48",
  streaming: "#c15f3c",
  completed: "#22a86f",
  active: "#d97858",
};

export default function AgentCard({ name, initial, task, model, status, accentColor }: AgentCardProps) {
  const isActive = status === "active" || status === "streaming";
  const isCompleted = status === "completed";
  const borderColor = isCompleted ? "#22a86f" : isActive ? "#c15f3c" : "#524c48";
  const bgColor = isCompleted ? "rgba(34,168,111,0.11)" : isActive ? "#33251e" : "#2e2b28";

  return (
    <div
      className="rounded-lg p-3 min-w-[153px] h-[97px] flex flex-col justify-between relative"
      style={{ backgroundColor: bgColor, border: `0.5px solid ${borderColor}` }}
    >
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-medium"
          style={{ backgroundColor: isCompleted ? "#22a86f" : isActive ? "#c15f3c" : "#524c48", color: isCompleted || isActive ? "white" : "#524c48" }}>
          {initial}
        </div>
        <span className={`text-sm font-medium ${isCompleted ? "text-success" : isActive ? "text-accent" : "text-text-disabled"}`}>{name}</span>
      </div>
      <div>
        <p className={`text-[11px] font-medium ${isCompleted || isActive ? "text-[#e8e2db]" : "text-text-disabled"}`}>{task}</p>
        <p className={`text-[11px] font-medium mt-0.5 ${isCompleted || isActive ? "text-[#e8e2db]" : "text-text-disabled"}`}>{model}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${status === "streaming" ? "animate-pulse-dot" : ""}`}
            style={{ backgroundColor: statusColors[status] }} />
          <span className={`text-[11px] font-medium ${isCompleted ? "text-success" : isActive ? "text-accent-hover" : "text-text-disabled"}`}>{status}</span>
        </div>
      </div>
    </div>
  );
}
