export interface SidebarProgress {
  completed: number;
  total: number;
}

export interface CurrentUser {
  name: string;
  sidebarProgress: SidebarProgress;
}
