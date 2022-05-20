import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as three from 'three';
import { ILightProps } from './ILightProps';

/**
 * functional react component managing a single directional light
 *
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: ILightProps) => {

    const pointLightSlow = useRef<three.DirectionalLight>();
    const { gl, scene } = useThree();

    const { stamp, intensity, shadowEnabled } = props;

    const configureLight = (light: three.DirectionalLight, textureFraction: number) => {

        light.position.set(props.position.x, props.position.y, props.position.z);
        light.lookAt(0, 0, 0);
        light.castShadow = true;
        light.shadow.autoUpdate = false;

        // light.shadow.camera.left = 200;
        light.shadow.camera.top = 140;
        light.shadow.camera.bottom = -120;
        light.shadow.camera.left = -260;
        light.shadow.camera.right = 260;
        light.shadow.camera.far = 1000;
        light.shadow.camera.lookAt(0, 0, 0);

        const maxTextureSize = gl.capabilities.maxTextureSize;

        light.shadow.mapSize.width = maxTextureSize / textureFraction;
        light.shadow.mapSize.height = maxTextureSize / textureFraction / 2;

    }
    useEffect(() => {

        console.debug('✨ building light component', props);

        configureLight(pointLightSlow.current!, 2);

        // const helper = new three.CameraHelper(pointLightSlow.current!.shadow.camera);
        // scene.add(helper);

    }, []);

    useEffect(() => {

        console.debug('⚙ updating light component', props);

        pointLightSlow.current!.shadow.needsUpdate = true;
        pointLightSlow.current!.intensity = intensity;


    }, [stamp]);

    return (
        <>
            <directionalLight intensity={intensity} ref={pointLightSlow} castShadow />
        </>
    );

};
