# Uploaded ZIP source audit

## Input and extraction

- The repository initially contained the split upload `ezyZip.z01` and `ezyZip.zip`.
- The final ZIP part contains `logistico-master.zip`; the split archive was reconstructed and the inner ZIP was fully extracted for inspection.
- Extracted source: 295 files, approximately 33 MB. The complete archive tree was printed in the conversation before implementation code was written.
- The extracted source is a static Colorlib “Logistico” transportation HTML theme, not an existing Gideon Fleet or Next.js application.

## Source design findings

### Page structure and visual language

The reference is a conventional responsive transport-company theme with these pages: `index.html`, `about.html`, `service.html`, `service_details.html`, `contact.html`, `blog.html`, `single-blog.html`, `elements.html`, plus a `Logistico doc/index.html` documentation page. The home page contains a header and navigation, hero, three value/service callouts, service cards, company/about content, counters, testimonials, an estimate form, and a footer. Its copy and contact data are placeholder content (for example “Global Logistic Service For Business,” Ocean Freight, `info@docmed.com`, and a New York address).

The main theme uses Poppins, deep navy headings (`#001D38`), orange-red actions (`#FF3414`), warm orange accents (`#FDAE5C`, `#FD8E5E`), pale blue surfaces (`#F5FBFF`), muted blue-gray copy (`#596672`, `#727272`, `#919191`), and light borders (`#E8E8E8`). The main hero heading is 60px on desktop in the original theme. Body copy is generally 15–16px; section titles reach 46px. Section vertical padding commonly uses 120px. The source uses 10px card/image rounding, 30px pill rounding, 5px buttons in some areas, and a header shadow of `0px 3px 16px 0px rgba(0, 0, 0, 0.1)`. These source values guide the rebuilt design; the source logo/images and icon-font packs are not changed.

The source Sass design-token values, relevant to the rebuilt palette, include `$heading-color: #1F1F1F`, `$gray-color: #bebebe`, `$gray-color-2: #bdbdbd`, `$theme-color: #1F1F1F`, `$theme-color2: #ff5e13`, `$gray-color3: #5c5c5c`, `$white_color: #fff`, `$font_1: #666666`, `$font_2: #646464`, `$font_3: #7f7f7f`, `$font_4: #8a8a8a`, `$font_5: #999999`, `$font_6: #666666`, `$font_7: #5c5c5c`, `$border_color: #fdcb9e`, `$footer_bg: #303030`, `$sidebar_bg: #fbf9ff`, `$btn_bg: #FF3414`, `$btn_hover: #f5790b`, `$section_bg: #f7f7f7`, `$section_bg_1: #454545`, `$heading_color: #191d34`, and `$heading_color2: #ff8b23`.

### CSS custom properties — verbatim from the ZIP

The only CSS custom-property block found in the theme CSS/SCSS is Bootstrap's `:root` block in `css/bootstrap.min.css`; the transportation theme itself uses Sass variables instead. The declaration text is preserved verbatim below (including Bootstrap's missing final semicolon):

```css
:root {
    --blue: #007bff;
    --indigo: #6610f2;
    --purple: #6f42c1;
    --pink: #e83e8c;
    --red: #dc3545;
    --orange: #fd7e14;
    --yellow: #ffc107;
    --green: #28a745;
    --teal: #20c997;
    --cyan: #17a2b8;
    --white: #fff;
    --gray: #6c757d;
    --gray-dark: #343a40;
    --primary: #007bff;
    --secondary: #6c757d;
    --success: #28a745;
    --info: #17a2b8;
    --warning: #ffc107;
    --danger: #dc3545;
    --light: #f8f9fa;
    --dark: #343a40;
    --breakpoint-xs: 0;
    --breakpoint-sm: 576px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 992px;
    --breakpoint-xl: 1200px;
    --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace
}
```

### Fonts and font-face rules

Poppins is **not** a local font file in the ZIP. The production stylesheet imports it twice and the source Sass variables file imports it once:

```css
@import url("https://fonts.googleapis.com/css?family=Poppins:200,200i,300,300i,400,400i,500,500i,600,600i,700&display=swap");
```

The requested Poppins weights are 200, 300, 400, 500, 600, and 700; italic variants are requested for 200, 300, 400, 500, and 600. The page body and headings use `"Poppins", sans-serif`. The documentation page uses Lato and links `http://fonts.googleapis.com/css?family=Lato:300,400,700`; Lato is also not stored locally.

Local font-file inventory (paths relative to `logistico-master/`):

- `fonts/Flaticon.eot`, `fonts/Flaticon.svg`, `fonts/Flaticon.ttf`, `fonts/Flaticon.woff`, `fonts/Flaticon.woff2`
- `fonts/FontAwesome.otf`
- `fonts/fa-brands-400.eot`, `.svg`, `.ttf`, `.woff`, `.woff2`
- `fonts/fa-regular-400.eot`, `.svg`, `.ttf`, `.woff`, `.woff2`
- `fonts/fa-solid-900.eot`, `.svg`, `.ttf`, `.woff`, `.woff2`
- `fonts/fontawesome-webfont.eot`, `.svg`, `.ttf`, `.woff`, `.woff2`
- `fonts/gijgo-material.eot`, `.svg`, `.ttf`, `.woff`
- `fonts/themify.eot`, `.svg`, `.ttf`, `.woff`
- `Logistico doc/fonts/FontAwesome.otf`
- `Logistico doc/fonts/fontawesome-webfont.eot`, `.svg`, `.ttf`, `.woff`

The Font Awesome `fa-brands-400`, `fa-regular-400`, and `fa-solid-900` files are present but not referenced by a font-face rule in the supplied stylesheet. The `.otf` files are also present without a font-face rule. Font Awesome's CSS references its `fontawesome-webfont` files. The relevant `@font-face` rules found in the archive are reproduced below; duplicate Flaticon rules are retained because the ZIP contains them in two stylesheets.

`css/flaticon.css`:

```css
@font-face {
		font-family: "Flaticon";
		src: url("../fonts/Flaticon.eot");
		src: url("../fonts/Flaticon.eot");
		src: url("../fonts/Flaticon.eot?#iefix") format("embedded-opentype"),
			 url("../fonts/Flaticon.woff2") format("woff2"),
			 url("../fonts/Flaticon.woff") format("woff"),
			 url("../fonts/Flaticon.ttf") format("truetype"),
			 url("../fonts/Flaticon.svg#Flaticon") format("svg");
		font-weight: normal;
		font-style: normal;
	  }

@font-face {
		  font-family: "Flaticon";
		  src: url("./Flaticon.svg#Flaticon") format("svg");
		}
```

`fonts/flaticon.css` has the same family/weight and formats, with relative URLs rooted in `./`:

```css
@font-face {
  font-family: "Flaticon";
  src: url("./Flaticon.eot");
  src: url("./Flaticon.eot?#iefix") format("embedded-opentype"),
       url("./Flaticon.woff2") format("woff2"),
       url("./Flaticon.woff") format("woff"),
       url("./Flaticon.ttf") format("truetype"),
       url("./Flaticon.svg#Flaticon") format("svg");
  font-weight: normal;
  font-style: normal;
}

@font-face {
    font-family: "Flaticon";
    src: url("./Flaticon.svg#Flaticon") format("svg");
  }
```

`css/font-awesome.min.css` (Font Awesome 4.7.0):

```css
@font-face{font-family:'FontAwesome';src:url('../fonts/fontawesome-webfont.eot?v=4.7.0');src:url('../fonts/fontawesome-webfont.eot?#iefix&v=4.7.0') format('embedded-opentype'),url('../fonts/fontawesome-webfont.woff2?v=4.7.0') format('woff2'),url('../fonts/fontawesome-webfont.woff?v=4.7.0') format('woff'),url('../fonts/fontawesome-webfont.ttf?v=4.7.0') format('truetype'),url('../fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular') format('svg');font-weight:normal;font-style:normal}
```

`Logistico doc/css/font-awesome.min.css` (Font Awesome 4.1.0):

```css
@font-face{font-family:'FontAwesome';src:url('../fonts/fontawesome-webfont.eot?v=4.1.0');src:url('../fonts/fontawesome-webfont.eot?#iefix&v=4.1.0') format('embedded-opentype'),url('../fonts/fontawesome-webfont.woff?v=4.1.0') format('woff'),url('../fonts/fontawesome-webfont.ttf?v=4.1.0') format('truetype'),url('../fonts/fontawesome-webfont.svg?v=4.1.0#fontawesomeregular') format('svg');font-weight:normal;font-style:normal}
```

`css/gijgo.css`:

```css
@font-face {
    font-family: 'gijgo-material';
    src: url('../fonts/gijgo-material.eot?235541');
    src: url('../fonts/gijgo-material.eot?235541#iefix') format('embedded-opentype'), url('../fonts/gijgo-material.ttf?235541') format('truetype'), url('../fonts/gijgo-material.woff?235541') format('woff'), url('../fonts/gijgo-material.svg?235541#gijgo-material') format('svg');
    font-weight: normal;
    font-style: normal;
}
```

`css/themify-icons.css`:

```css
@font-face {
	font-family: 'themify';
	src:url('../fonts/themify.eot?-fvbane');
	src:url('../fonts/themify.eot?#iefix-fvbane') format('embedded-opentype'),
		url('../fonts/themify.woff?-fvbane') format('woff'),
		url('../fonts/themify.ttf?-fvbane') format('truetype'),
		url('../fonts/themify.svg?-fvbane#themify') format('svg');
	font-weight: normal;
	font-style: normal;
}
```

All four icon-face families above declare `font-weight: normal` (400) and `font-style: normal`, apart from the legacy duplicate Flaticon SVG-only rules that omit weight/style and inherit defaults. The implementation uses the supplied Poppins family and requested Lucide icons; it does not edit or transform any archived font asset.

## Requested component audit: source presence vs. required fallback

The listed feature checks were searched across the complete extracted archive, including the HTML, CSS/SCSS, JavaScript, and filenames. If marked absent below, there is no component or behavior to copy from the ZIP. The fallback listed is the supplied Gideon Fleet requirement, not a claim about source behavior.

| Feature | ZIP finding | Required implementation behavior when absent |
|---|---|---|
| Loading screen / wordmark | No preloader, progress display, or animated brand mark | Branded SVG truck preloader; complete in under 2 seconds; reveal a skip control after 3 seconds if still present; announce `Site loaded` on completion; percentage counter in reduced-motion mode. Draw the Gideon wordmark once using a runtime-computed path length and `stroke-dashoffset`; persist its drawn state and reuse it in the preloader. |
| Cookie consent | No banner, preference panel, or local-storage consent logic | Fixed full-width bottom banner, exact supplied copy and Cookie Policy link; Accept All and Manage Preferences; Necessary locked on plus Functional, Analytics, Marketing toggles; persist locally and do not repeat after consent. |
| CAPTCHA | No Google reCAPTCHA scripts or server checks | reCAPTCHA v3 on each form/waybill submission, server-side verification in each relevant API route; show the v2 challenge when v3 score is below 0.5. Secret remains server-only. |
| Privacy policy | No privacy-policy page | `/legal/privacy-policy`, full page with Shipment Data, GPS Tracking Data, Driver Data, Analytics Partners, Your Rights, Data Retention, Contact. |
| Terms | No terms page | `/legal/terms`, full page with Freight Service Agreement, Liability and Insurance, Payment Terms, Route and Schedule Disclaimer, Governing Law Kenya. |
| 404 | No custom 404 page | Gideon-branded `This route could not be found.` page, `Return to Homepage` CTA, bounded gooey SVG spill animation that never filters text. |
| 500 | No custom 500 page | Gideon-branded `Our system is temporarily down. Your shipment data is safe.` page, Try Again control, visible WhatsApp support number. |
| API routes | No Next/API route files. The only form-processing filename is `contact_process.php`, referenced by the static contact page. | Build the specified App Router endpoints: `/api/quote`, `/api/track`, `/api/partner`, `/api/news`, `/api/newsletter`, `/api/contact`, `/api/captcha`, `/api/ws`. Each endpoint will have its own documented request/response handling; CAPTCHA-protected user submissions will verify server-side. |
| Locked package versions | No `package.json`, npm/yarn/pnpm lockfile, or package directory exists. The archive has vendor artifacts, not a Node dependency lock. Discoverable vendor labels include Bootstrap 4.0.0, Font Awesome 4.7.0 (4.1.0 in the docs), jQuery 1.12.4 (plus 1.11.0 in docs), Modernizr 3.5.0, and jQuery UI theme 1.11.2. | Use the user-specified Next.js 15.1.0 / Node 24.0.0 requirements and pin implementation dependencies in a generated lockfile. |
| Environment variables | None found; there are no `.env` files or environment-variable references in the source. | Keep credentials in the server environment; document the names added for the implementation in its `.env.example`. |

## Scope note

No Canva URL or alternate design reference was included. This audit uses the ZIP as the design source and records its omissions explicitly. When the source did not contain one of the requested production features, the implementation follows the corresponding fallback in the supplied Gideon Fleet specification.
