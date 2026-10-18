# Picture Packs

The template is saved in `../AE_AI_TempTEST.aep`, under `_Template > _TEMPLATE Picture Pack`.

- `_TEMPLATE_zoom`: the existing 1920 × 2160 design, with its text, matte, and parent null preserved.
- `_TEMPLATE_Fscreen`: 3840 × 2160, with the whole picture centered and ending its zoom at the 10% title-safe margins, your patterned background, and a black overlay at 40% opacity.
- `PICTURE - replace to update both comps`: the single footage item used by both compositions.

The templates are 24 fps. The zoom template is 125 seconds; the full-screen template is 10 seconds. New full-screen compositions inherit the master template's current duration, frame rate, layers, effects, and animation. Its picture starts at 90% of its final title-safe size and reaches that size on the final frame. The overlay and background zoom with it, with full background coverage throughout.

## Open the controls

In After Effects, choose **File > Scripts > Run Script File…** and select `Picture Packs.jsx` in this folder. It opens a floating panel without restarting AE. You can reopen it from **File > Scripts > Recent Script Files**.

## Replace a picture

Choose a pack in the panel and click **Replace picture in both comps…**. Select a still image. Both views update and adapt to its dimensions automatically. The zoom caption updates from the matching entry in `picture_filenames.txt` beside the selected image.

Use the panel for automatic captions. AE's native **Replace Footage > File…** updates the image only and does not trigger this script.

## Make another independent pack

Choose a pack and click **Duplicate pack with new picture…**, enter a name, and select an image. This creates a new folder containing its own picture, zoom comp, and full-screen comp. The zoom layout comes from the selected pack. The full-screen layout always comes from the latest `_TEMPLATE_Fscreen`, even if you select an older pack. Replacing its picture does not affect other packs.

Keep the master named `_TEMPLATE_Fscreen`. Edit its design or duration whenever you want to change future full-screen packs. Existing packs keep their own designs and timing.

Use this button when duplicating a pair. Normal AE composition duplication continues sharing the original footage.

## Create several artwork packs at once

Choose the pack whose zoom layout you want, then click **Create packs from multiple artworks…**. In the file picker, use Command-click or Shift-click to select multiple images and click Open.

Each image creates an independent folder named from its filename, containing its own picture, zoom comp, and full-screen comp. Duplicate names get a numeric suffix. Full-screen views inherit the latest master, including its 10-second duration and title-safe zoom. The zoom title and artist/date update automatically from each image folder’s details file.

**Open both compositions for each new artwork** is unchecked by default, so batch creation leaves the new timeline tabs closed. Check it only if you want every new composition opened. The whole batch is one Undo operation. If an image fails, its incomplete pack is removed, other images continue, and the panel lists the failures. Save the AE project to keep the new packs.

## Automatic artwork captions

Put a UTF-8 file named exactly `picture_filenames.txt` beside your images. No episode path is stored in the script. Match each `File:` value exactly to its image filename, including the extension:

```text
1. File: artwork_one.jpg
Artist: Mary Cassatt
Artwork: The Child’s Bath
Date of creation: 1893
Display title: Optional shorter title
```

`Display title` is optional. Without it, the full `Artwork` title is used. The caption is two paragraphs: title, then `Artist, Date of creation`. Dates come from this file, not the image filename. Numbered entries, headers, Source/Note fields, accents, and date ranges are supported. Do not repeat filenames or required fields within an entry.

The script reads each folder’s catalog once per batch and rereads it for the next operation. A batch can use multiple folders with separate catalogs. Missing or unreadable details files, missing entries, and incomplete details do not block creation or replacement. Missing caption fields use `???`; known fields are retained. A pop-up lists the affected images and missing fields (one summary for a batch). Malformed or ambiguous catalogs use question marks rather than guessing. Missing image files and invalid image formats still fail normally.

Long captions keep the existing font sizes and box dimensions. If text overflows, the panel reports it; add a shorter `Display title` and use Replace picture again. It does not silently shrink text or rewrite artwork names. Changing the catalog alone does not update existing compositions.

## Adjust the design

- The panel changes only the words in the existing `Text` layer. Its title/credit styles, text box, transforms, effects, and background sizing expression are preserved. Manual caption edits are overwritten on the next picture replacement. Keep Source Text unanimated and retain the two paragraphs; other layer animation is preserved.
- Animate the existing parent null (`Null 6`) to pan or zoom. Picture fitting retains the original artwork footprint. Every replacement picture has its anchor at its top-left corner, so that corner stays at the picture layer's position regardless of image proportions.
- The full-screen picture's **Title-safe margin (%)** slider controls its fit; default 10%. The four added guides mark the default 10% margins and do not follow slider changes.
- Select **FULL SCREEN MOTION** and adjust **Zoom amount (%)** to change the shared slow zoom. Default 10 means the picture starts 10% smaller than its final title-safe size; 0 disables the zoom. The movement eases smoothly over the whole composition duration. The picture finishes at title safe and stays inside it throughout the zoom.
- You can change the full-screen composition dimensions in Composition Settings; centering and fitting follow its size automatically. Reposition the guides if you resize it.
- Save the AE project after changes. The panel's edits are grouped for Undo.

The `backups` folder contains the project saved before setup. `setup-template.jsx` is a one-time setup utility; `validate-packs.jsx` checks source independence and portrait/landscape fitting using temporary packs, then removes those packs.

`validate-captions.jsx` checks all ten sample artworks, separate paragraph styling, folder-specific catalogs, cache refresh, optional display titles, and invalid metadata using temporary packs and files, then cleans them up.
