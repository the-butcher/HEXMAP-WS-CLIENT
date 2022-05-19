import { IFile } from "@amcharts/amcharts5/.internal/plugins/exporting/Exporting";
import { IFilePickerProps } from "./IFilePickerProps";
import { IHexagon } from "./IHexagon";
import { IRendererProps } from "./IRendererProps";

export type IndicatorPropsFold = 'closed' | 'open-horizontal' | 'open-vertical';

/**
 * configuration for a single indicator instance
 *
 * @author h.fleischer
 * @since 03.02.2022
 */
export interface IIndicatorProps {

  /**
    * unique id that should not change over time
   */
  id: string;

  hexagon?: IHexagon;

  filePickerProps: IFilePickerProps;

  style?: React.CSSProperties;

}