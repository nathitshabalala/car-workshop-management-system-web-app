import { useMemo, useEffect, ReactElement, useState, useRef, useCallback } from 'react';
import { Stack, Avatar, Tooltip, Typography, CircularProgress } from '@mui/material';
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
import ViewDetailsModal from './modals/ViewDetailsModal';
import EditCustomerModal from './modals/EditCustomerModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import { Customer } from 'api';
import { stringAvatar } from 'helpers/string-avatar';

interface CustomerTableProps {
  searchText: string;
  rows: Customer[];
  rowsPerPage?: number;
  loading: boolean;
}

const CustomerTable = ({ searchText, rows, rowsPerPage = 4, loading }: CustomerTableProps): ReactElement => {
  const apiRef = useGridApiRef();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const columns: GridColDef<Customer>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'name',
      headerName: 'Name',
      renderCell: (params: GridRenderCellParams<Customer, any, any, GridTreeNodeWithRender>) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Tooltip
            title={`${params.row.user.name} ${params.row.user.surname}`} placement="top" arrow>
            <Avatar {...stringAvatar(params.row.user.name)} />
          </Tooltip>
          <Typography variant="body2">
            {`${params.row.user.name} ${params.row.user.surname}`}
          </Typography>
        </Stack>
      ),
      resizable: false,
      flex: 1,
      minWidth: 155,
    },
    {
      field: 'email',
      headerName: 'Email',
      renderCell: (params: GridRenderCellParams<Customer, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.user.email}`}
        </Typography>
      ),
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      renderCell: (params: GridRenderCellParams<Customer, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.user.phone}`}
        </Typography>
      ),
      resizable: false,
      flex: 1,
      minWidth: 115,
    },
    {
      field: 'billing-address',
      headerName: 'Billing Address',
      sortable: false,
      resizable: false,
      flex: 1,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams<Customer, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.user.street_address}, ${params.row.user.city}, ${params.row.user.postal_code}`}
        </Typography>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      resizable: false,
      flex: 1,
      minWidth: 80,
      getActions: (params) => [
        <Tooltip title="Info">
          <GridActionsCellItem
            icon={
              <IconifyIcon
                icon="mingcute:information-fill"
                color="text.secondary"
                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
              />
            }
            label="View"
            onClick={() => handleOpenViewModal(params.row)}
            size="small"
            aria-label="View Customer details"
          />
        </Tooltip>,
        <Tooltip title="Edit">
          <GridActionsCellItem
            icon={
              <IconifyIcon
                icon="fluent:edit-32-filled"
                color="text.secondary"
                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
              />
            }
            label="Edit"
            onClick={() => handleOpenEditModal(params.row)}
            size="small"
            aria-label="Edit Customer"
          />
        </Tooltip>,
        <Tooltip title="Delete">
          <GridActionsCellItem
            icon={
              <IconifyIcon
                icon="mingcute:delete-3-fill"
                color="error.main"
                sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
              />
            }
            label="Delete"
            onClick={() => handleOpenDeleteModal(params.row)}
            size="small"
            aria-label="Delete Customer"
          />
        </Tooltip>,
      ],
    },
  ];

  const handleOpenViewModal = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setEditModalOpen(true);
  }, []);

  const handleOpenDeleteModal = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedCustomer(null);
  }, []);

  const handleSaveCustomer = useCallback(() => {
    console.log('Saving updated Customer');
    handleCloseModals();
  }, [handleCloseModals]);

  const handleDeleteCustomer = useCallback((customerId: number) => {
    console.log('Deleting Customer with ID:', customerId);
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

  const resizeHandler = useRef(() => {
    if (apiRef.current) {
      apiRef.current.resize();
    }
  });

  useEffect(() => {
    window.addEventListener('resize', resizeHandler.current);
    return () => {
      window.removeEventListener('resize', resizeHandler.current);
    };
  }, []);

  return (
    <>
      <DataGrid
        apiRef={apiRef}
        density="standard"
        columns={visibleColumns as GridColDef<GridValidRowModel>[]}
        autoHeight={false}
        rowHeight={56}
        checkboxSelection
        disableColumnMenu
        disableRowSelectionOnClick
        rows={rows}
        getRowId={(row) => row.user.id}
        loading={loading}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: rowsPerPage } },
        }}
        slots={{
          loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
          pagination: CustomPagination as GridSlots['pagination'],
          noResultsOverlay: CustomNoResultsOverlay as GridSlots['noResultsOverlay'],
        }}
        slotProps={{
          pagination: { labelRowsPerPage: rows.length },
        }}
        sx={{
          height: 1,
          width: 1,
          tableLayout: 'fixed',
          scrollbarWidth: 'thin',
        }}
      />
      {selectedCustomer && (
        <>
          <ViewDetailsModal
            open={isViewModalOpen}
            onClose={handleCloseModals}
            customerId={selectedCustomer.user.id}
          />
          <EditCustomerModal
            open={isEditModalOpen}
            onClose={handleCloseModals}
            onSave={handleSaveCustomer}
            customer={selectedCustomer}
          />
          <DeleteConfirmationModal
            open={isDeleteModalOpen}
            onClose={handleCloseModals}
            onConfirm={() => handleDeleteCustomer(selectedCustomer.user.id)}
            customer={selectedCustomer}
          />
        </>
      )}
    </>
  );
};

export default CustomerTable;
