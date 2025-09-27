import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Pagination, ThemeProvider, createTheme } from '@mui/material';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

interface ReusableTableProps<T> {
  isPagination: boolean;
  columns: any[];
  count?: number;
  currentPage?: number;
  data: T[];
  isLoading?: boolean;
  error?: FetchBaseQueryError | SerializedError | undefined;
  enableRowSelection?: boolean;
  actions?: (table: any) => React.ReactNode;
  onChangePage?: (event: React.ChangeEvent<unknown>, newPage: number) => void;
}

// Export function remains unchanged
export const handleExportRows = <T extends object>(
  rows: T[],
  columns: any[],
  fileName: string = 'exported-data.pdf'
) => {
  const doc = new jsPDF();
  const tableData = rows.map((row) => Object.values(row));
  const tableHeaders = columns.map((c) => c.header);

  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
  });

  doc.save(fileName);
};

const TableComponent = <T extends object>({
  columns,
  isPagination,
  count,
  data,
  isLoading = false,
  error,
  enableRowSelection = false,
  onChangePage,
}: ReusableTableProps<T>) => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const isCollapse = useSelector((state: RootState) => state.ui.isCollapse);
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#1f2937" : "#ffffff",
        paper: darkMode ? "#1f2937" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000",
      },
    },
  });

  const table = useMaterialReactTable({
    columns,
    data,
    state: {
      showSkeletons: isLoading,
      isLoading,
      showAlertBanner: Boolean(error),
      showGlobalFilter: true,
      density: 'compact',
    },
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableFilters: true,
    enableRowSelection,
    enableBottomToolbar: true,
    enablePagination: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableColumnPinning: true,
    manualPagination: true,
    pageCount: Math.ceil((count ?? 0) / 10),
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      // columnPinning: {
      //   right: ["actions"],
      // },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: "500px",
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '5px',
        maxWidth: isCollapse ? "1450px" : "1210px",
        transition: "max-width 0.5s ease-in-out",
      },
    },
    muiTableBodyCellProps: ({ column }) => ({
      sx: {
        color: darkMode ? '#ffffff' : '#000000',
        backgroundColor: column.getIsPinned()
          ? (darkMode ? '#4B5563' : '#ffffff') // Customize pinned column color
          : (darkMode ? '#1f2937' : '#ffffff'),
        ":hover": {
          backgroundColor: column.getIsPinned()
            ? (darkMode ? '#6B7280' : '#D1D5DB') // Customize pinned column hover color
            : (darkMode ? '#374151' : '#F6EFFF'),
        },
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        color: darkMode ? '#ffffff' : '#000000',
        backgroundColor: darkMode ? '#374151' : '#ffffff',
      },
    },
    muiTableFooterCellProps: {
      sx: {
        color: darkMode ? '#ffffff' : '#000000',
        backgroundColor: darkMode ? '#374151' : '#ffffff',
      },
    },
    muiTableFooterRowProps: {
      sx: {
        backgroundColor: darkMode ? '#37d4151' : '#ffffff',
      },
    },
    mrtTheme: () => ({
      baseBackgroundColor: darkMode ? '#374151' : '#8185BD80',

    }),
  });

  return (
    <div className='relative'>
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          table={table}
        />
        {isPagination && <div className='absolute bottom-[10px] left-2 z-50'>
          <Pagination
            sx={{
              '& .MuiPaginationItem-root': {
                color: darkMode ? '#ffffff' : '#000000',
              },
              '& .MuiPaginationItem-page:hover': {
                backgroundColor: darkMode ? '#6B7280' : '#D1D5DB',
              },
              '& .Mui-selected': {
                backgroundColor: darkMode ? '#4B5563' : '#fffff',
                color: darkMode ? '#ffffff' : '#000000',
              },
            }}
            count={count}
            onChange={onChangePage}
            variant="outlined"
            shape="rounded" />
        </div>}
      </ThemeProvider>
    </div>
  );
};

export default TableComponent;
