// Export your common types here
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
