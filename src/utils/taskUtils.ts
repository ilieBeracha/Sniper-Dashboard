export type TaskDifficulty = 'easy' | 'medium' | 'hard';

export interface ParsedTask {
  description: string;
  position: string;
  distance: number;
  weapon: string;
  target_type: string;
  scoring: string;
  constraints: string;
  justification: string;
  difficulty: TaskDifficulty;
  endTime: Date;
}

export const calculateTaskDifficulty = (task: any): TaskDifficulty => {
  let difficultyScore = 0;
  
  // Distance scoring
  if (task.distance > 800) difficultyScore += 3;
  else if (task.distance > 500) difficultyScore += 2;
  else difficultyScore += 1;
  
  // Position scoring
  if (task.position === 'standing') difficultyScore += 3;
  else if (task.position === 'operational') difficultyScore += 2;
  else difficultyScore += 1;
  
  // Target type scoring
  if (task.target_type === 'moving') difficultyScore += 3;
  else if (task.target_type === 'reactive') difficultyScore += 2;
  else difficultyScore += 1;
  
  // Constraints scoring (wind, time pressure)
  if (task.constraints) {
    if (task.constraints.includes('wind_strength 3')) difficultyScore += 2;
    else if (task.constraints.includes('wind_strength 2')) difficultyScore += 1;
    
    if (task.constraints.includes('night')) difficultyScore += 2;
    if (task.constraints.includes('timer') || task.constraints.includes('seconds')) difficultyScore += 1;
  }
  
  // Scoring criteria difficulty
  if (task.scoring.includes('> 90%') || task.scoring.includes('3 seconds')) difficultyScore += 2;
  else if (task.scoring.includes('> 80%') || task.scoring.includes('5 seconds')) difficultyScore += 1;
  
  // Determine final difficulty
  if (difficultyScore >= 10) return 'hard';
  else if (difficultyScore >= 6) return 'medium';
  else return 'easy';
};

export const calculateEndTime = (difficulty: TaskDifficulty): Date => {
  const now = new Date();
  const endTime = new Date(now);
  
  switch (difficulty) {
    case 'easy':
      endTime.setDate(now.getDate() + 2); // 2 days
      break;
    case 'medium':
      endTime.setDate(now.getDate() + 5); // 5 days
      break;
    case 'hard':
      endTime.setDate(now.getDate() + 10); // 10 days
      break;
  }
  
  return endTime;
};

export const parseTasksFromAI = (aiResponse: string): ParsedTask[] => {
  try {
    const parsed = JSON.parse(aiResponse);
    
    if (!parsed.suggested_tasks || !Array.isArray(parsed.suggested_tasks)) {
      return [];
    }
    
    return parsed.suggested_tasks.map((task: any) => {
      const difficulty = calculateTaskDifficulty(task);
      const endTime = calculateEndTime(difficulty);
      
      return {
        description: task.description || '',
        position: task.position || '',
        distance: task.distance || 0,
        weapon: task.weapon || '',
        target_type: task.target_type || '',
        scoring: task.scoring || '',
        constraints: task.constraints || '',
        justification: task.justification || '',
        difficulty,
        endTime
      };
    });
  } catch (error) {
    console.error('Failed to parse AI tasks:', error);
    return [];
  }
};