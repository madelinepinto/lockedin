import { Box, Stack, Typography } from '@mui/material';
import './VaultList.css'
import VaultElement from '../vaultElement/VaultElement';
import { VaultElementInterface } from '../../interfaces/VaultElement';

function VaultList({searchText, filterType, data, userKey}: {searchText: string, filterType: string, data: VaultElementInterface[], userKey: string}) {
    
    console.log(data);

    return (
        <Stack className="VaultList" sx={{ flexDirection: 'column', alignSelf: 'center', marginTop: '5%' }}>
            {data.length === 0 ?
            <Box sx={{marginTop: { md: '30%', xs: '5%'}}}>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
                    Vault Currently Empty
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                    Use the menu on the right to add to the Vault
                </Typography>
            </Box>
            : data.map((element, index: number) => (
                (
                    (searchText === '' || element.name.toLocaleLowerCase().startsWith(searchText.toLocaleLowerCase())) && 
                    (filterType === 'All' || filterType === element.type)
                ) && (<VaultElement index={index} element={element} userKey={userKey}></VaultElement>)))}
        </Stack>
    )
}

export default VaultList
