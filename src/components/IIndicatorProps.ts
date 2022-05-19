import { IFile } from "@amcharts/amcharts5/.internal/plugins/exporting/Exporting";
import { IFilePickerProps } from "./IFilePickerProps";
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

  name: string;

  desc: string;

  /**
    * the state that the parent component passes to the indicator
    */
  fold: IndicatorPropsFold;

  /**
   * current value
   */
  label00: string;

  /**
   * callback to be triggered when an indicator wants to open horizontally
   */
  onExpand: (id: string) => void;

  filePickerProps: IFilePickerProps;

  style?: React.CSSProperties;

}