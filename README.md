# Name2RGB Web

This is the React + Vite web version of the original command-line project. The source C implementation lives in [SolarianVulpine/nameToRGB](https://github.com/SolarianVulpine/nameToRGB), and this site keeps the same color math while presenting it in a browser-first interface.

## What It Does

- Converts first, middle, and last names into RGB values
- Uses the same C math as the command-line version
- Shows a live swatch, RGB breakdown, and hex code
- Lets you switch between three visual themes

## Project History

The original project was a C command-line app called Name Color Generator. It converts a person’s first, middle, and last names into RGB values and a hexadecimal color code, and it was inspired by an Instagram activity by [@jared\_\_cross](https://www.instagram.com/jared__cross/).

That original version included ASCII-art themes, a theme-selection prompt, and an `exit` path at each name prompt. This web version preserves the core conversion logic and the project’s origin, while moving the experience into a more interactive browser UI.

## Development

1. Open a terminal in `C:\Users\Admin\Repos\Name2RGB_WEB`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the local dev server:

   ```bash
   npm run dev
   ```

4. Open the local URL Vite prints in the terminal.

## Production Build

1. Create a production bundle:

   ```bash
   npm run build
   ```

2. Preview the built site locally:

   ```bash
   npm run preview
   ```

3. Deploy the generated `dist/` folder to any static host.

## Notes

- The web app uses React state and plain browser APIs, so no backend is required.
- The visual style is original, but it is intentionally tuned toward the clean, diegetic UI language you described.

### Favicon Credit

Art palette Icon by Vecteezy on <a href="https://icon-icons.com/authors/205-vecteezy">Icon-Icons.com</a>