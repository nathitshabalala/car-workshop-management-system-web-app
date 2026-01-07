import { useMemo, useEffect, ReactElement, useState } from 'react';
import { Tooltip, CircularProgress } from '@mui/material';
import {
  GridApi,
  DataGrid,
  GridSlots,
  GridColDef,
  useGridApiRef,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { rows } from 'data/service-data';
import IconifyIcon from 'components/base/IconifyIcon';
import CustomPagination from 'components/common/CustomPagination';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';
import ServiceInfoModal from './modals/ServiceInfoModal';

const ServiceTable = ({ searchText }: { searchText: string }): ReactElement => {
  const columns: GridColDef<any>[] = [
    {
      field: 'id',
      headerName: 'ID',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'name',
      headerName: 'Name',
      resizable: false,
      minWidth: 60,
    },
    {
      field: 'customer',
      headerName: 'Customer',
      valueGetter: (params: any) => {
        return params;
      },
      minWidth: 180,
    },
    {
      field: 'car',
      headerName: 'Car',
      resizable: false,
      flex: 0.5,
      minWidth: 180,
    },
    {
      field: 'status',
      headerName: 'Status',
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
      getActions: (params) => {
        return [
          <Tooltip title="Info">
            <GridActionsCellItem
              icon={
                <IconifyIcon
                  icon="mingcute:information-fill"
                  color="text.secondary"
                  sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
                />
              }
              label="Edit"
              onClick={() => handleInfoClick(params.row)}
              size="small"
             />
           </Tooltip>,
          // <Tooltip title="Edit">
          //   <GridActionsCellItem
          //     icon={
          //       <IconifyIcon
          //         icon="fluent:edit-32-filled"
          //         color="text.secondary"
          //         sx={{ fontSize: 'body1.fontSize', pointerEvents: 'none' }}
          //       />
          //     }
          //     label="Edit"
          //     size="small"
          //   />
          // </Tooltip>,
        ];
      },
    },
  ];

  const apiRef = useGridApiRef<GridApi>();
  const [modalOpen, setInfoModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>();

  const handleInfoClick = (service: any) => {
    setSelectedService(service);
    setInfoModalOpen(true);
  };

  const handleCloseModal = () => {
    setInfoModalOpen(false);
    setSelectedService(undefined);
  };

  const visibleColumns = useMemo(
    () => columns.filter((column) => column.field !== 'id'),
    [columns],
  );

  useEffect(() => {
    apiRef.current.setQuickFilterValues(
      searchText.split(/\b\W+\b/).filter((word: string) => word !== ''),
    );
  }, [searchText]);

  useEffect(() => {
    const handleResize = () => {
      if (apiRef.current) {
        apiRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [apiRef]);

  return (
    <>
      <DataGrid
        apiRef={apiRef}
        density="standard"
        columns={visibleColumns}
        autoHeight={false}
        rowHeight={56}
        checkboxSelection
        disableColumnMenu
        disableRowSelectionOnClick
        rows={rows}
        onResize={() => {
          apiRef.current.autosizeColumns({
            includeOutliers: true,
            expand: true,
          });
        }}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 4 } },
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
      <ServiceInfoModal
        open={modalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </>
  );
};

export default ServiceTable;
