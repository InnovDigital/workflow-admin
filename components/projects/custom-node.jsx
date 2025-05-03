"use client"

import { memo } from "react"
import { Handle, Position } from "reactflow"
import {
  AlertCircle,
  Calendar,
  Database,
  FileText,
  Mail,
  MessageSquare,
  FileSpreadsheet,
  Clock,
  Upload,
  Download,
  Search,
  Users,
  CalendarDays,
  CheckCircle,
  Webhook,
  FilePlus,
  XCircle,
} from "lucide-react"

const nodeTypeIcons = {
  input: FileText,
  sql: Database,
  "excel-read": FileSpreadsheet,
  "excel-write": FileSpreadsheet,
  "email-send": Mail,
  "email-read": Mail,
  "calendar-event": Calendar,
  "api-request": Webhook,
  "document-upload": Upload,
  "document-download": Download,
  "pdf-extract": Search,
  "user-validation": Users,
  "leave-balance": CalendarDays,
  "approval-request": CheckCircle,
  "slack-teams": MessageSquare,
  "generate-certificate": FilePlus,
  "db-insert": Database,
  "db-update": Database,
  condition: AlertCircle,
  timer: Clock,
  "error-handler": XCircle,
  placeholder: AlertCircle,
  default: FileText,
}

const nodeCategoryColors = {
  document: { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  database: { bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800" },
  communication: { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800" },
  logic: { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
  integration: { bg: "bg-rose-50 dark:bg-rose-950/30", border: "border-rose-200 dark:border-rose-800" },
  placeholder: { bg: "bg-gray-50 dark:bg-gray-900/50", border: "border-dashed border-gray-300 dark:border-gray-700" },
}

const getCategoryFromType = (type) => {
  if (["input", "document-upload", "document-download", "pdf-extract", "generate-certificate"].includes(type)) {
    return "document"
  }
  if (["sql", "db-insert", "db-update", "excel-read", "excel-write"].includes(type)) {
    return "database"
  }
  if (["email-send", "email-read", "slack-teams", "approval-request"].includes(type)) {
    return "communication"
  }
  if (["condition", "timer", "error-handler", "user-validation", "leave-balance"].includes(type)) {
    return "logic"
  }
  if (["api-request", "calendar-event"].includes(type)) {
    return "integration"
  }
  return "placeholder"
}

export const CustomNode = memo(({ data, isConnectable, selected }) => {
  const Icon = nodeTypeIcons[data.type] || nodeTypeIcons.default
  const category = data.category || getCategoryFromType(data.type)
  const colors = nodeCategoryColors[category] || nodeCategoryColors.placeholder

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-2xl border-2 ${
        selected ? "border-primary" : colors.border
      } ${colors.bg} min-w-[200px] transition-all`}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-primary" />
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex items-center justify-center bg-background mr-2">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-muted-foreground">{data.description}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-primary" />
    </div>
  )
})

CustomNode.displayName = "CustomNode"