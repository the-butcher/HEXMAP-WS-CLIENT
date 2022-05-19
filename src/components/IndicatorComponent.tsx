import { Card, CardContent, useTheme } from '@mui/material';
import { ReactElement } from 'react';
import { ColorUtil } from '../util/ColorUtil';
import FilePickerComponent from '../util/FilePickerComponent';
import { SpatialUtil } from '../util/SpatialUtil';
import { IIndicatorProps } from './IIndicatorProps';

export default (props: IIndicatorProps) => {

  const theme = useTheme();

  const { filePickerProps } = props;

  let hexagonInfo: ReactElement = <div></div>;
  // https://www.gemeinden.at/gemeinden/20636
  if (props.hexagon) {
    const ele = (props.hexagon.y + 4 + SpatialUtil.HEXAGON_OFFSET_Y) / SpatialUtil.SCALE_SCENE / 2;
    const luc = ColorUtil.LABELS[props.hexagon.luc];
    const hrf = props.hexagon.gkz === '#####' ? '' : `https://www.gemeinden.at/gemeinden/${props.hexagon.gkz}`;
    const gzk = props.hexagon.gkz === '#####' ? <span>NODATA</span> : <a href={hrf} target="_blank" style={{ color: 'var(--color-text)' }}> {props.hexagon.gkz}</a >; //
    hexagonInfo = <div style={{ fontSize: '1.2em', padding: '20px' }}>GKZ: {gzk}, LUC: {luc}, ELE: {ele.toFixed(2)}</div>;
  }

  return (
    <div style={{ ...props.style, transition: 'all 500ms ease-in-out', userSelect: 'none' }}>
      <Card elevation={4}>
        <CardContent style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', transition: 'all 500ms ease-in-out', pointerEvents: 'visible' }} >
          <FilePickerComponent {...filePickerProps} />
          {hexagonInfo}
        </CardContent>
      </Card>
    </div>

  )

}
