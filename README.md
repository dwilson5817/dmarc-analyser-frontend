![DMARC Analyser logo](https://gitlab.dylanw.dev/uploads/-/system/group/avatar/14/dmarc-analyser-256px.png?width=128)

# DMARC Analyser

An AWS Lambda-based DMARC report ingestion pipeline.

## Frontend

[![pipeline status](https://gitlab.dylanw.dev/dmarc-analyser/frontend/badges/main/pipeline.svg)](https://gitlab.dylanw.dev/dmarc-analyser/frontend/-/commits/main)

This is the code for the frontend of the application.  It's a simple React app that allows for viewing the reports 
ingested and seeing a dashboard of the results over time.

### Development

The following environment variables are required:

| Variable              | Description                           |
|-----------------------|---------------------------------------|
| `VITE_AUTH_AUTHORITY` | The OAuth identity provider URL       |
| `VITE_AUTH_CLIENT_ID` | The OAuth identity provider client ID |
| `VITE_API_BASE_URL`   | The base URL of the API               |

Set these variables in a `.env` or `.env.local` file.

Next, install the dependencies:

```bash
npm install
```

Then run the following commands to start the development server:

```bash
npm run dev
```

### Deployment

This is a GitLab Pages project.  The `main` branch is deployed to https://dmarc.dylanw.net.

### License

This application is licensed under the GNU General Public License v3.0 or later.

```
DMARC Analyser
Copyright (C) 2026  Dylan Wilson

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
