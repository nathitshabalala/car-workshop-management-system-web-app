import { useMemo, useEffect, ReactElement, useState, useRef, useCallback } from 'react';
import {  Tooltip, Typography, CircularProgress } from '@mui/material';
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
import ViewDetailDialog from './modals/ViewDetailsModal';
import { Task } from 'api';

interface TaskTableProps {
  searchText: string;
  rows: Task[];
  rowsPerPage?: number;
  loading: boolean; 
}

const TaskTable = ({ searchText, rows, rowsPerPage = 4, loading }: TaskTableProps): ReactElement => {
  const apiRef = useGridApiRef();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const columns: GridColDef<Task>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'description',
      headerName: 'Description',
      renderCell: (params: GridRenderCellParams<Task, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.description}`}
        </Typography>
      ),
      resizable: false,
      flex: 1,
      minWidth: 155,
    },
    {
      field: 'mechanic',
      headerName: 'Mechanic',
      renderCell: (params: GridRenderCellParams<Task, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.assigned_to.user.name} ${params.row.assigned_to.user.surname}`}
        </Typography>
      ),
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: 'car',
      headerName: 'Car',
      renderCell: (params: GridRenderCellParams<Task, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.service.car.predefined_car.make} ${params.row.service.car.predefined_car.model} ${params.row.service.car.predefined_car.year} (${params.row.service.car.reg_no})`}
        </Typography>
      ),
      resizable: false,
      flex: 1,
      minWidth: 115,
    },
    {
      field: 'Service',
      headerName: 'service',
      sortable: false,
      resizable: false,
      flex: 1,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams<Task, any, any, GridTreeNodeWithRender>) => (
        <Typography variant="body2">
          {`${params.row.service.service_type.name}`}
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
            aria-label="View Task details"
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
            aria-label="Edit Task"
          />
        </Tooltip>,
        // <Tooltip title="Delete">
        //   <GridActionsCellItem
        //     icon={
        //       <IconifyIcon
        //         icon="mingcute:delete-3-fill"
        //         color="error.main"
        //         sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
        //       />
        //     }
        //     label="Delete"
        //     onClick={() => handleOpenDeleteModal(params.row)}
        //     size="small"
        //     aria-label="Delete Task"
        //   />
        // </Tooltip>,
      ],
    },
  ];

  const handleOpenViewModal = useCallback((task: Task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((task: Task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  }, []);

  // const handleOpenDeleteModal = useCallback((task: Task) => {
  //   setSelectedTask(task);
  // }, []);

  const handleCloseModals = useCallback(() => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedTask(null);
  }, []);

  const handleSaveTask = useCallback(() => {
    console.log('Saving updated Task');
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
      {selectedTask && (
        <>
          <ViewDetailDialog
            open={isViewModalOpen}
            onClose={handleCloseModals}
            task={selectedTask}
          />
          {/* <EditTaskModal
            open={isEditModalOpen}
            onClose={handleCloseModals}
            onSave={handleSaveTask}
            task={selectedTask}
          /> */}
        </>
      )}
    </>
  );
};

export default TaskTable;
