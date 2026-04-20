<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat" indent="yes" />

  <xsl:template match="/rss">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title><xsl:value-of select="channel/title" /> — RSS feed</title>
        <style>
          :root {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #1a1a1a;
            background: #fafafa;
          }
          body { max-width: 720px; margin: 0 auto; padding: 32px 20px 64px; line-height: 1.6; }
          .banner {
            background: #eaf3fb;
            border: 1px solid #b6d4ec;
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 28px;
            font-size: 15px;
            color: #1a3c5e;
          }
          .banner strong { color: #0d2a47; }
          .banner code {
            background: #fff;
            border: 1px solid #c5deee;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 13px;
            word-break: break-all;
          }
          .banner a { color: #0d47a1; font-weight: 600; }
          h1 {
            font-size: 28px;
            margin: 0 0 4px;
            color: #1a1a1a;
          }
          .description {
            font-size: 15px;
            color: #333;
            margin: 0 0 32px;
          }
          .item {
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            padding: 18px 20px;
            margin-bottom: 16px;
          }
          .item h2 {
            font-size: 17px;
            margin: 0 0 6px;
            color: #1a1a1a;
          }
          .item time {
            display: inline-block;
            font-size: 12px;
            color: #666;
            margin-bottom: 12px;
            font-variant: tabular-nums;
          }
          .item .body {
            font-size: 14px;
            color: #333;
            line-height: 1.5;
          }
          .item .body ul { padding-left: 20px; margin: 8px 0; }
          .item .body li { margin-bottom: 4px; }
          .item a { color: #1a73e8; }
          footer {
            margin-top: 32px;
            font-size: 13px;
            color: #666;
            text-align: center;
          }
          footer a { color: #1a73e8; }
        </style>
      </head>
      <body>
        <div class="banner">
          <strong>This is an RSS feed.</strong> Paste the URL of this page into
          any RSS reader (Feedly, NetNewsWire, Reeder, Inoreader, and similar)
          and you'll get notified automatically whenever the dashboard
          updates. Or head back to the
          <a>
            <xsl:attribute name="href">
              <xsl:value-of select="channel/link" />
            </xsl:attribute>
            dashboard home
          </a>.
        </div>
        <h1><xsl:value-of select="channel/title" /></h1>
        <div class="description"><xsl:value-of select="channel/description" /></div>
        <xsl:for-each select="channel/item">
          <article class="item">
            <h2><xsl:value-of select="title" /></h2>
            <time><xsl:value-of select="pubDate" /></time>
            <div class="body">
              <xsl:value-of select="description" disable-output-escaping="yes" />
            </div>
          </article>
        </xsl:for-each>
        <footer>
          Maintained by hand on a monthly cycle. Source:
          <a href="https://github.com/Sawatter/canada-under-carney">github.com/Sawatter/canada-under-carney</a>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
