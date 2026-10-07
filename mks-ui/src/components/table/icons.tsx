import { createSvgIcon } from "@mui/material";

// Same path data as @mui/icons-material KeyboardArrowLeft/Right, which the
// mks_webapp component used. Inlined so the package does not need
// @mui/icons-material as a peer dependency.
export const KeyboardArrowLeftIcon = /* @__PURE__ */ createSvgIcon(
  <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z" />,
  "KeyboardArrowLeft",
);

export const KeyboardArrowRightIcon = /* @__PURE__ */ createSvgIcon(
  <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />,
  "KeyboardArrowRight",
);
