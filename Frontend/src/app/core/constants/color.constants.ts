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

export const RATING_COLORS_PQ: Record<string, string> = {
    '10': '#0D6AC2',
    '9': '#5861A3',
    '8': '#665191',
    '7': '#A05195',
    '6': '#D45087',
    '5': '#F95D6A',
    '4': '#FF7C43',
    '3': '#FFA600',
    '2': '#06B6D4',
    '1': '#14B8A6',
    'Keine': '#94A3B8'
};

export const RATING_COLORS: Record<string, string> = {
    '10': '#ff0000',
    '9': '#0000ff',
    '8': '#00ff00',
    '7': '#ffff00',
    '6': '#9c9c00',
    '5': '#009c00',
    '4': '#00009c',
    '3': '#9c0000',
    '2': '#32323c',
    '1': '#000000',
    'Keine': '#FFFFFF80'
};

export const STATUS_COLORS: Record<string, string> = {
    'Am glotzen': '#2db039',
    'Abgeschlossen': '#26448f',
    'Abgebrochen': '#a12f31',
    'Pausiert': '#e7b715',
    'Geplant': '#8f8f8f',
    'Übersprungen': '#8B5CF6',
};

export const FALLBACK_COLOR = '#000000';

/**
 * Hilfsfunktion, um eine Hex-Farbe für den Hover-Effekt aufzuhellen.
 */
export function getHoverColor(hex: string, lightenPercent: number = 20): string {
    if (!hex || hex === 'transparent' || !hex.startsWith('#')) return hex;

    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.min(255, Math.floor(r + (255 - r) * (lightenPercent / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (lightenPercent / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (lightenPercent / 100)));

    const toHex = (n: number) => n.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
