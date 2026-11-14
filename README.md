# Leavehost Cloud

A Netlify-ready Minecraft control panel using the official Falix Public API v2.

## Deploy (Netlify)

1. Upload this ZIP to a GitHub repository, or extract it and push the files.
2. In Netlify, choose **Add new site → Import an existing project** and connect the repository.
3. Build settings are already in `netlify.toml`; publish directory is `public`.
4. In **Site configuration → Environment variables**, add:
   - `FALIX_API_KEY` = your Falix API key (`flx_live_...`)
   - `LEAVEHOST_ACCESS_PASSWORD` = a long private password for this panel
5. Redeploy the site, then open it and enter the panel password.

## Included features

- Falix account server listing
- Server status / resource snapshot
- Start, stop and restart signals
- Console log and command sending
- Backend proxy keeps the Falix key out of browser JavaScript
- Panel password gate

## Important

- The API key must have the relevant Falix API scopes (`servers:read`, `control.power`, `control.console`).
- Falix may require an interactive verification step for starting a free-plan server. Follow the `action_url` in the API error if returned.
- This is a real API integration, not a fake server simulator. It cannot create hosting capacity or servers if the Falix account/plan does not allow it.
- Do not share your API key or panel password. If the key was posted publicly, revoke it and create a new one.
- The UI is a starter control panel. File manager, billing, customer registration, multi-user roles and automated provisioning are not included yet.
- API reference: https://client.falixnodes.net/api-docs
