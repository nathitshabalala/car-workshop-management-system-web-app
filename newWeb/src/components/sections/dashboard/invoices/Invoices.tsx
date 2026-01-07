import { useState, ChangeEvent, useCallback, ReactElement, useEffect } from 'react';
import { Box, Paper, Stack, TextField, Typography, InputAdornment } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import InvoiceTable from './InvoiceTable';
import { Invoice, InvoiceApi } from 'api';

const Invoices = (): ReactElement => {
    const [search, setSearch] = useState<string>('');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.currentTarget.value);
    }, []);

    // Fetch invoices data
    useEffect(() => {
        const fetchInvoices = async () => {
            const invoiceApi = new InvoiceApi();
            try {
                const response = await invoiceApi.invoicesList();
                setInvoices(response.data.reverse());
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    return (
        <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={5}
                flexWrap="wrap"
                gap={3}
            >
                <Typography variant="h4" color="common.white">
                    Invoices
                </Typography>
                <TextField
                    variant="filled"
                    placeholder="Search..."
                    value={search}
                    onChange={handleChange}
                    sx={{
                        '.MuiFilledInput-root': {
                            bgcolor: 'grey.A100',
                            ':hover': {
                                bgcolor: 'background.default',
                            },
                            ':focus': {
                                bgcolor: 'background.default',
                            },
                            ':focus-within': {
                                bgcolor: 'background.default',
                            },
                        },
                        borderRadius: 2,
                        height: 40,
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="end">
                                <IconifyIcon icon="akar-icons:search" width={13} height={13} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            <Box width={1} flexGrow={1} minHeight={325}>
                <InvoiceTable searchText={search} rows={invoices} loading={loading} />
            </Box>
        </Paper>
    );
};

export default Invoices;
