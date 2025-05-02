export interface Score {
    id: string;
    assignment_session: {
        id: string;
        training_id: string;
        assignment_id: string;
        assignment: {
            assignment_name: string;
        }
    };
    time_until_first_shot: number | null;
    distance: number | null;
    target_hit: number | null;
    day_night: DayNight | null;
    created_at: string;
    shots_fired: number | null;
    hits: number | null;
    mistake: any;
    score_participants: any;
    squad_id: string;
    squad: {
        squad_name: string;
    }
    position: any;
}

export type DayNight = 'day' | 'night';
