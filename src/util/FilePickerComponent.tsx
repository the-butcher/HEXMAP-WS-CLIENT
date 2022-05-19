import { Button, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import HexagonsComponent from "../components/HexagonsComponent";
import { IFilePickerProps } from "../components/IFilePickerProps";
import { HexagonRepository } from "../data/HexagonRepository";
import { PbfHexagonsLoader } from "../protobuf/PbfHexagonsLoader";
import { ObjectUtil } from "./ObjectUtil";

export default (props: IFilePickerProps) => {

    let ws = useRef<WebSocket>();

    const [connected, setConnected] = useState<boolean>(false);
    const { onHexagonUpdate } = props;

    useEffect(() => {

        console.debug('✨ setting up web socket');

        var uid = ObjectUtil.createId();

        ws.current = new WebSocket("ws://192.168.0.94:8080/websocketpbf/hexagons/" + uid);
        ws.current.binaryType = "arraybuffer";

        setConnected(true);

        ws.current.onclose = (e) => {
            // console.log('socket closed');
            setConnected(false);
        }
        ws.current.onmessage = function (event) {

            console.log('msg', event.data);
            const byteArray = new Uint8Array(event.data);
            console.log('arr');
            const pbfHexagonLoader = new PbfHexagonsLoader();
            pbfHexagonLoader.fromData(byteArray).then(pbfHexagons => {
                console.log('hex', pbfHexagonLoader.time);
                HexagonRepository.getInstance().update(pbfHexagons);
                onHexagonUpdate();
            });


        };
        ws.current.onerror = (e) => {
            console.log('socket failure', e);
            setConnected(false);
        };

    }, []);

    const send = (data: ArrayBuffer) => {

        // console.log('file send', data);
        ws.current.send(data);

    }

    const handleChange = (e: React.ChangeEvent) => {

        // @ts-ignore
        const fileCount = e.target.files.length;
        for (let fileIndex = 0; fileIndex < fileCount; fileIndex++) {

            // @ts-ignore
            var file = e.target.files[fileIndex];
            if (!file) {
                console.warn('no file');
                return;
            }

            var reader = new FileReader();
            reader.onload = e => {

                console.log('file read', e);
                send(e.target.result as ArrayBuffer);

            }
            reader.readAsArrayBuffer(file);

        }



    }

    return (

        <div style={{ display: 'flex', flexDirection: 'row', flexGrow: '999' }}>

            <FormGroup style={{ padding: '10px' }}>
                <FormControlLabel disabled checked={connected} control={<Switch />} label="Connected" />
            </FormGroup>
            <FormGroup style={{ padding: '9px' }}>
                <input
                    accept="application/x-protobuf, .pbf"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleChange}
                />
                <label htmlFor="raised-button-file">
                    <Button component="span" variant="outlined">
                        Add Content
                    </Button>
                </label>
            </FormGroup>

        </div>

    )

};

