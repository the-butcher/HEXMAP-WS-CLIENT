import { ThreeEvent, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import * as three from 'three';
import { BufferGeometry, Material } from 'three';
import { HexagonRepository } from '../data/HexagonRepository';
import { ColorUtil } from '../util/ColorUtil';
import { SpatialUtil } from '../util/SpatialUtil';
import { IHexagonsProps } from './IHexagonsProps';
import { IHexagonState } from './IHexagonState';

/**
 * functional react component responsible for drawing the hexagons
 *
 * @author h.fleischer
 * @since 11.12.2021
 */
export default (props: IHexagonsProps) => {

  const { invalidate, gl, scene, camera } = useThree();
  const { stamp, onHexagonsLoaded, onHexagonClicked } = props;

  const hexagonCount = 167934;

  const geomRef = useRef<three.BufferGeometry>(new three.BufferGeometry());
  const mtrlRef = useRef<three.MeshStandardMaterial>(new three.MeshStandardMaterial());
  const meshRef = useRef<three.InstancedMesh>(new three.InstancedMesh(geomRef.current, mtrlRef.current, hexagonCount));

  /**
   * helper objects for setting up position and color before applying to indexed instances
   */
  const tempObject = new three.Object3D();

  /**
   * helpers for updating color
   */
  const colorCurr = useMemo(() => new Float32Array(hexagonCount * 3), []);

  useEffect(() => {

    console.debug('✨ building hexagons component', props);

    if (meshRef.current && geomRef.current) {

      const vertices: number[] = [];
      const normals: number[] = [];
      const radius = 440 * SpatialUtil.SCALE_SCENE; // 440
      let radians = 0;
      let cosLast = 1;
      let sinLast = 0;
      let cosCurr: number;
      let sinCurr: number;
      for (let degrees = 60; degrees <= 360; degrees += 60) {

        radians = degrees * Math.PI / 180;
        cosCurr = Math.cos(radians);
        sinCurr = Math.sin(radians);

        // upper triangle
        vertices.push(cosCurr * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinCurr * radius);
        vertices.push(cosLast * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinLast * radius);
        vertices.push(0, SpatialUtil.HEXAGON_OFFSET_Y, 0); // center

        // 3 normals pointing upwards
        normals.push(cosCurr * radius, 1, sinCurr * radius);
        normals.push(cosLast * radius, 1, sinLast * radius);
        normals.push(0, 1, 0);


        //vertical triangle A
        vertices.push(cosCurr * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinCurr * radius);
        vertices.push(cosCurr * radius, 0, sinCurr * radius);
        vertices.push(cosLast * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinLast * radius);

        normals.push((sinLast + 0) / 1, 0, (cosLast + 0) / -1);
        normals.push((sinLast + 0) / 1, 0, (cosLast + 0) / -1);
        normals.push((0 + sinCurr) / 1, 0, (0 + cosCurr) / -1);

        //vertical triangle B
        vertices.push(cosLast * radius, SpatialUtil.HEXAGON_OFFSET_Y, sinLast * radius);
        vertices.push(cosCurr * radius, 0, sinCurr * radius);
        vertices.push(cosLast * radius, 0, sinLast * radius);

        normals.push((0 + sinCurr) / 1, 0, (0 + cosCurr) / -1);
        normals.push((sinLast + 0) / 1, 0, (cosLast + 0) / -1);
        normals.push((0 + sinCurr) / 1, 0, (0 + cosCurr) / -1);

        cosLast = cosCurr;
        sinLast = sinCurr;

      }
      const vertices32 = new Float32Array(vertices);
      const normals32 = new Float32Array(normals);

      geomRef.current.setAttribute('position', new three.BufferAttribute(vertices32, 3));
      geomRef.current.setAttribute('normal', new three.BufferAttribute(normals32, 3));

      HexagonRepository.getInstance().load().then(() => {
        onHexagonsLoaded();
      });

    }

  }, []);

  useEffect(() => {

    console.debug('⚙ updating hexagons component (stamp)', props);
    const tsA = Date.now();

    let colrkey = 0;
    let rgb: number[];
    // let state: IHexagonState;

    /**
     * reposition each hexagon as if property callbacks for height and color
     */
    let counter = 0;
    HexagonRepository.getInstance().getHexagons().forEach(hexagon => {

      // state = props.getState(hexagon);
      rgb = ColorUtil.getInstance().getCorineColor(hexagon.luc).getRgb();
      colrkey = counter * 3;

      tempObject.position.set(hexagon.x, hexagon.y, hexagon.z);  // hexagonValue.y - SpatialUtil.HEXAGON_SEMIHEIGHT
      tempObject.updateMatrix();

      meshRef.current.setMatrixAt(counter, tempObject.matrix);

      colorCurr[colrkey + 0] = rgb[0];
      colorCurr[colrkey + 1] = rgb[1];
      colorCurr[colrkey + 2] = rgb[2];

      counter++;

    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.geometry.attributes.color.needsUpdate = true;

    console.debug('🕓 updating hexagons component (stamp, done)', Date.now() - tsA);

    invalidate();

  }, [stamp]);

  let handleClick = (e: ThreeEvent<PointerEvent>) => { //

    e.stopPropagation();
    if (e.instanceId && e.delta < 5) {
      const hexagonValue = HexagonRepository.getInstance().getHexagon(e.instanceId);
      onHexagonClicked(hexagonValue);
    }

  }

  return (
    <instancedMesh ref={meshRef} args={[null as unknown as BufferGeometry, null as unknown as Material, hexagonCount]} castShadow receiveShadow onClick={handleClick}>
      <bufferGeometry ref={geomRef}>
        <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorCurr, 3]}></instancedBufferAttribute>
      </bufferGeometry>
      <meshStandardMaterial ref={mtrlRef} vertexColors={true} color={[0.5, 0.5, 0.5]} />
    </instancedMesh>
  );

};
