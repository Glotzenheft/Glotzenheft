// interfaces for line diagram chart

export interface LineDiagramDataset {
  label: string;
  data: number[];
  fill: boolean;
  borderColor: string;
  tension: number;
  hoverBackgroundColor: string;
  backgroundColor: string;
}

/**
 * Interface for the data structure for a line chart diagram.
 */
export interface LineDiagram {
  labels: string[];
  datasets: LineDiagramDataset[];
}

// interfaces for bar chart diagram ---------------------------------------
export interface BarDiagramDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  fill: boolean;
  borderColor: string;
  tension: number;
}

/**
 * Interface for the data structure for a bar chart diagram.
 */
export interface BarDiagram {
  labels: string[];
  datasets: BarDiagramDataset[];
}
