import { IHexagon } from "./IHexagon";
import { IHexagonState } from "./IHexagonState";

// export type ViewOrientation = 'northwards' | 'southwards';

/**
 * definition of the hexagon-component properties
 *
 * @author h.fleischer
 * @since 05.02.2022
 */
export interface IHexagonsProps {

    name: string;

    stamp: string;

    // view: ViewOrientation;

    onHexagonsLoaded: () => void;

    // getState: (hexagon: IHexagon) => IHexagonState;

}