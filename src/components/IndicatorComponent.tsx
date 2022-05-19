import { ExpandMore } from '@mui/icons-material';
import { Button, Card, CardContent, IconButton, useTheme } from '@mui/material';
import { ObjectUtil } from '../util/ObjectUtil';
import FilePickerComponent from '../util/FilePickerComponent';
import { IIndicatorProps } from './IIndicatorProps';

export default (props: IIndicatorProps & React.CSSProperties) => {

  const theme = useTheme();

  const { id, onExpand, filePickerProps } = props;

  const openHorizontal = props.fold === 'open-horizontal' || props.fold === 'open-vertical';
  const openVertical = props.fold === 'open-vertical';
  let expandTransform = 'rotate(-90deg)'
  if (openHorizontal) {
    expandTransform = openVertical ? 'rotate(180deg)' : 'rotate(0deg)';
  }

  const handleExpand = (e: React.PointerEvent) => {
    onExpand(id);
  }



  const indicatorMinHeight = '90px';
  const verticalHeight = openVertical ? `${Math.min(window.innerHeight - 500, 500)}px` : indicatorMinHeight

  return (
    <div style={{ ...props.style, transition: 'all 500ms ease-in-out', userSelect: 'none' }}>
      <Card elevation={4}>
        <CardContent style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 500ms ease-in-out', pointerEvents: 'visible' }} >
          <div style={{ display: 'flex', justifyContent: 'right', flexDirection: 'row', minHeight: '21px' }}>
            <div style={{ fontSize: '14px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', paddingTop: '1px', paddingRight: '12px' }}>{ObjectUtil.buildIndicatorTitle(props)}</div>
            <div style={{ flexGrow: '1' }}></div>
            <div style={{ overflow: 'hidden', position: 'relative' }}>

            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', minHeight: indicatorMinHeight }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '140px', flexGrow: '1' }}>
              <div style={{ fontSize: '36px', textAlign: 'right', whiteSpace: 'nowrap', lineHeight: '50%', paddingTop: '20px' }}>{props.label00}</div>
              <div style={{ fontSize: '10px', textAlign: 'right' }}>##date##</div>
              <div style={{ fontSize: '18px', textAlign: 'right', whiteSpace: 'nowrap', lineHeight: '50%', paddingTop: '12px' }}>##label07##</div>
              <div style={{ fontSize: '10px', textAlign: 'right', whiteSpace: 'nowrap' }}>gegenüber Vorwoche</div>
              <div style={{ minHeight: '3px', flexGrow: '100' }} />

              <div style={{ display: 'flex', flexDirection: 'column', height: openVertical ? '260px' : '0px', transition: 'all 500ms ease-in-out' }}>
                <div style={{ flexGrow: '10' }} />
                ##legend##
                <div style={{ minHeight: '30px' }} />
              </div>

            </div>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0px', minWidth: '40px', width: '40px' }}>
              <IconButton key={`expand_${props.id}`} aria-label='share' onPointerUp={handleExpand} style={{ transform: expandTransform }}>
                <ExpandMore style={{ width: '24px', height: '24px', color: 'var(--color-text)' }} />
              </IconButton>
              <div style={{ flexGrow: '1' }}></div>
            </div>
            <FilePickerComponent {...filePickerProps} />

          </div>
        </CardContent>
      </Card>
    </div>

  )

}
