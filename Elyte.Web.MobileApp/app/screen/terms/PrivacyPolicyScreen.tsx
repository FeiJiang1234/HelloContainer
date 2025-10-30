import termService from 'el/api/termService';
import { ElTitle } from 'el/components';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { WebView } from 'react-native-webview';

export default function TermsOfServiceScreen() {

    const [content, setContent] = useState("");

    useEffect(() => {
        getTerm()
    }, []);

    const getTerm = async () => {
        const res: any = await termService.getTerm("PrivacyPolicyTerm", false);
        if (res && res.code === 200) {
            setContent(res.value?.content);
        }
    }

    return (
        <>
            <ElTitle>Terms of Service</ElTitle>
            <WebView
                source={{ html: content }}
            />
        </>
    )
}
