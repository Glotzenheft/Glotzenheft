/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
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
