import { IHexagon } from "../components/IHexagon";
import { IHexagonBorders } from "../components/IHexagonBorders";
import { IHexagonsProps } from "../components/IHexagonsProps";
import { PbfHexagonsLoader } from "../protobuf/PbfHexagonsLoader";
import { PbfHexagons } from "../protobuf/types/PbfHexagons";
import { SpatialUtil } from "../util/SpatialUtil";

export class HexagonRepository {

    static readonly VALUE_INDEX__XY = 0;
    static readonly VALUE_TYPE____Z = 0;
    static readonly VALUE_TYPE____L = 1;
    static readonly VALUE_TYPE____G = 2;

    static getInstance(): HexagonRepository {
        if (!this.instance) {
            this.instance = new HexagonRepository();
        }
        return this.instance;
    }

    private static instance: HexagonRepository;

    private hexagons: IHexagon[];

    constructor() {
        this.hexagons = [];
    }

    getHexagons(): IHexagon[] {
        return this.hexagons;
    }

    getHexagon(i: number): IHexagon {
        return this.hexagons[i];
    }

    hasPath(path: string, hexagonBorder?: IHexagonBorders) {
        return hexagonBorder ? hexagonBorder.path === path : false;
    }

    async update(pbfHexagons: PbfHexagons): Promise<void> {

        const valueTypes: number[] = pbfHexagons.getValueTypes();

        const updateHexagons = this.parse(pbfHexagons);
        let hexagonIndex = 0;
        if (valueTypes) {

        }
        updateHexagons.forEach(updateHexagon => {
            for (; hexagonIndex <= this.hexagons.length; hexagonIndex++) {
                if (this.hexagons[hexagonIndex].id === updateHexagon.id) {
                    for (let valueIndex = 0; valueIndex < valueTypes.length; valueIndex++) {
                        if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____Z) {
                            this.hexagons[hexagonIndex].y = updateHexagon.y;
                        } else if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____L) {
                            this.hexagons[hexagonIndex].luc = updateHexagon.luc;
                        } else if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____G) {
                            this.hexagons[hexagonIndex].gkz = updateHexagon.gkz;
                        }
                    }
                    break;
                }
            }
        });

    }

    async load(): Promise<void> {
        const pbfHexagons = await new PbfHexagonsLoader().fromUrl('./hexagons_inner.pbf');
        this.hexagons = this.parse(pbfHexagons);
    }

    parse(pbfHexagons: PbfHexagons): IHexagon[] {

        let hexagon: IHexagon;

        let values: number[];
        let valueXY: number;
        let valueX: number;
        let valueY: number;
        let valueZ = - SpatialUtil.HEXAGON_OFFSET_Y - 0.05;
        let valueL = 999; // NODATA
        let valueG = '#####';
        let yOffset: number;
        let counter = 0;

        const hexagonArray: IHexagon[] = [];

        const valueTypes: number[] = pbfHexagons.getValueTypes();
        console.log('valueTypes', valueTypes);

        pbfHexagons.getHexagons().forEach(pbfHexagon => {

            // color = ColorUtil.getCorineColor(values[valueIndexCode]);
            values = pbfHexagon.getValues();
            valueXY = values[HexagonRepository.VALUE_INDEX__XY];
            valueY = valueXY >> 12 & 0xFFF; // convention
            valueX = valueXY & 0xFFF; // convention
            if (valueTypes) {
                for (let valueIndex = 0; valueIndex < valueTypes.length; valueIndex++) {
                    if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____Z) {
                        valueZ = SpatialUtil.toZ(values[valueIndex + 1] / SpatialUtil.SCALE_PRECISION) - SpatialUtil.HEXAGON_OFFSET_Y - 4
                    } else if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____L) {
                        valueL = values[valueIndex + 1];
                    } else if (valueTypes[valueIndex] === HexagonRepository.VALUE_TYPE____G) {
                        valueG = values[valueIndex + 1].toString();
                    }
                }
            }

            yOffset = valueX % 2 === 0 ? 0 : SpatialUtil.HEXAGON_SPACING_X / 2;

            /**
             * intial values
             */
            hexagon = {
                id: valueXY,
                sortkeyN: -1,
                sortkeyS: -1,
                x: valueX * SpatialUtil.HEXAGON_SPACING_Y + SpatialUtil.HEXAGON_ORIGIN_X,
                y: 0,
                z: valueY * SpatialUtil.HEXAGON_SPACING_X - yOffset - SpatialUtil.HEXAGON_ORIGIN_Y,
                r: 0,
                g: 0,
                b: 0,
                col: valueX,
                row: valueY,
                gkz: valueG, // values[HexagonRepository.VALUE_INDEX_GKZ] >= 0 ? values[HexagonRepository.VALUE_INDEX_GKZ].toString() : undefined,
                luc: valueL, // values[HexagonRepository.VALUE_INDEX_LUC],
                ele: valueZ
            };
            hexagonArray.push(hexagon);
            hexagon.y = hexagon.ele; // props.renderer.getHeight(hexagonValue);

        });

        hexagonArray.sort((a, b) => b.z - a.z);
        counter = 0;
        hexagonArray.forEach(hexagonValue => {
            hexagonValue.sortkeyN = counter++;
        });

        return hexagonArray;

    }

}