import React, { useEffect, useState } from 'react';
import { FormHelperText, InputAdornment, FormControl, InputLabel, OutlinedInput, Box, CardMedia } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ElSvgIcon, ElDialog, ElImageCropper, ElAvatar } from 'components';
import { utils } from 'utils';

const useStyles = makeStyles(theme => {
    return {
        root: {
            '& .MuiFormLabel-root': {
                color: theme.palette.body.light,
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 0,
            },
            '&>.MuiInputAdornment-root': {
                width: '100%',
                height: '100%',
            },
            '&>input': {
                display: 'none'
            },
            '&>.MuiInputAdornment-root>.MuiFormLabel-root': {
                width: '100%'
            },
            width: '100%',
            paddingLeft: 0,
            backgroundColor: '#F0F2F7',
            height: theme.spacing(7),
            borderRadius: '10px',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        formControl: {
            '& .MuiFormControl-root': {
                display: 'inherit'
            }
        },
        error: {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.error.main,
                borderRadius: '10px',
                borderWidth: 2,
            },
        },
        noError: {
            '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 0,
            },
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            '& svg': {
                marginRight: theme.spacing(2),
                marginLeft: theme.spacing(2)
            }
        }
    };
});


const ElImageSelecter = ({ needToCorp, cropShape, errorMessage, onImageSelected, ...rest }) => {
    const { className, defaultValue, ...other } = rest;
    const classes = useStyles();
    const [imageUrl, setImageUrl] = useState();
    const [corpedFile, setCorpedFile] = useState();
    const [fileDefaulteValue, setFileDefaulteValue] = useState();
    const [errorInfo, setErrorInfo] = useState();

    useEffect(() => {
        setErrorInfo(errorMessage);
    }, [errorMessage]);

    useEffect(async () => {
        if (defaultValue instanceof FileList) {
            setFileDefaulteValue(defaultValue);
            let url = await utils.readFile(defaultValue[0]);
            setImageUrl(url);
            return;
        }

        if (defaultValue instanceof File) {
            setFileDefaulteValue(defaultValue);
            let url = await utils.readFile(defaultValue);
            setImageUrl(url);
            return;
        }

        if (typeof defaultValue === "string") {
            setImageUrl(defaultValue);
        }
    }, [defaultValue]);

    const handleImageChanged = async (e) => {
        setErrorInfo(null);
        if (e.target && e.target.files && e.target.files[0]) {
            if (needToCorp) {
                setCorpedFile(e.target.files[0]);
                return;
            }

            let url = await utils.readFile(e.target.files[0]);
            setImageUrl(url);
            if (onImageSelected) {
                onImageSelected(e.target.files[0]);
            }
        }
    }

    const handleImageClick = () => {
        document.getElementById('upload-file').click();
    }

    const handleCorpComplete = async (file) => {
        let url = await utils.readFile(file);
        setImageUrl(url);
        handleCorpDialogClose();
        if (onImageSelected) {
            onImageSelected(file);
        }
    }

    const handleCorpDialogClose = () => {
        setCorpedFile(null);
        const dt = new DataTransfer();
        const input = document.getElementById(`upload-file`);
        input.files = dt.files;
    }

    return (
        <>
            {
                !imageUrl &&
                <FormControl fullWidth className={[classes.formControl, className].join(" ")}>
                    <OutlinedInput className={[classes.root, errorInfo ? classes.error : classes.noError].join(" ")} type='text' readOnly error={!!errorInfo}
                        startAdornment={
                            <InputAdornment position="start">
                                <InputLabel htmlFor="upload-file" className={classes.label}>
                                    <ElSvgIcon hover light small name="picture" />
                                    {rest.label}
                                </InputLabel>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            }
            <input id="upload-file" style={{ height: '0px', width: '0px' }} type="file" single="true" accept=".png,.jpg,.jpeg,.bmp,.webp" defaultValue={fileDefaulteValue} onChange={handleImageChanged} {...other} />
            {errorInfo && <FormHelperText error={!!errorInfo}>{errorInfo}</FormHelperText>}
            {
                imageUrl && cropShape === "round" &&
                <Box className='x-center'>
                    <ElAvatar src={imageUrl} xlarge onClick={handleImageClick} />
                </Box>
            }
            {imageUrl && cropShape !== "round" && <CardMedia image={imageUrl} component="img" onClick={handleImageClick} />}
            {
                corpedFile && needToCorp &&
                <ElDialog open={corpedFile && needToCorp} onClose={handleCorpDialogClose} title="Crop Image">
                    <ElImageCropper onCropCompleted={handleCorpComplete} file={corpedFile} cropShape={cropShape} />
                </ElDialog>
            }
        </>
    );
}

ElImageSelecter.displayName = "ElImageSelecter";
ElImageSelecter.defaultProps = {
    needToCorp: true,
    cropShape: "round",
};

export default ElImageSelecter;
