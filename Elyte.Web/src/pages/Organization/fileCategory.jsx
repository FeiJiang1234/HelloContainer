import React, { useState } from 'react';
import { ElAccordion, ElConfirm, ElSvgIcon } from 'components';
import { Box } from '@mui/material';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const Container = styled(Box)(() => {
    return {
        display: 'flex',
        padding: 16,
        marginBottom: 8,
        gap: 8,
        backgroundColor: '#F0F2F7',
        borderRadius: 10,
        position: 'relative'
    };
});

const FileName = styled('a')(() => {
    return {
        fontSize: 15,
        fontWeight: 500,
        textDecoration: 'none',
        color: '#1F345D'
    };
});

const FileDelete = styled(CloseIcon)(() => {
    return {
        position: 'absolute',
        right: 16
    };
});

const FileCategory = ({ title, files, onDeleteFile, isShowDelete }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [fileId, setFileId] = useState();

    const isPDF = (fileName) => {
        return fileName.endWith(".pdf");
    }

    const handDeleteClick = (id) => {
        setShowDeleteDialog(true);
        setFileId(id);
    }

    const handleDeleteClose = () => {
        setShowDeleteDialog(false);
        setFileId(null);
    }

    return (
        <>
            {!Array.isNullOrEmpty(files) &&
                <ElAccordion title={title}>
                    {files.map(x => (
                        <Container key={x.id}>
                            {isPDF(x.name) ? <PictureAsPdfIcon /> : <ElSvgIcon small name="file" />}
                            <FileName href={x.url}>{x.name}</FileName>
                            {isShowDelete && <FileDelete className='hand' onClick={() => handDeleteClick(x.id)} />}
                        </Container>
                    ))}
                </ElAccordion>
            }
            <ElConfirm
                title="Delete File"
                content="Are you sure you want to delete this file?"
                open={showDeleteDialog}
                onNoClick={handleDeleteClose}
                onOkClick={() => onDeleteFile(fileId)}
            />
        </>
    );
};

export default FileCategory;
