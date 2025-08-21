/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
