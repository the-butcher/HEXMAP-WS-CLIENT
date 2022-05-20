import { Stats } from "@react-three/drei";
import { Canvas, RootState } from "@react-three/fiber";
import { PCFSoftShadowMap } from "three";
import BoundariesComponent from "./BoundariesComponent";
import ControlsComponent from "./ControlsComponent";
import HexagonsComponent from "./HexagonsComponent";
import { IMapProps } from "./IMapProps";
import LightCompoment from "./LightCompoment";

/**
 * functional react component describing the entire map / scene
 *
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: IMapProps) => {

    const { lightProps, hexagonProps, controlsProps } = props;

    // const planegeomref = useRef<PlaneGeometry>(new PlaneGeometry(400, 500));

    function onCreated(state: RootState): void {
        state.gl.setClearColor("#42423a");
    }

    return (
        <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
            <Canvas frameloop='demand' shadows={{ type: PCFSoftShadowMap, enabled: true }} onCreated={onCreated} camera={{ position: [0, 300, 0], fov: 40, far: 10000 }}>
                {/* <fog attach="fog" args={["#42423a", 1000, 1500]} /> */}
                <ControlsComponent key={controlsProps.id} {...controlsProps} />
                {/* demand | always */}
                {/* <Stats /> */}
                {lightProps.map(props => <LightCompoment key={props.id} {...props} />)}
                <ambientLight intensity={0.07} />
                {/* <gridHelper args={[1000, 10, '#ff0000', '#666666']} /> */}
                <group name={'root'}>
                    <BoundariesComponent />
                    <HexagonsComponent {...hexagonProps} />

                    {/* {[0, -0.1, -0.2, -0.3, -0.4, -0.5, -0.6, -0.7, -0.8, -0.9, -1.0].map(v => <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, v, 0]} receiveShadow>
                        <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
                        <meshStandardMaterial color={[0.02, 0.02, 0.015]} wireframe={false} transparent opacity={0.25} />
                    </mesh>)} */}
                </group>
            </Canvas>
        </div>
    );

}