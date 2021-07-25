
## Site Settings

The following properties need to be defined to build the static site
- APPFRAME_DOMAIN https://appframe-dev.azureedge.net
- STYLE_DOMAIN https://style-dev.azureedge.net
 
see the user interface .env file which defines these for local development.
```
REACT_APP_CSS_ENDPOINT=https://style-dev.azureedge.net
APPFRAME_DOMAIN=https://appframe-dev.azureedge.net

STYLE_DOMAIN=https://style-dev.azureedge.net
```


for CI CD process the github actions defines these deployment configurations.
```
- name: Run build
      run: cd userinterface && CI=false APPFRAME_DOMAIN=https://appframe-dev.azureedge.net STYLE_DOMAIN=https://style-dev.azureedge.net npm run build  
```

## Application Settings

The following need to be defined in the function application settings

```
"FUNCTIONS_WORKER_RUNTIME": "node",
"STYLE_ENDPOINT": "https://style-dev.azureedge.net",
"AUTH_CLIENTID": "ab8c7f24-a30e-4ef4-bf82-713d248f96f9",
"AUTH_TENANTID": "951b1ed2-d31c-4c2a-9dd6-8ea6137ceb9d",
"AUTH_SCOPES": "api://ab8c7f24-a30e-4ef4-bf82-713d248f96f9/simulation",
"AUTH_REDIRECTURI": "https://localhost:3005",
"AzureWebJobsStorage": ""
```

