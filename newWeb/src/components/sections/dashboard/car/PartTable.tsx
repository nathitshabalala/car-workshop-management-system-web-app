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
import EditPartModal from './modals/part/EditPartModal';
// import DeleteConfirmationModal from './modals/parts/DeleteConfirmationModal';

interface PartI {
  id: 1;
  predefined_part: 1;
  predefined_part_name: string;
  predefined_part_description: string;
  price: string;
}

interface PartTableProps {
  searchText: string;
  rows: PartI[];
  rowsPerPage?: number;
  loading: boolean;
  carId: number;
}

const PartTable = ({ searchText, rows, rowsPerPage = 20, loading, carId }: PartTableProps): ReactElement => {
  const apiRef = useGridApiRef();
  const [selectedPart, setSelectedPart] = useState<PartI | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const columns: GridColDef<PartI>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'name',
      headerName: 'Name',
      renderCell: (params: GridRenderCellParams<PartI, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.predefined_part_name}`}
        </Typography>
      ),
      resizable: false,
      flex: 1,
      minWidth: 155,
    },
    {
      field: 'description',
      headerName: 'Description',
      renderCell: (params: GridRenderCellParams<PartI, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.predefined_part_description}`}
        </Typography>
      ),
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: 'price',
      headerName: 'Price',
      renderCell: (params: GridRenderCellParams<PartI, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.price}`}
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
            aria-label="Edit PartI"
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
            aria-label="Delete PartI"
          />
        </Tooltip>,
      ],
    },
  ];



  const handleOpenEditModal = useCallback((part: PartI) => {
    setSelectedPart(part);
    setEditModalOpen(true);
  }, []);

  const handleOpenDeleteModal = useCallback((part: PartI) => {
    setSelectedPart(part);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedPart(null);
  }, []);

  const handleSavePart = useCallback(() => {
    console.log('Saving updated PartI');
    handleCloseModals();
  }, [handleCloseModals]);

  const handleDeletePart = useCallback((partId: number) => {
    console.log('Deleting PartI with ID:', partId);
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
      {selectedPart && (
        <>
          {/* <ViewDetailsModal
            open={isViewModalOpen}
            onClose={handleCloseModals}
            partId={selectedPart.id}
          /> */}
          <EditPartModal
            open={isEditModalOpen}
            onClose={handleCloseModals}
            onSave={handleSavePart}
            part={selectedPart}
            carId={carId}
          />
          {/* <DeleteConfirmationModal
            open={isDeleteModalOpen}
            onClose={handleCloseModals}
            onConfirm={() => handleDeletePart(selectedPart.id)}
            part={selectedPart}
          /> */}
        </>
      )}
    </>
  );
};

export default PartTable;
