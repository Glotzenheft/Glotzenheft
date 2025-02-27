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

export interface BarDiagram {
  labels: string[];
  dataset: BarDiagramDataset[];
}
