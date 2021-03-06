import { Color } from "./Color";
import { IColor } from "./IColor";

export class ColorUtil {

    static getInstance(): ColorUtil {
        if (!this.instance) {
            this.instance = new ColorUtil();
        }
        return this.instance;
    }

    private static instance: ColorUtil;

    static readonly COLOR_WATER = [122, 213, 255];
    static readonly COLORS: { [K in string]: number[] } = {
        '0': [25, 25, 22],
        '111': [168, 63, 63],
        '112': [179, 103, 103],
        '121': [179, 103, 103],
        '122': [204, 0, 0],
        '123': [230, 204, 204],
        '124': [179, 159, 159],
        '131': [175, 131, 131],
        '132': [175, 131, 131],
        '133': [175, 131, 131],
        '141': [220, 163, 163],
        '142': [220, 163, 163],
        '211': [198, 215, 115],
        '212': [255, 255, 0],
        '213': [230, 230, 0],
        '221': [112, 194, 70],
        '222': [198, 215, 115],
        '223': [230, 166, 0],
        '231': [198, 215, 115],
        '241': [255, 230, 166],
        '242': [198, 215, 115],
        '243': [198, 215, 115],
        '244': [198, 215, 115],
        '311': [56, 168, 0],
        '312': [38, 115, 0],
        '313': [56, 168, 0],
        '321': [105, 212, 51],
        '322': [173, 230, 115],
        '323': [166, 230, 77],
        '324': [56, 168, 0],
        '331': [230, 230, 230],
        '332': [130, 130, 130],
        '333': [148, 168, 138],
        '334': [0, 0, 0],
        '335': [328, 336, 351],
        '411': [198, 215, 146],
        '412': ColorUtil.COLOR_WATER,
        '421': [204, 204, 255],
        '422': [230, 230, 255],
        '423': [166, 166, 230],
        '511': ColorUtil.COLOR_WATER,
        '512': ColorUtil.COLOR_WATER,
        '521': [0, 255, 166],
        '522': [166, 255, 230],
        '523': [230, 242, 255],
        '999': [25, 25, 22]
    };

    static readonly LABELS: { [K in string]: string } = {
        '111': 'Continuous urban fabric',
        '112': 'Discontinuous urban fabric',
        '121': 'Industrial or commercial units',
        '122': 'Road and rail networks and associated land',
        '123': 'Port areas',
        '124': 'Airports',
        '131': 'Mineral extraction sites',
        '132': 'Dump sites',
        '133': 'Construction sites',
        '141': 'Green urban areas',
        '142': 'Sport and leisure facilities',
        '211': 'Non-irrigated arable land',
        '212': 'Permanently irrigated land',
        '213': 'Rice fields',
        '221': 'Vineyards',
        '222': 'Fruit trees and berry plantations',
        '223': 'Olive groves',
        '231': 'Pastures',
        '241': 'Annual crops associated with permanent crops',
        '242': 'Complex cultivation patterns',
        '243': 'Land principally occupied by agriculture with significant areas of natural vegetation',
        '244': 'Agro-forestry areas',
        '311': 'Broad-leaved forest',
        '312': 'Coniferous forest',
        '313': 'Mixed forest',
        '321': 'Natural grasslands',
        '322': 'Moors and heathland',
        '323': 'Sclerophyllous vegetation',
        '324': 'Transitional woodland-shrub',
        '331': 'Beaches - dunes - sands',
        '332': 'Bare rocks',
        '333': 'Sparsely vegetated areas',
        '334': 'Burnt areas',
        '335': 'Glaciers and perpetual snow',
        '411': 'Inland marshes',
        '412': 'Peat bogs',
        '421': 'Salt marshes',
        '422': 'Salines',
        '423': 'Intertidal flats',
        '511': 'Water courses',
        '512': 'Water bodies',
        '521': 'Coastal lagoons',
        '522': 'Estuaries',
        '523': 'Sea and ocean',
        '999': 'NODATA'
    }

    getCorineColor(code: number): IColor {
        if (ColorUtil.COLORS[code]) {
            const hsv = [0, 0, 0]
            this.rgbToHsv(ColorUtil.COLORS[code].map((c, i) => c / 750), hsv);
            return new Color(hsv[0], Math.min(1, hsv[1] * 1.5), hsv[2]);
        } else {
            return new Color(0, 0, 1);
        }
    }

    /**
     * parses a hex string in the format '#RRGGBB'
     * @param hex
     */
    parseHex(hex: string): IColor {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var rgb: number[] = [];
        if (result && result!.length > 3) {
            rgb[0] = parseInt(result![result!.length - 3], 16) / 255;
            rgb[1] = parseInt(result![result!.length - 2], 16) / 255;
            rgb[2] = parseInt(result![result!.length - 1], 16) / 255;
        } else {
            rgb[0] = 1;
            rgb[1] = 0;
            rgb[2] = 0;
        }
        var hsv: number[] = [0, 0, 0];
        this.rgbToHsv(rgb, hsv);
        let color: IColor = new Color(hsv[0], hsv[1], hsv[2]);
        return color;
    }

    /**
     * convert a normalized (0-1) hsv (hue-saturation-value) color to a normalized (0-1) rgb (red-green-bluea) color<br>
     * rather then returning a value this method stores the result in the given rgb parameter, this is to enable caller to re-use the same object and reduce allocation pressure during conversion<br>
     *
     * @param hsv the hsv "in" params
     * @param rgb the rgb "out" params
     */
    hsvToRgb(hsv: number[], rgb: number[]): void {

        if (hsv[Color.INDEX_S] == 0) {

            rgb[Color.INDEX_R] = rgb[Color.INDEX_G] = rgb[Color.INDEX_B] = hsv[Color.INDEX_V];

        } else {

            let a: number = (hsv[Color.INDEX_H] - Math.floor(hsv[Color.INDEX_H])) * 6.0;
            let f: number = a - Math.floor(a);
            let p: number = hsv[Color.INDEX_V] * (1.0 - hsv[Color.INDEX_S]);
            let q: number = hsv[Color.INDEX_V] * (1.0 - hsv[Color.INDEX_S] * f);
            let t: number = hsv[Color.INDEX_V] * (1.0 - hsv[Color.INDEX_S] * (1.0 - f));

            switch (Math.floor(a)) {
                case 0:
                    rgb[Color.INDEX_R] = hsv[Color.INDEX_V];
                    rgb[Color.INDEX_G] = t;
                    rgb[Color.INDEX_B] = p;
                    break;
                case 1:
                    rgb[Color.INDEX_R] = q;
                    rgb[Color.INDEX_G] = hsv[Color.INDEX_V];
                    rgb[Color.INDEX_B] = p;
                    break;
                case 2:
                    rgb[Color.INDEX_R] = p;
                    rgb[Color.INDEX_G] = hsv[Color.INDEX_V];
                    rgb[Color.INDEX_B] = t;
                    break;
                case 3:
                    rgb[Color.INDEX_R] = p;
                    rgb[Color.INDEX_G] = q;
                    rgb[Color.INDEX_B] = hsv[Color.INDEX_V];
                    break;
                case 4:
                    rgb[Color.INDEX_R] = t;
                    rgb[Color.INDEX_G] = p;
                    rgb[Color.INDEX_B] = hsv[Color.INDEX_V];
                    break;
                case 5:
                    rgb[Color.INDEX_R] = hsv[Color.INDEX_V];
                    rgb[Color.INDEX_G] = p;
                    rgb[Color.INDEX_B] = q;
                    break;
            }

        }

    }

    rgbToHsv(rgb: number[], hsv: number[]): void {

        let r_replace: number = rgb[Color.INDEX_R];
        let g_replace: number = rgb[Color.INDEX_G];
        let b_replace: number = rgb[Color.INDEX_B];

        let h: number;
        let s: number;
        let v: number;

        let cmax: number = r_replace > g_replace ? r_replace : g_replace;
        if (b_replace > cmax) {
            cmax = b_replace;
        }

        let cmin: number = r_replace < g_replace ? r_replace : g_replace;
        if (b_replace < cmin) {
            cmin = b_replace;
        }

        v = cmax;
        if (cmax != 0) {
            s = (cmax - cmin) / cmax;
        } else {
            s = 0;
        }

        if (s == 0) {
            h = 0;
        } else {

            let rc: number = (cmax - r_replace) / (cmax - cmin);
            let gc: number = (cmax - g_replace) / (cmax - cmin);
            let bc: number = (cmax - b_replace) / (cmax - cmin);

            if (r_replace == cmax) {
                h = bc - gc;
            } else if (g_replace == cmax) {
                h = 2.0 + rc - bc;
            } else {
                h = 4.0 + gc - rc;
            }

            h = h / 6.0;
            if (h < 0) {
                h = h + 1.0;
            }

        }

        hsv[0] = h;
        hsv[1] = s;
        hsv[2] = v;

    }

}