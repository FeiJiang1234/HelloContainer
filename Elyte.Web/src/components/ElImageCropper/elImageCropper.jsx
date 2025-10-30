import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Slider, Typography, Grid, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElButton } from 'components';
import getCroppedImg from './canvasUtils';
import { utils } from 'utils';
const useStyles = makeStyles(theme => ({
    cropContainer: {
        position: 'relative',
        width: '100%',
        height: theme.spacing(30),
    },
    controls: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    sliderContainer: {
        display: 'flex',
        flex: '1',
        alignItems: 'center',
    },
    slider: {
        padding: '22px 0px'
    }
}));

const ElImageCropper = ({ file, cropShape, onCropCompleted }) => {
    const classes = useStyles();
    const [imageSrc, setImageSrc] = useState();
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aspect, setAspect] = useState(4 / 4);

    useEffect(() => {
        if (!file) { return; }

        utils.readFile(file).then((url) => setImageSrc(url));
    }, [file]);

    useEffect(() => {
        if (cropShape !== "round") {
            setAspect(4 / 3);
        }
    }, [cropShape]);

    const onCropComplete = useCallback((_, tmpcroppedAreaPixels) => setCroppedAreaPixels(tmpcroppedAreaPixels), []);

    const handleSaveClick = useCallback(async () => {
        setLoading(true);
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
        var loadFile = new File([croppedImage], "corped-" + utils.generateUUID() + '.jpeg', { type: '.jpeg' });
        setLoading(false);
        setImageSrc(null);
        if (onCropCompleted) {
            onCropCompleted(loadFile);
        }
    }, [imageSrc, croppedAreaPixels, rotation]);

    return (
        <>
            <Box className={classes.cropContainer}>
                <Cropper restrictPosition={false} image={imageSrc} crop={crop} zoom={zoom} rotation={rotation} cropShape={cropShape} objectFit="horizontal-cover" aspect={aspect}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                />
            </Box>
            <Box className={classes.controls}>
                <Grid className={classes.sliderContainer} container spacing={0}>
                    <Grid item xs={4}><Typography>Zoom</Typography></Grid>
                    <Grid item xs={8}>
                        <Slider value={zoom} min={0.3} max={3} step={0.1} classes={{ root: classes.slider }} onChange={(e, z) => setZoom(z)} />
                    </Grid>
                    <Grid item xs={4}><Typography>Rotation</Typography></Grid>
                    <Grid item xs={8}>
                        <Slider value={rotation} min={0} max={360} step={1} classes={{ root: classes.slider }} onChange={(e, r) => setRotation(r)} />
                    </Grid>
                </Grid>
                <ElButton loading={loading} onClick={handleSaveClick}>Crop and save</ElButton>
            </Box>
        </>
    );
};

ElImageCropper.displayName = "ElImageCropper";
ElImageCropper.defaultProps = {
    cropShape: "round",
};

export default ElImageCropper;
