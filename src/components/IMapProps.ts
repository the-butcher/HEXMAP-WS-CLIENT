import { IControlsProps } from "./IControlsProps";
import { IHexagonsProps } from "./IHexagonsProps";
import { ILightProps } from "./ILightProps";

/**
 * definition of properties for the MapComponent
 *
 * @author h.fleischer
 * @since 11.12.2021
 */
export interface IMapProps {

    lightProps: ILightProps[];

    controlsProps: IControlsProps;

    hexagonProps: IHexagonsProps;

}