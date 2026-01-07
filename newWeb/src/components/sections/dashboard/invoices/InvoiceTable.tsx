import { useState, useEffect, useCallback, useMemo } from 'react';
import { Tooltip, CircularProgress, Typography, DialogContent, DialogActions, Button, Dialog, TextField, DialogTitle } from '@mui/material';
import {
    DataGrid,
    GridSlots,
    GridColDef,
    useGridApiRef,
    GridActionsCellItem,
    GridRenderCellParams,
    GridTreeNodeWithRender,
    GridValidRowModel,
} from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';
import CustomPagination from 'components/common/CustomPagination';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';
import InvoiceDetailsModal from './modal/InvoiceDetailsModal';
import { Invoice, PartInvoice } from 'api';

// import DeleteInvoiceDialog from './DeleteInvoiceDialog';

interface EditInvoiceDialogProps {
    open: boolean;
    onClose: () => void;
    invoice: Invoice;
    onSave: (updatedInvoice: Invoice) => void;
}

const EditInvoiceDialog = ({ open, onClose, invoice, onSave }: EditInvoiceDialogProps) => {
    const [editedInvoice, setEditedInvoice] = useState(invoice);

    // Handle changes for individual fields
    const handleFieldChange = (field: keyof Invoice, value: any) => {
        setEditedInvoice((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {

        if (!editedInvoice.labor_fees || parseInt(editedInvoice.total_amount) < 0) {
            alert("Please enter valid values.");
            return;
        }
        console.log('Sending data:', {
            labor_fees: editedInvoice.labor_fees,
            tax: editedInvoice.tax,
            discount: 0,
            total_amount: 1400,
            status: editedInvoice.status,
            date: "2024-09-28T14:30:00",
        });

        fetch(`http://127.0.0.1:8000/api/invoices/${invoice.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                labor_fees: editedInvoice.labor_fees,
                tax: editedInvoice.tax,
                discount: editedInvoice.discount,
                total_amount: editedInvoice.total_amount,
                status: editedInvoice.status,
                date: "2024-09-28T14:30:00",
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Invoice updated:', data);
                onClose();
            })
            .catch(error => console.error('Error updating invoice:', error));
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Customer Name"
                    value={`${editedInvoice.service.car.customer_details.user.name} ${editedInvoice.service.car.customer_details.user.surname}`}
                    disabled
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Car Make/Model"
                    value={`${editedInvoice.service.car.predefined_car.make} ${editedInvoice.service.car.predefined_car.model}`}
                    disabled
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Service Type"
                    value={editedInvoice.service.service_type.name}
                    disabled
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Labor Fees"
                    type="number"
                    value={editedInvoice.labor_fees}
                    onChange={(e) => handleFieldChange('labor_fees', Number(e.target.value))}
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Discount"
                    type="number"
                    value={editedInvoice.discount}
                    onChange={(e) => handleFieldChange('discount', Number(e.target.value))}
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

interface InvoiceTableProps {
    searchText: string;
    rows: Invoice[];
    rowsPerPage?: number;
    loading: boolean;
}

const InvoiceTable = ({ searchText, rows, rowsPerPage = 20, loading }: InvoiceTableProps) => {
    const apiRef = useGridApiRef();
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [invoices, setInvoices] = useState<Invoice[]>(rows);

    useEffect(() => {
        setInvoices(rows);
    }, [rows])

    const columns: GridColDef<any>[] = [
        {
            field: 'id', headerName: 'Invoice Number', renderCell: (params: GridRenderCellParams<Invoice, any, any, GridTreeNodeWithRender>) => (
                <Typography variant="body2">
                    {`${params.row.id}`}
                </Typography>
            ), minWidth: 60
        },
        {
            field: 'customerName', headerName: 'Customer Name', flex: 1, renderCell: (params: GridRenderCellParams<Invoice, any, any, GridTreeNodeWithRender>) => (
                <Typography variant="body2">
                    {`${params.row.service.car.customer_details.user.name} ${params.row.service.car.customer_details.user.surname}`}
                </Typography>
            ), minWidth: 150
        },
        {
            field: 'carMakeModel', headerName: 'Car (Make/Model)', flex: 1, renderCell: (params: GridRenderCellParams<Invoice, any, any, GridTreeNodeWithRender>) => (
                <Typography variant="body2">
                    {`${params.row.service.car.predefined_car.make} ${params.row.service.car.predefined_car.model}`}
                </Typography>
            ), minWidth: 150
        },
        {
            field: 'serviceType', headerName: 'Service Type', flex: 1, renderCell: (params: GridRenderCellParams<Invoice, any, any, GridTreeNodeWithRender>) => (
                <Typography variant="body2">
                    {`${params.row.service.service_type.name}`}
                </Typography>
            ), minWidth: 120
        },
        {
            field: 'laborFees', headerName: 'Labor Fees (R)', flex: 0.5, renderCell: (params: GridRenderCellParams<Invoice, any, any, GridTreeNodeWithRender>) => (
                <Typography variant="body2">
                    {`${params.row.labor_fees}`}
                </Typography>
            ), minWidth: 100
        },
        {
            field: 'partInvoicesTotal', headerName: 'Total (R)', flex: 0.5, renderCell: (params: GridRenderCellParams<Invoice, any, any, GridTreeNodeWithRender>) => (
                <Typography variant="body2">
                    {`${params.row.total_amount}`}
                </Typography>
            ), minWidth: 100
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            minWidth: 80,
            getActions: (params) => [
                <Tooltip title="View">
                    <GridActionsCellItem
                        icon={<IconifyIcon icon="mingcute:information-fill" />}
                        label="View"
                        onClick={() => handleOpenViewModal(params.row)}
                        size="small"
                    />
                </Tooltip>,
                <Tooltip title="Edit">
                    <GridActionsCellItem
                        icon={<IconifyIcon icon="fluent:edit-32-filled" />}
                        label="Edit"
                        onClick={() => handleOpenEditModal(params.row)}
                        size="small"
                    />
                </Tooltip>,
            ],
        },
    ];

    const handleOpenViewModal = useCallback((invoice: any) => {
        setSelectedInvoice(invoice);
        setViewModalOpen(true);
    }, []);

    const handleOpenEditModal = useCallback((invoice: any) => {
        setSelectedInvoice(invoice);
        setEditModalOpen(true);
    }, []);


    const handleCloseModals = useCallback(() => {
        setViewModalOpen(false);
        setEditModalOpen(false);
        setSelectedInvoice(null);
    }, []);

    const handleSaveInvoice = useCallback((updatedInvoice: Invoice) => {
        if (!updatedInvoice.labor_fees || parseInt(updatedInvoice.total_amount) < 0) {
            alert("Please enter valid values.");
            return;
        }
        fetch(`http://127.0.0.1:8000/api/invoices/${updatedInvoice.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                labor_fees: updatedInvoice.labor_fees,
                tax: updatedInvoice.tax,
                total_amount: updatedInvoice.total_amount,
                status: updatedInvoice.status,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Invoice updated:', data);
            })
            .catch(error => console.error('Error updating invoice:', error));
        console.log('Updated Invoice:', updatedInvoice);
        handleCloseModals();
    }, [handleCloseModals]);


    const visibleColumns = useMemo(
        () => columns.filter((column) => column.field !== 'id'),
        [columns],
    );

    useEffect(() => {
        apiRef.current.setQuickFilterValues(
            searchText.split(/\b\W+\b/).filter((word: string) => word !== ''),
        );
    }, [searchText, apiRef]);

    return (
        <>
            <DataGrid
                apiRef={apiRef}
                density="standard"
                columns={visibleColumns as GridColDef<GridValidRowModel>[]}
                autoHeight
                rowHeight={56}
                rows={invoices}
                loading={loading}
                initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: rowsPerPage } },
                }}
                slots={{
                    loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
                    pagination: CustomPagination as GridSlots['pagination'],
                    noResultsOverlay: CustomNoResultsOverlay as GridSlots['noResultsOverlay'],
                }}
                sx={{
                    height: 1,
                    width: 1,
                    tableLayout: 'fixed',
                    scrollbarWidth: 'thin',
                }}
            />
            {selectedInvoice && (
                <>
                    <InvoiceDetailsModal
                        open={isViewModalOpen}
                        onClose={handleCloseModals}
                        invoiceId={selectedInvoice.id}
                    />
                    <EditInvoiceDialog
                        open={isEditModalOpen}
                        onClose={handleCloseModals}
                        invoice={selectedInvoice}
                        onSave={handleSaveInvoice}
                    />
                </>
            )}
        </>
    );
};

export default InvoiceTable;
