/**
 * 导出文件，模板格式
 */

// html
export const templateHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{%template-title%}</title>
<link rel="stylesheet" href="https://stackedit.io/style.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.0.1/styles/atom-one-dark.css" />
<style type="text/css">.hljs {overflow-x: auto;padding: 0.5em;}</style>
</head>

<body class="stackedit">
<div class="stackedit__html">{%template-content%}</div>
</body>

</html>`
