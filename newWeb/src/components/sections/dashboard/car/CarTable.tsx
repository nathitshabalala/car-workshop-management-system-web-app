import { useMemo, useEffect, ReactElement, useState, useRef, useCallback } from 'react';
import { Tooltip, Typography, CircularProgress } from '@mui/material';
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
import ViewDetailsModal from './modals/part/ViewDetailsModal';
import EditCarModal from './modals/car/EditCarModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import { PredefinedCar } from 'api';

interface CarTableProps {
  searchText: string;
  rows: PredefinedCar[];
  rowsPerPage?: number;
  loading: boolean;
}

const CarTable = ({ searchText, rows, rowsPerPage = 20, loading }: CarTableProps): ReactElement => {
  const apiRef = useGridApiRef();
  const [selectedCar, setSelectedCar] = useState<PredefinedCar | null>(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const columns: GridColDef<PredefinedCar>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'make',
      headerName: 'Make',
      renderCell: (params: GridRenderCellParams<PredefinedCar, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.make}`}
        </Typography>
      ),
      resizable: false,
      flex: 1,
      minWidth: 155,
    },
    {
      field: 'model',
      headerName: 'Model',
      renderCell: (params: GridRenderCellParams<PredefinedCar, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.model}`}
        </Typography>
      ),
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: 'year',
      headerName: 'Make',
      renderCell: (params: GridRenderCellParams<PredefinedCar, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.year}`}
        </Typography>
      ),
      resizable: false,
      flex: 1,
      minWidth: 115,
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
            aria-label="View Car details"
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
            aria-label="Edit Car"
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
            aria-label="Delete Car"
          />
        </Tooltip>,
      ],
    },
  ];

  const handleOpenViewModal = useCallback((car: PredefinedCar) => {
    setSelectedCar(car);
    setViewModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((car: PredefinedCar) => {
    setSelectedCar(car);
    setEditModalOpen(true);
  }, []);

  const handleOpenDeleteModal = useCallback((car: PredefinedCar) => {
    setSelectedCar(car);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedCar(null);
  }, []);

  const handleSaveCar = useCallback(() => {
    console.log('Saving updated Car');
    handleCloseModals();
  }, [handleCloseModals]);

  const handleDeleteCar = useCallback((carId: number) => {
    console.log('Deleting Car with ID:', carId);
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
      {selectedCar && (
        <>
          <ViewDetailsModal
            open={isViewModalOpen}
            onClose={handleCloseModals}
            carId={selectedCar.id}
          />
          <EditCarModal
            open={isEditModalOpen}
            onClose={handleCloseModals}
            onSave={handleSaveCar}
            car={selectedCar}
          />
          <DeleteConfirmationModal
            open={isDeleteModalOpen}
            onClose={handleCloseModals}
            onConfirm={() => handleDeleteCar(selectedCar.id)}
            car={selectedCar}
          />
        </>
      )}
    </>
  );
};

export default CarTable;
