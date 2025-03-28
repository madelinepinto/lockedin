import { Button, ButtonBase, Stack, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ElementType, VaultElementInterface } from '../../interfaces/VaultElement'
import './VaultElement.css'
import { useEffect, useState } from 'react';
import { Download, VisibilityOutlined } from '@mui/icons-material';
import { getMimeType } from '../../util/util';

function VaultElement({ index, element, userKey }: { index: number, element: VaultElementInterface, userKey: string }) {
    const [showSecret, setShowSecret] = useState(false);
    const [decryptedValue, setDecryptedValue] = useState("");

    const [showFileName, setShowFileName] = useState(false);
    const [fileName, setFileName] = useState("");

    const decryptValue = async (value: string) => {
        const decoder = new TextDecoder();
        return decoder.decode(await decryptBuffer(value));
    };

    const decryptBuffer = async (value:string) => {
        const encoder = new TextEncoder();

        const data = JSON.parse(atob(value));
        const iv = new Uint8Array(data.iv);

        const keyBuffer = await window.crypto.subtle.digest("SHA-256", encoder.encode(userKey));

        const key = await window.crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
        );

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            new Uint8Array(data.ciphertext)
        );

        return decryptedBuffer
    }

    const showDecryptSecret = async () => {
        setDecryptedValue(await decryptValue(element.secret));
        setShowSecret(!showSecret);
    }

    const showDecryptFileName = async () => {
        setShowFileName(!showFileName);
        setFileName(await decryptValue(element.fileName));
    }

    const downloadFile = async () => {
        setFileName(await decryptValue(element.fileName));
        const data = await decryptBuffer(element.secret);
        const blob = new Blob([data], { type: getMimeType(fileName) }); // Create a Blob object
        const url = URL.createObjectURL(blob); // Generate a URL for the Blob

        const a = document.createElement("a"); // Create an anchor element
        a.href = url;
        a.download = fileName; // File name
        document.body.appendChild(a);
        a.click(); // Programmatically click the anchor
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
    };


    console.log(element.type)
    // UI for file item
    if (element.type === ElementType.File) {
        return (
            <Stack className="VaultElement" sx={{ flexDirection: 'column', alignSelf: 'left', minWidth: '30vw' }}>
                <Stack className="VaultElement-title" sx={{ flexDirection: 'row', gap: '1em' }}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        {element.name}
                    </Typography>
                    <InfoOutlinedIcon sx={{ color: "rgb(74, 160, 246)", height: '100%', alignSelf: 'center' }} />
                </Stack>
                <Stack className="VaultElement-actions" sx={{ flexDirection: 'row', gap: '2rem' }}>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, width: 120 }}>
                        {showFileName ? fileName : "****************"}
                    </Typography>
                    <Stack sx={{ flexDirection: 'row', gap: '0.3rem' }}>
                        <ButtonBase onClick={() => { showDecryptFileName() }}>
                            {showFileName ? <VisibilityOutlined /> : <VisibilityOffOutlinedIcon />}
                        </ButtonBase>
                    </Stack>
                    <Stack sx={{ flexDirection: 'row', gap: '0.3rem' }}>
                        <ButtonBase onClick={() => { downloadFile() }}>
                            <Download />
                            <Typography sx={{ fontSize: '1rem', fontWeight: 400 }}>
                                Download
                            </Typography>
                        </ButtonBase>
                    </Stack>
                </Stack>
            </Stack>
        )
    }

    // UI for text item
    return (
        <Stack className="VaultElement" sx={{ flexDirection: 'column', alignSelf: 'left', minWidth: '30vw' }}>
            <Stack className="VaultElement-title" sx={{ flexDirection: 'row', gap: '1em' }}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
                    {element.name}
                </Typography>
                <InfoOutlinedIcon sx={{ color: "rgb(74, 160, 246)", height: '100%', alignSelf: 'center' }} />
            </Stack>
            <Stack className="VaultElement-actions" sx={{ flexDirection: 'row', gap: '2rem' }}>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, width: 120 }}>
                    {showSecret === true ? decryptedValue : "****************"}
                </Typography>
                <Stack sx={{ flexDirection: 'row', gap: '0.3rem' }}>
                    <ButtonBase onClick={() => { showDecryptSecret() }}>
                        {showSecret ? <VisibilityOutlined /> : <VisibilityOffOutlinedIcon />}
                        <Typography sx={{ fontSize: '1rem', fontWeight: 400 }}>
                            Show
                        </Typography>
                    </ButtonBase>
                </Stack>
                <Stack sx={{ flexDirection: 'row', gap: '0.3rem' }}>
                    <ContentCopyIcon />
                    <Typography sx={{ fontSize: '1rem', fontWeight: 400 }}>
                        Copy
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default VaultElement
