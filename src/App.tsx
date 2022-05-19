import { library } from '@fortawesome/fontawesome-svg-core'; //allows later to just use icon name to render-them
import { faCheckSquare, faCoffee, fas } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { IHexagon } from './components/IHexagon';
import { IHexagonsProps } from './components/IHexagonsProps';
import { IIndicatorProps } from './components/IIndicatorProps';
import { IMapProps } from './components/IMapProps';
import { IUserInterfaceProps } from './components/IUserInterfaceProps';
import MapComponent from './components/MapComponent';
import UserInterfaceComponent from './components/UserInterfaceComponent';
import { IAppState } from './IAppState';
import { ObjectUtil } from './util/ObjectUtil';

library.add(fas, faCheckSquare, faCoffee)

export default () => {

  const handleHexagonClicked = (hexagon: IHexagon) => {

    console.debug('📞 handling hexagon clicked', hexagon);

    setAppState({
      ...appState,
      action: {
        hexagon,
        stamp: ObjectUtil.createId(),
        updateScene: false,
        updateLight: false
      }
    });

  }

  const handleHexagonsLoaded = () => {

    console.debug('📞 handling hexagons loaded');

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: true,
        updateLight: true
      }
    });

  }

  const handleHexagonsUpdated = () => {

    console.debug('📞 handling hexagons updated');

    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: true,
        updateLight: true
      }
    });

  }

  const [mapProps, setMapProps] = useState<IMapProps>({
    lightProps: [
      {
        id: ObjectUtil.createId(),
        stamp: ObjectUtil.createId(),
        intensity: 1.25,
        position: {
          x: 300,
          y: 200,
          z: -300
        },
        shadowEnabled: true
      },
      {
        id: ObjectUtil.createId(),
        stamp: ObjectUtil.createId(),
        intensity: 1.25,
        position: {
          x: -300,
          y: 200,
          z: -150
        },
        shadowEnabled: true
      }
    ],
    controlsProps: {
      id: ObjectUtil.createId(),
      stamp: ObjectUtil.createId(),
    },
    hexagonProps: {
      name: '',
      stamp: ObjectUtil.createId(),
      onHexagonsLoaded: handleHexagonsLoaded,
      onHexagonClicked: handleHexagonClicked
    }
  });

  const indicatorProps: IIndicatorProps = {
    id: 'i_ems',
    filePickerProps: {
      onHexagonUpdate: handleHexagonsUpdated
    }
  };

  const [userInterfaceProps, setUserInterfaceProps] = useState<IUserInterfaceProps>({
    indicatorProps,
  });

  const [updateDimensionsTo, setUpdateDimensionsTo] = useState<number>(-1);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const handleResize = () => {
    window.clearTimeout(updateDimensionsTo);
    setUpdateDimensionsTo(window.setTimeout(() => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 250));
  }

  useEffect(() => {
    setAppState({
      ...appState,
      action: {
        stamp: ObjectUtil.createId(),
        updateScene: false,
        updateLight: false
      },
    });
  }, [dimensions]);


  const [appState, setAppState] = useState<IAppState>({
    action: {
      stamp: ObjectUtil.createId(),
      updateScene: false,
      updateLight: false
    }
  });


  useEffect(() => {

    console.debug('🔄 updating app');

    let _hexagonProps: IHexagonsProps = {
      ...mapProps.hexagonProps,
      stamp: appState.action.updateScene ? ObjectUtil.createId() : mapProps.hexagonProps.stamp,
    };

    const _controlProps = {
      ...mapProps.controlsProps,
      stamp: appState.action.updateScene ? ObjectUtil.createId() : mapProps.controlsProps.stamp,
    }
    const _lightPropsFast = mapProps.lightProps.map(props => {
      return {
        ...props,
        stamp: appState.action.updateLight ? ObjectUtil.createId() : props.stamp,
        shadowEnabled: true
      }
    });

    const _indicatorProps: IIndicatorProps = {
      ...userInterfaceProps.indicatorProps,
      hexagon: appState.action.hexagon
    }
    setUserInterfaceProps({
      ...userInterfaceProps,
      indicatorProps: _indicatorProps
    });


    requestAnimationFrame(() => {
      setMapProps({
        ...mapProps,
        hexagonProps: _hexagonProps,
        lightProps: _lightPropsFast,
        controlsProps: _controlProps
      });
    })

  }, [appState]);

  useEffect(() => {
    console.debug('✨ building app component');
    window.addEventListener('resize', handleResize);
  }, []);


  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <MapComponent {...mapProps} />
      <UserInterfaceComponent {...userInterfaceProps} />
    </div>
  );

};

//