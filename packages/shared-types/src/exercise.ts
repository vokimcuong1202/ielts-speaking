export interface Exercise {
  id: string;
  title: string;
  prompt: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: string;
}
