# TODO

## Dangerous AI Skills: ungesicherte PyPI-Namen nachprüfen

Diese Namen nennt `lastmile-ai/mcp-agent` (Commit f62d849, `src/mcp_agent/cli/commands/server.py`) als `uvx`-Rezepte. Sie waren am 6. November 2026 auf PyPI frei. Gesichert sind nur `context7-mcp`, `mcp-server-arxiv`, `mcp-server-azure` und `mcp-server-discord` (quarantäniert, seit PyPI das Konto am 6. November 2026 gesperrt hat).

- `mcp-server-gcp` (Zeile 162, `GOOGLE_APPLICATION_CREDENTIALS`)
- `mcp-server-mongodb` (Zeile 145, `MONGODB_URI`)
- `mcp-server-todoist` (Zeile 198, `TODOIST_API_TOKEN`)
- `mcp-server-python` (Zeile 258)
- `mcp-server-terraform` (Zeile 221)
- `mcp-server-pandas` (Zeile 236)
- `mcp-server-plotly` (Zeile 243)
- `mcp-server-aws` (Zeile 154, `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`): erster Upload „isn't allowed“, danach nur noch 429

Nach dem Talk:

- [ ] Status je Name prüfen: `curl -s -H 'Accept: application/vnd.pypi.simple.v1+json' https://pypi.org/simple/<name>/`
- [ ] Antwort von security@pypi.org nachverfolgen
- [ ] Maintainer von lastmile-ai/mcp-agent informieren
- [ ] Maintainer von caveman, extract-design-system, claude-code-templates, Front-End-Checklist und OpenClaw informieren und die npm-Namen übergeben
