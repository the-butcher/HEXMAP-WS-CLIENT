import { IIndicatorProps } from "../components/IIndicatorProps";

/**
 * utility type to centralize logic used in multiple places
 *
 * @author h.fleischer
 * @since 09.01.2022
 */
export class ObjectUtil {

    /**
     * create a unique 6-digit id
     * @returns
     */
    static createId(): string {
        return Math.round(Math.random() * 100000000).toString(16).substring(0, 5);
    }

    static buildIndicatorTitle(props: IIndicatorProps): string {
        return `${props.name} nach ${props.desc}`;
    }

}