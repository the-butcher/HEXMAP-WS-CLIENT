import { ThreeEvent, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as three from 'three';
import { ShapeUtils, Vector2 } from 'three';
import { PbfBoundariesLoader } from '../protobuf/PbfBoundariesLoader';
import { SpatialUtil } from '../util/SpatialUtil';
import { Reflector, ReflectorOptions } from "three/examples/jsm/objects/Reflector";
/**
 * functional react component responsible for drawing the boundary around austria
 *
 * @author h.fleischer
 * @since 11.12.2021
 */
const BoundariesComponent = () => {

  const { scene } = useThree();

  /**
   * vertical part of the boundary - standard material, so the hexagon boundary has structure
   */
  // const meshWall = useRef<three.Mesh>();
  // const geomWall = useRef<three.BufferGeometry>();

  /**
   * flat part of the boundary - basic material so it blends into page background
   * likely saves performance as well
   */
  const meshHood = useRef<three.Mesh>();
  const geomHood = useRef<three.BufferGeometry>();

  const directionDim = SpatialUtil.HEXAGON_SPACING_X * 0.5 / Math.cos(Math.PI / 6);
  const directionMultsX: number[] = [];
  const directionMultsY: number[] = [];
  for (let i = -2; i < 4; i++) {
    directionMultsX.push(Math.cos(Math.PI * i / 3) * directionDim);
    directionMultsY.push(- Math.sin(Math.PI * i / 3) * directionDim);
  }

  const boundaryMaxZ = SpatialUtil.toZ(0); // 3500
  const boundaryMinZ = SpatialUtil.toZ(-7000);

  useEffect(() => {

    console.debug('✨ building boundaries component');

    new PbfBoundariesLoader().load('./hexagons_outer.pbf').then(pbfBoundaries => {

      const hoodVertices: number[] = [];
      const hoodNormals: number[] = [];

      // const wallVertices: number[] = [];
      // const wallNormals: number[] = [];

      pbfBoundaries.getBoundaries().forEach(pbfBoundary => {

        const coords2d: Vector2[] = [];
        const normal2d: Vector2[] = [];

        const directionSums: number[] = [0, 0, 0, 0, 0, 0];
        let lastX: number;
        let lastY: number;

        pbfBoundary.getCoordinates().forEach(coordinate => {
          lastX = coordinate.getX() * SpatialUtil.SCALE_SCENE / SpatialUtil.SCALE_PRECISION + SpatialUtil.BOUNDARY_ORIGIN_X;
          lastY = SpatialUtil.BOUNDARY_ORIGIN_Y - coordinate.getY() * SpatialUtil.SCALE_SCENE / SpatialUtil.SCALE_PRECISION;
          coords2d.push(new Vector2(lastX, lastY));
          normal2d.push(new Vector2(0, 0));
        });
        const firstWallIndex = coords2d.length;

        let directionSumX: number;
        let directionSumY: number;
        pbfBoundary.getDirections().forEach(direction => {
          directionSums[direction] = directionSums[direction] + 1; // increment direction for the given angle
          directionSumX = lastX;
          directionSumY = lastY;
          for (let i = 0; i < directionSums.length; i++) {
            directionSumX += directionSums[i] * directionMultsX[i];
            directionSumY += directionSums[i] * directionMultsY[i];
          }
          coords2d.push(new Vector2(directionSumX, directionSumY));
          normal2d.push(new Vector2(directionMultsY[direction], -directionMultsX[direction]))
        });

        let triangulationResult = ShapeUtils.triangulateShape(coords2d, []);
        triangulationResult.forEach(vertices => {
          hoodVertices.push(coords2d[vertices[2]].x, boundaryMaxZ, coords2d[vertices[2]].y);
          hoodVertices.push(coords2d[vertices[1]].x, boundaryMaxZ, coords2d[vertices[1]].y);
          hoodVertices.push(coords2d[vertices[0]].x, boundaryMaxZ, coords2d[vertices[0]].y);
          hoodNormals.push(0, 1, 0);
          hoodNormals.push(0, 1, 0);
          hoodNormals.push(0, 1, 0);
        });

        for (let i = 1; i < firstWallIndex; i++) {

          // hoodVertices.push(coords2d[i - 1].x, boundaryMaxZ, coords2d[i - 1].y);
          // hoodVertices.push(coords2d[i].x, boundaryMaxZ, coords2d[i].y);
          // hoodVertices.push(coords2d[i].x, boundaryMinZ, coords2d[i].y);
          // hoodNormals.push(0, 1, 0);
          // hoodNormals.push(0, 1, 0);
          // hoodNormals.push(0, 1, 0);

          // hoodVertices.push(coords2d[i].x, boundaryMinZ, coords2d[i].y);
          // hoodVertices.push(coords2d[i - 1].x, boundaryMinZ, coords2d[i - 1].y);
          // hoodVertices.push(coords2d[i - 1].x, boundaryMaxZ, coords2d[i - 1].y);
          // hoodNormals.push(0, 1, 0);
          // hoodNormals.push(0, 1, 0);
          // hoodNormals.push(0, 1, 0);

        }
        for (let i = firstWallIndex + 2; i <= coords2d.length; i++) {

          const idxM1 = (i - 1) % coords2d.length;
          const idxM0 = (i) % coords2d.length;

          hoodVertices.push(coords2d[idxM1].x, boundaryMaxZ, coords2d[idxM1].y);
          hoodVertices.push(coords2d[idxM0].x, boundaryMaxZ, coords2d[idxM0].y);
          hoodVertices.push(coords2d[idxM0].x, boundaryMinZ, coords2d[idxM0].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);

          hoodVertices.push(coords2d[idxM0].x, boundaryMinZ, coords2d[idxM0].y);
          hoodVertices.push(coords2d[idxM1].x, boundaryMinZ, coords2d[idxM1].y);
          hoodVertices.push(coords2d[idxM1].x, boundaryMaxZ, coords2d[idxM1].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);
          hoodNormals.push(normal2d[idxM0].x, 0, normal2d[idxM0].y);

        }

      });

      const hoodVertices32 = new Float32Array(hoodVertices);
      const hoodNormals32 = new Float32Array(hoodNormals);
      // const wallVertices32 = new Float32Array(wallVertices);
      // const wallNormals32 = new Float32Array(wallNormals);

      if (geomHood.current) {

        geomHood.current.setAttribute('position', new three.BufferAttribute(hoodVertices32, 3));
        geomHood.current.setAttribute('normal', new three.BufferAttribute(hoodNormals32, 3));

      }

    });

  }, []);

  /**
   * stop propagation of events to prevent object selection when the ray intersects the boundary geometry
   * @param e
   */
  let handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
  }

  return (
    <mesh ref={meshHood} frustumCulled={false} castShadow receiveShadow onPointerUp={handlePointerUp}>
      <bufferGeometry ref={geomHood} />
      <meshStandardMaterial color={[0.02, 0.02, 0.015]} wireframe={false} />
    </mesh>
  );

};

export default () => {
  return (
    <BoundariesComponent />
  );
};