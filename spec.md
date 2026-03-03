# Specification

## Summary
**Goal:** Replace the bottom navigation bar with a fixed left sidebar that shows icons with tooltips and displays the currently selected deity's image.

**Planned changes:**
- Remove the existing `BottomNav` bottom navigation component and replace it with a fixed left sidebar navigation.
- Each nav item in the sidebar shows only an icon; hovering reveals a tooltip with the localized item name.
- Highlight the active nav item using the existing saffron/gold and deep indigo spiritual theme.
- Offset the main content area to the right to accommodate the sidebar width.
- Add a dedicated image slot in the sidebar that displays the currently selected deity's image using `object-contain` styling so the full image is visible without cropping.
- Hide the image slot or show a placeholder when no deity is selected; update the image when a different deity is chosen.

**User-visible outcome:** Users see a narrow icon-only left sidebar with tooltips for navigation and their selected god's image displayed in full within the sidebar, replacing the previous bottom navigation bar.
