export interface HeadPosition {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (bottom to top)
  z: number; // Approximate depth/distance factor
}

export interface TrackerStatus {
  isReady: boolean;
  isDetecting: boolean;
  error: string | null;
}
