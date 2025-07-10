"use client";
import * as React from "react";
import {
  Box,
  Table,
  Typography,
  Sheet,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Link,
  Tooltip,
  Select,
  Option,
} from "@mui/joy";
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  ArrowDownward as ArrowDownwardIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  Stop as StopIcon,
} from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IEvent } from "@/store/slices/eventSlice";
import { DateTime } from "luxon";

// ---------- Sorting Utilities ----------
function labelDisplayedRows({
  from,
  to,
  count,
}: {
  from: number;
  to: number;
  count: number;
}) {
  return `${from}–${to} of ${count}`;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ---------- Table Header ----------
interface HeadCell {
  disablePadding: boolean;
  id: keyof IEvent;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: "summary", numeric: false, disablePadding: true, label: "Event Name" },
  {
    id: "eventType",
    numeric: true,
    disablePadding: false,
    label: "Event Type",
  },
  { id: "start", numeric: true, disablePadding: false, label: "Event Time" },
  { id: "end", numeric: true, disablePadding: false, label: "Event Start in" },
  { id: "status", numeric: true, disablePadding: false, label: "Call Status" },
  { id: "createdAt", numeric: true, disablePadding: false, label: "Create At" },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IEvent
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler =
    (property: keyof IEvent) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <thead>
      <tr>
        <th>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                "aria-label": "select all events",
              },
            }}
            sx={{ verticalAlign: "sub" }}
          />
        </th>
        {headCells.map((headCell) => {
          const active = orderBy === headCell.id;
          return (
            <th
              key={headCell.id}
              aria-sort={
                active
                  ? ({ asc: "ascending", desc: "descending" } as const)[order]
                  : undefined
              }
            >
              <Link
                underline="none"
                color="neutral"
                textColor={active ? "primary.plainColor" : undefined}
                component="button"
                onClick={createSortHandler(headCell.id)}
                startDecorator={
                  headCell.numeric && (
                    <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                  )
                }
                endDecorator={
                  !headCell.numeric && (
                    <ArrowDownwardIcon sx={{ opacity: active ? 1 : 0 }} />
                  )
                }
                sx={{
                  fontWeight: "lg",
                  "& svg": {
                    transition: "0.2s",
                    transform:
                      active && order === "desc"
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                  },
                  "&:hover": { "& svg": { opacity: 1 } },
                }}
              >
                {headCell.label}
                {active && (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                )}
              </Link>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

// ---------- Table Toolbar ----------
interface EnhancedTableToolbarProps {
  numSelected: number;
}
function EnhancedTableToolbar({ numSelected }: EnhancedTableToolbarProps) {
  return (
    <Box
      sx={[
        {
          display: "flex",
          alignItems: "center",
          py: 1,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          borderTopLeftRadius: "var(--unstable_actionRadius)",
          borderTopRightRadius: "var(--unstable_actionRadius)",
        },
        numSelected > 0 && {
          bgcolor: "background.level1",
        },
      ]}
    >
      <Typography sx={{ flex: "1 1 100%" }} component="div">
        {numSelected > 0 ? `${numSelected} selected` : "Events"}
      </Typography>
      <Tooltip title={numSelected > 0 ? "Delete" : "Filter list"}>
        <IconButton
          size="sm"
          color={numSelected > 0 ? "danger" : "neutral"}
          variant={numSelected > 0 ? "solid" : "outlined"}
        >
          {numSelected > 0 ? <DeleteIcon /> : <FilterListIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ---------- Main Table Component ----------
const TableSortAndSelection = () => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof IEvent>("start");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const events: IEvent[] = useSelector(
    (state: RootState) => state.events.events ?? []
  );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IEvent
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = events.map((event) => event.summary);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, name];
    } else {
      newSelected = selected.filter((s) => s !== name);
    }

    setSelected(newSelected);
  };

  const handleChangePage = (newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    _: React.SyntheticEvent | null,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      setRowsPerPage(newValue);
      setPage(0);
    }
  };

  const getLabelDisplayedRowsTo = () =>
    rowsPerPage === -1
      ? events.length
      : Math.min(events.length, (page + 1) * rowsPerPage);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - events.length) : 0;

  if (!events.length) return <></>;

  return (
    <Sheet
      variant="outlined"
      sx={{ width: "100%", boxShadow: "sm", borderRadius: "sm" }}
    >
      <EnhancedTableToolbar numSelected={selected.length} />
      <Table
        aria-labelledby="tableTitle"
        hoverRow
        sx={{
          "--TableCell-headBackground": "transparent",
          "--TableCell-selectedBackground": (theme) =>
            theme.vars.palette.success.softBg,
          "& thead th:nth-child(1)": { width: "40px" },
          "& thead th:nth-child(2)": { width: "20%" },
          "& tr > *:nth-child(n+3)": { textAlign: "center" },
        }}
      >
        <EnhancedTableHead
          numSelected={selected.length}
          order={order}
          orderBy={orderBy}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={events.length}
        />
        <tbody>
          {[...events]
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => {
              const isItemSelected = selected.includes(row.summary);
              const labelId = `enhanced-table-checkbox-${index}`;
              const eventStart = DateTime.fromISO(row.start);
              const now = DateTime.now();
              const isUpcoming = eventStart > now;
              const timeDiff = eventStart.toRelative();
              const minutesLeft = eventStart.diffNow("minutes").minutes;

              let statusColor = "gray";
              if (!isUpcoming) statusColor = "gray";
              else if (minutesLeft <= 5) statusColor = "orange";
              else statusColor = "green";

              return (
                <tr
                  onClick={(event) => handleClick(event, row.summary)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.summary}
                  style={
                    isItemSelected
                      ? ({
                          "--TableCell-dataBackground":
                            "var(--TableCell-selectedBackground)",
                          "--TableCell-headBackground":
                            "var(--TableCell-selectedBackground)",
                        } as React.CSSProperties)
                      : {}
                  }
                >
                  <th scope="row">
                    <Checkbox
                      checked={isItemSelected}
                      slotProps={{ input: { "aria-labelledby": labelId } }}
                      sx={{ verticalAlign: "top" }}
                    />
                  </th>
                  <th id={labelId} scope="row">
                    {row.summary}
                  </th>
                  <td>{row.eventType}</td>
                  <td>
                    {DateTime.fromISO(row.start).toFormat(
                      "dd LLL yyyy, hh:mm a"
                    )}
                  </td>
                  <td style={{ color: statusColor }}>
                    {isUpcoming ? timeDiff : "Event Over"}
                  </td>
                  <td>
                    <span
                      className={`flex justify-center items-center gap-1 py-1 rounded-full text-sm font-medium ${
                        row.status === "Done"
                          ? "text-gray-600 bg-gray-200"
                          : row.status === "Not Done"
                          ? "text-orange-600 bg-orange-100"
                          : row.status === "Failed"
                          ? "text-white bg-red-800"
                          : row.status === "In Progress"
                          ? "text-orange-600 bg-orange-100"
                          : "text-green-700 bg-green-100"
                      }`}
                    >
                      {row.status === "Done" && (
                        <CheckCircleIcon fontSize="small" />
                      )}
                      {row.status === "Not Done" && (
                        <StopIcon fontSize="small" />
                      )}
                      {row.status === "Failed" && <StopIcon fontSize="small" />}
                      {row.status === "Upcoming" && (
                        <ScheduleIcon fontSize="small" />
                      )}
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {DateTime.fromISO(row.createdAt).toFormat(
                      "dd LLL yyyy, hh:mm a"
                    )}
                  </td>
                </tr>
              );
            })}
          {emptyRows > 0 && (
            <tr
              style={
                {
                  height: `${emptyRows * 40}px`,
                  "--TableRow-hoverBackground": "transparent",
                } as React.CSSProperties
              }
            >
              <td colSpan={7} aria-hidden />
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <FormControl orientation="horizontal" size="sm">
                  <FormLabel>Rows per page:</FormLabel>
                  <Select<number>
                    onChange={handleChangeRowsPerPage}
                    value={rowsPerPage}
                  >
                    <Option value={5}>5</Option>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                  </Select>
                </FormControl>
                <Typography sx={{ textAlign: "center", minWidth: 80 }}>
                  {labelDisplayedRows({
                    from: events.length === 0 ? 0 : page * rowsPerPage + 1,
                    to: getLabelDisplayedRowsTo(),
                    count: events.length,
                  })}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={page === 0}
                    onClick={() => handleChangePage(page - 1)}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    disabled={
                      page >= Math.ceil(events.length / rowsPerPage) - 1
                    }
                    onClick={() => handleChangePage(page + 1)}
                  >
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </Box>
              </Box>
            </td>
          </tr>
        </tfoot>
      </Table>
    </Sheet>
  );
};

export default TableSortAndSelection;
