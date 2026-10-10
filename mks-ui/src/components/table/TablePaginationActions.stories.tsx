import { Box, Paper, TablePagination, Typography } from "@mui/material";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TablePaginationActions } from "./TablePaginationActions.js";

const meta = {
  title: "Components / Table / Pagination actions",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function PaginationPreview({ count = 48, disabled = false }: { count?: number; disabled?: boolean }) {
  const [page, setPage] = useState(0);
  return (
    <Paper variant="outlined" sx={{ width: "min(100%, 560px)", overflow: "hidden", borderRadius: 3 }}>
      <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Recent activity</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Page {page + 1} of {Math.max(1, Math.ceil(count / 8))}
        </Typography>
      </Box>
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={8}
        rowsPerPageOptions={[8]}
        onPageChange={(_event, nextPage) => setPage(nextPage)}
        ActionsComponent={TablePaginationActions}
        disabled={disabled}
      />
    </Paper>
  );
}

export const Interactive: Story = {
  render: () => <PaginationPreview />,
};

export const Disabled: Story = {
  render: () => <PaginationPreview disabled />,
};

export const UnknownTotal: Story = {
  render: () => <PaginationPreview count={-1} />,
};
