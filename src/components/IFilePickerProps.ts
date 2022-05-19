import { IRendererProps } from "./IRendererProps";

export type IndicatorPropsFold = 'closed' | 'open-horizontal' | 'open-vertical';

/**
 * configuration for a single indicator instance
 *
 * @author h.fleischer
 * @since 19.05.2022
 */
export interface IFilePickerProps {

  onHexagonUpdate: () => void;

}