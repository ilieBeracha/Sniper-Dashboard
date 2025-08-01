import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface NodeConfigPanelProps {
  nodeId: string;
  nodeType: string;
  nodeData: any;
  onUpdate: (nodeId: string, data: any) => void;
}

export default function NodeConfigPanel({ nodeId, nodeType, nodeData, onUpdate }: NodeConfigPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [formData, setFormData] = useState(nodeData);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(nodeId, updated);
  };

  return (
    <div className="space-y-6">
      {/* Node Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Configure {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          nodeType === 'trigger' 
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
            : nodeType === 'condition'
            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
            : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
        }`}>
          {nodeId}
        </div>
      </div>

      {/* Trigger Configuration */}
      {nodeType === 'trigger' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trigger Type
            </label>
            <select
              value={formData.triggerType || 'event'}
              onChange={(e) => handleChange('triggerType', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-800 border-gray-700 text-gray-100" 
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="score_update">Score Update</option>
              <option value="training_complete">Training Complete</option>
              <option value="schedule">Scheduled</option>
              <option value="manual">Manual Trigger</option>
              <option value="webhook">Webhook</option>
              <option value="data_change">Data Change</option>
            </select>
          </div>

          {formData.triggerType === 'schedule' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule
              </label>
              <select
                value={formData.schedule || 'daily'}
                onChange={(e) => handleChange('schedule', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? "bg-gray-800 border-gray-700 text-gray-100" 
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom Cron</option>
              </select>
            </div>
          )}

          {formData.triggerType === 'score_update' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Score Type
              </label>
              <select
                value={formData.scoreType || 'accuracy'}
                onChange={(e) => handleChange('scoreType', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? "bg-gray-800 border-gray-700 text-gray-100" 
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="accuracy">Accuracy</option>
                <option value="speed">Speed</option>
                <option value="consistency">Consistency</option>
                <option value="overall">Overall Score</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-800 border-gray-700 text-gray-100" 
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Brief description of when this triggers"
            />
          </div>
        </div>
      )}

      {/* Condition Configuration */}
      {nodeType === 'condition' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Field to Check
            </label>
            <select
              value={formData.field || ''}
              onChange={(e) => handleChange('field', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-800 border-gray-700 text-gray-100" 
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Field</option>
              <option value="score">Score</option>
              <option value="accuracy">Accuracy</option>
              <option value="time_elapsed">Time Elapsed</option>
              <option value="user_role">User Role</option>
              <option value="team_size">Team Size</option>
              <option value="custom">Custom Field</option>
            </select>
          </div>

          {formData.field === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Field Path
              </label>
              <input
                type="text"
                value={formData.customField || ''}
                onChange={(e) => handleChange('customField', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? "bg-gray-800 border-gray-700 text-gray-100" 
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="e.g., data.metrics.custom_value"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Operator
            </label>
            <select
              value={formData.operator || 'equals'}
              onChange={(e) => handleChange('operator', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-800 border-gray-700 text-gray-100" 
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="equals">Equals (=)</option>
              <option value="not_equals">Not Equals (≠)</option>
              <option value="greater_than">Greater Than (&gt;)</option>
              <option value="less_than">Less Than (&lt;)</option>
              <option value="greater_equal">Greater or Equal (≥)</option>
              <option value="less_equal">Less or Equal (≤)</option>
              <option value="contains">Contains</option>
              <option value="not_contains">Does Not Contain</option>
              <option value="starts_with">Starts With</option>
              <option value="ends_with">Ends With</option>
              <option value="is_empty">Is Empty</option>
              <option value="is_not_empty">Is Not Empty</option>
            </select>
          </div>

          {!['is_empty', 'is_not_empty'].includes(formData.operator) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value
              </label>
              <input
                type="text"
                value={formData.value || ''}
                onChange={(e) => handleChange('value', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDark 
                    ? "bg-gray-800 border-gray-700 text-gray-100" 
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Comparison value"
              />
            </div>
          )}
        </div>
      )}

      {/* Action Configuration */}
      {nodeType === 'action' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Action Type
            </label>
            <select
              value={formData.actionType || 'notification'}
              onChange={(e) => handleChange('actionType', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-800 border-gray-700 text-gray-100" 
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="notification">Send Notification</option>
              <option value="email">Send Email</option>
              <option value="sms">Send SMS</option>
              <option value="webhook">Call Webhook</option>
              <option value="update_field">Update Field</option>
              <option value="create_task">Create Task</option>
              <option value="assign_badge">Assign Badge</option>
              <option value="log_event">Log Event</option>
              <option value="run_script">Run Script</option>
            </select>
          </div>

          {formData.actionType === 'notification' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notification Type
                </label>
                <select
                  value={formData.notificationType || 'info'}
                  onChange={(e) => handleChange('notificationType', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-gray-100" 
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipients
                </label>
                <select
                  value={formData.recipients || 'user'}
                  onChange={(e) => handleChange('recipients', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-gray-100" 
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="user">Triggering User</option>
                  <option value="team">Entire Team</option>
                  <option value="managers">Team Managers</option>
                  <option value="admins">Administrators</option>
                  <option value="custom">Custom Recipients</option>
                </select>
              </div>
            </>
          )}

          {formData.actionType === 'webhook' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={formData.webhookUrl || ''}
                  onChange={(e) => handleChange('webhookUrl', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-gray-100" 
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://api.example.com/webhook"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  HTTP Method
                </label>
                <select
                  value={formData.webhookMethod || 'POST'}
                  onChange={(e) => handleChange('webhookMethod', e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark 
                      ? "bg-gray-800 border-gray-700 text-gray-100" 
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message Template
            </label>
            <textarea
              value={formData.message || ''}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark 
                  ? "bg-gray-800 border-gray-700 text-gray-100" 
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Use {{field_name}} for dynamic values"
            />
          </div>
        </div>
      )}

      {/* Advanced Options */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
          Advanced Options →
        </button>
      </div>
    </div>
  );
}