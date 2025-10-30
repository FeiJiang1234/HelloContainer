import React, { useEffect, useState } from 'react';
import { InputAdornment, InputLabel, Grid } from '@mui/material';
import { ElSvgIcon, ElInput } from 'components';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import styled from '@emotion/styled';
import _ from 'lodash';
import config from '../config';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    fileName: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        paddingLeft: 8

    },
    fileOverSize: {
        color: 'red'
    }
}));

const FileRemove = styled(CloseIcon)(() => {
    return {
        left: 'calc(50% + 8px)'
    };
});

const FileLabel = styled(InputLabel)(() => {
    return {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12
    };
});

const ElFileUploader = ({ label, type, onRegister, onSetFiles }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => upadateFiles([]), []);

    const handleFileChange = (event) => {
        var newFiles = [...files];
        _.forEach(event.target.files, file => {
            const fileExist = _.some(files, item => item.name === file.name);
            if (!fileExist) newFiles.push(file);
        });
        upadateFiles(newFiles);
    };

    const handleRemoveFile = (index) => {
        var newFiles = [...files.filter((x, i) => i != index)];
        upadateFiles(newFiles);
    };

    const upadateFiles = (newFiles) => {
        setFiles(newFiles);
        var fileObj = {};
        fileObj[type] = newFiles;
        onSetFiles && onSetFiles(fileObj);
        const dt = new DataTransfer();
        const input = document.getElementById(`${type}_upload-file`);
        _.forEach(newFiles, file => dt.items.add(file));
        input.files = dt.files;
    };

    return (
        <>
            <ElInput disabled InputProps={{
                startAdornment:
                    <InputAdornment position="start">
                        <FileLabel htmlFor={`${type}_upload-file`}>
                            <ElSvgIcon light name="fileUpload" />
                            {label}
                        </FileLabel>
                    </InputAdornment>
            }}
            />
            <input type="file" name={type} id={`${type}_upload-file`} style={{ height: '0px', width: '0px' }} accept=".pdf,.docx" multiple {...onRegister(type, {})} onChange={handleFileChange} />
            <FileList files={files} onFileRemoved={handleRemoveFile} />
        </>
    )
};

const FileList = ({ files, onFileRemoved }) => {
    const classes = useStyles();

    const isPDF = (fileName) => {
        return fileName.endWith(".pdf");
    }

    const handleFileRemoveClick = (index) => {
        if (onFileRemoved) {
            onFileRemoved(index);
        }
    }

    const getFileSize = (file) => {
        return `${(file.size / (1024 ** 2)).toFixed(2)} MB`;
    }

    const isFileOverSize = (file) => file.size > config.fileMaxBytes;

    const getMaxFileSize = () => {
        return `${(config.fileMaxBytes / (1024 ** 2)).toFixed(0)} MB`;
    }

    return (
        <Grid container>
            {
                !Array.isNullOrEmpty(files) && files.map((file, index) => (
                    <Grid key={`uploaded-file-index-${index}`} item container xs={12} sx={{ alignItems: 'center' }}>
                        <Grid item xs={1}>{isPDF(file.name) ? <PictureAsPdfIcon /> : <ElSvgIcon small name="file" />}</Grid>
                        <Grid item xs={10} className={[classes.fileName, isFileOverSize(file) ? classes.fileOverSize : ''].join(" ")}>
                            {file.name}({getFileSize(file)}{isFileOverSize(file) ? `, File Size cannot exceed ${getMaxFileSize()}` : ''})
                        </Grid>
                        <Grid item xs={1}><FileRemove className='hand' onClick={() => handleFileRemoveClick(index)} /></Grid>
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default ElFileUploader;
