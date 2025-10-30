import { useState } from 'react';
import config from '../config';
import _ from 'lodash';

export default function useFile() {
    const [files, changeFiles] = useState({ });

    const isFileOverSize = () => {
        const fileEntries = Object.entries(files);
        const fileFlat = _.flatMap(fileEntries, x => x[1]);
        const isAnyFileOverSize =  _.some(fileFlat, x => x.size > config.fileMaxBytes);
        return isAnyFileOverSize;
    }

    const setFiles = (newFiles) => changeFiles({ ...files, ...newFiles });
    const cleanFile = () =>  changeFiles({ });

    const setFormDataFiles = (formData) => {
        Object.entries(files).forEach(([key, value]) => _.forEach(value, (x) => formData.append(key, x)));
    }

    return { files, setFiles, setFormDataFiles, isFileOverSize, cleanFile };
}
