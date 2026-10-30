import { layout } from '../theme/tokens';

export const TABLET_CONTENT_MAX_WIDTH = 1320;
export const TABLET_FORM_MAX_WIDTH = 640;
export const TABLET_BODY_MAX_WIDTH = 1160;
export const GRID_CARD_MAX_WIDTH = 220;
export const GRID_COLUMN_GAP = 20;

export function getProductGridMetrics(windowWidth) {
  const containerWidth = Math.min(windowWidth, TABLET_CONTENT_MAX_WIDTH);
  const availableWidth = containerWidth - layout.gridPadding * 2;
  let numColumns = Math.max(
    windowWidth < 360 ? 1 : 2,
    Math.floor((availableWidth + GRID_COLUMN_GAP) / (GRID_CARD_MAX_WIDTH + GRID_COLUMN_GAP))
  );
  numColumns = Math.min(5, numColumns);

  // Add another column only while cards remain large enough to scan comfortably.
  while (
    numColumns < 5 &&
    (availableWidth - GRID_COLUMN_GAP * numColumns) / (numColumns + 1) >= 190
  ) {
    numColumns += 1;
  }

  const cardSize = Math.min(
    GRID_CARD_MAX_WIDTH,
    (availableWidth - GRID_COLUMN_GAP * (numColumns - 1)) / numColumns
  );

  return { containerWidth, numColumns, cardSize };
}
