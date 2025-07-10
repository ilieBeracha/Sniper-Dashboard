import { Clock, Target, MapPin, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import BaseButton from "./BaseButton";

interface Task {
  description: string;
  position: string;
  distance: number;
  weapon: string;
  target_type: string;
  scoring: string;
  constraints: string;
  justification: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  endTime?: Date;
}

interface TaskCardProps {
  task: Task;
  onStart?: () => void;
  onComplete?: () => void;
  status?: 'pending' | 'in_progress' | 'completed';
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'from-green-500/20 to-green-600/20 border-green-500/30';
    case 'medium': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    case 'hard': return 'from-red-500/20 to-red-600/20 border-red-500/30';
    default: return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
  }
};

const getDifficultyTextColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'hard': return 'text-red-400';
    default: return 'text-blue-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'in_progress': return <Zap className="w-4 h-4 text-yellow-400" />;
    default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
  }
};

const formatEndTime = (endTime?: Date) => {
  if (!endTime) return "No deadline";
  
  const now = new Date();
  const diffMs = endTime.getTime() - now.getTime();
  
  if (diffMs < 0) return "Overdue";
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} days`;
  if (diffHours > 0) return `${diffHours} hours`;
  return `${Math.floor(diffMs / (1000 * 60))} minutes`;
};

export default function TaskCard({ task, onStart, onComplete, status = 'pending' }: TaskCardProps) {
  const { theme } = useTheme();
  const difficulty = task.difficulty || 'medium';
  
  return (
    <div className={`relative group transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'hover:shadow-2xl' : 'hover:shadow-xl'}`}>
      <div className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm
        ${theme === 'dark' 
          ? 'bg-zinc-900/50 border-zinc-700/50' 
          : 'bg-white/50 border-gray-200/50'
        }
      `}>
        {/* Status indicator */}
        <div className={`
          absolute top-0 left-0 right-0 h-1 bg-gradient-to-r
          ${getDifficultyColor(difficulty)}
        `} />
        
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(status)}
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Training Task
              </h3>
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide
                ${getDifficultyColor(difficulty)} ${getDifficultyTextColor(difficulty)}
              `}>
                {difficulty}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatEndTime(task.endTime)}</span>
            </div>
          </div>
          
          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {task.description}
          </p>
        </div>
        
        {/* Details Grid */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Position</span>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {task.position}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-red-400" />
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Distance</span>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {task.distance}m
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Weapon</span>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {task.weapon}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-green-400" />
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Target</span>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {task.target_type}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scoring Section */}
        <div className="px-6 pb-4">
          <div className={`
            p-4 rounded-lg border
            ${theme === 'dark' 
              ? 'bg-zinc-800/50 border-zinc-700/50' 
              : 'bg-gray-50/50 border-gray-200/50'
            }
          `}>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Scoring Criteria</span>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {task.scoring}
            </p>
          </div>
        </div>
        
        {/* Constraints */}
        {task.constraints && (
          <div className="px-6 pb-4">
            <div className={`
              p-3 rounded-lg border-l-4 border-orange-500/50
              ${theme === 'dark' 
                ? 'bg-orange-500/10 border-orange-500/20' 
                : 'bg-orange-50/50 border-orange-200/50'
              }
            `}>
              <span className="text-xs text-orange-400 uppercase tracking-wide font-medium">Constraints</span>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-600'}`}>
                {task.constraints}
              </p>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="px-6 pb-6 pt-2">
          <div className="flex gap-3">
            {status === 'pending' && onStart && (
              <BaseButton
                onClick={onStart}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                Start Task
              </BaseButton>
            )}
            
            {status === 'in_progress' && onComplete && (
              <BaseButton
                onClick={onComplete}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                Mark Complete
              </BaseButton>
            )}
            
            {status === 'completed' && (
              <div className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium py-2 px-4 rounded-lg text-center">
                Completed ✓
              </div>
            )}
          </div>
        </div>
        
        {/* Justification tooltip on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 z-10">
            <div className={`
              p-3 rounded-lg shadow-lg border text-sm
              ${theme === 'dark' 
                ? 'bg-zinc-800 border-zinc-700 text-gray-300' 
                : 'bg-white border-gray-200 text-gray-600'
              }
            `}>
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">AI Analysis</span>
              <p className="mt-1">{task.justification}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}