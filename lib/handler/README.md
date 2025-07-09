# Handler Configuration Guide

This directory contains handler configurations for processing OAuth 2.0 and OpenID Connect endpoints.

## Overview

Each endpoint follows this implementation pattern:

1. **HandlerConfiguration**: Interface for endpoint configuration
2. **HandlerConfigurationImpl**: Implementation class for the configuration
3. **processRequest()**: Method to process actual HTTP requests

## Basic Usage

### 1. Creating HandlerConfiguration

Create HandlerConfiguration for each endpoint:

```typescript
import { ApiClientImpl } from '@vecrea/au3te-ts-server/api';
import { AuthleteConfiguration } from '@vecrea/au3te-ts-common/conf';
import { sessionSchemas } from '@vecrea/au3te-ts-server/session';
import { InMemorySession } from '@vecrea/au3te-ts-server/session';
import { BaseHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler';
import { ExtractorConfigurationImpl } from '@vecrea/au3te-ts-server/extractor';
import { TokenHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token';
import { TokenCreateHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-create';
import { TokenFailHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-fail';
import { TokenIssueHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-issue';
import { AuthorizationHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization';
import { AuthorizationIssueHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization-issue';
import { AuthorizationFailHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization-fail';
import { AuthorizationPageHandlerConfigurationImpl } from '@vecrea/au3te-ts-common/handler.authorization-page';
import { UserHandlerConfigurationImpl } from '@vecrea/au3te-ts-common/handler.user';

// Authlete configuration
const configuration: AuthleteConfiguration = {
  apiVersion: process.env.API_VERSION || '',
  baseUrl: process.env.API_BASE_URL || '',
  serviceApiKey: process.env.API_KEY || '',
  serviceAccessToken: process.env.ACCESS_TOKEN || '',
};

// Base configurations
const apiClient = new ApiClientImpl(configuration);
const session = new InMemorySession(sessionSchemas);
const baseHandlerConfiguration = new BaseHandlerConfigurationImpl(
  apiClient,
  session
);
const extractorConfiguration = new ExtractorConfigurationImpl();

// User configuration
const userHandlerConfiguration = new UserHandlerConfigurationImpl();

// Token-related configurations
const tokenCreateHandlerConfiguration = new TokenCreateHandlerConfigurationImpl(
  baseHandlerConfiguration
);
const tokenFailHandlerConfiguration = new TokenFailHandlerConfigurationImpl(
  baseHandlerConfiguration
);
const tokenIssueHandlerConfiguration = new TokenIssueHandlerConfigurationImpl(
  baseHandlerConfiguration
);

const tokenConfig = new TokenHandlerConfigurationImpl({
  baseHandlerConfiguration,
  userHandlerConfiguration,
  tokenFailHandlerConfiguration,
  tokenIssueHandlerConfiguration,
  tokenCreateHandlerConfiguration,
  extractorConfiguration,
});

// Authorization-related configurations
const authorizationIssueHandlerConfiguration =
  new AuthorizationIssueHandlerConfigurationImpl(baseHandlerConfiguration);
const authorizationFailHandlerConfiguration =
  new AuthorizationFailHandlerConfigurationImpl(baseHandlerConfiguration);
const authorizationPageHandlerConfiguration =
  new AuthorizationPageHandlerConfigurationImpl();

const authorizationConfig = new AuthorizationHandlerConfigurationImpl({
  baseHandlerConfiguration,
  authorizationIssueHandlerConfiguration,
  authorizationFailHandlerConfiguration,
  authorizationPageHandlerConfiguration,
  extractorConfiguration,
});
```

### 2. Using in Endpoints

In actual endpoints (e.g., Hono), call `processRequest()`:

```typescript
import { Hono } from 'hono';
import { TokenHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.token';

const app = new Hono();

// Token endpoint
app.post('/api/token', async (c) => {
  try {
    // Get raw Request from Hono
    const request = c.req.raw;

    // Call processRequest() from HandlerConfiguration
    const response = await tokenConfig.processRequest(request);

    // Return the response directly
    return response;
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

// Authorization endpoint
app.get('/api/authorization', async (c) => {
  try {
    // Get raw Request from Hono
    const request = c.req.raw;

    const response = await authorizationConfig.processRequest(request);

    // Return the response directly
    return response;
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});
```

## Available Endpoints

### Token Endpoint (`/handler/token/`)

Handles OAuth 2.0 token endpoint.

```typescript
import { TokenHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token';

const tokenConfig = new TokenHandlerConfigurationImpl({
  baseHandlerConfiguration: baseConfig,
  userHandlerConfiguration: userConfig,
  tokenFailHandlerConfiguration: tokenFailConfig,
  tokenIssueHandlerConfiguration: tokenIssueConfig,
  tokenCreateHandlerConfiguration: tokenCreateConfig,
  extractorConfiguration: extractorConfig,
});

// Usage example
const response = await tokenConfig.processRequest(request);
```

### Authorization Endpoint (`/handler/authorization/`)

Handles OAuth 2.0 authorization endpoint.

```typescript
import { AuthorizationHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization';

const authorizationConfig = new AuthorizationHandlerConfigurationImpl({
  baseHandlerConfiguration: baseConfig,
  userHandlerConfiguration: userConfig,
  authorizationFailHandlerConfiguration: authFailConfig,
  authorizationIssueHandlerConfiguration: authIssueConfig,
  extractorConfiguration: extractorConfig,
});

// Usage example
const response = await authorizationConfig.processRequest(request);
```

### Authorization Decision Endpoint (`/handler/authorization-decision/`)

Handles authorization decision endpoint.

```typescript
import { AuthorizationDecisionHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization-decision';

const authDecisionConfig = new AuthorizationDecisionHandlerConfigurationImpl({
  baseHandlerConfiguration: baseConfig,
  userHandlerConfiguration: userConfig,
  extractorConfiguration: extractorConfig,
});

// Usage example
const response = await authDecisionConfig.processRequest(request);
```

### Authorization Issue Endpoint (`/handler/authorization-issue/`)

Handles authorization issue endpoint.

```typescript
import { AuthorizationIssueHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization-issue';

const authIssueConfig = new AuthorizationIssueHandlerConfigurationImpl(
  baseConfig
);

// Usage example
const response = await authIssueConfig.processRequest(request);
```

### Authorization Fail Endpoint (`/handler/authorization-fail/`)

Handles authorization fail endpoint.

```typescript
import { AuthorizationFailHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.authorization-fail';

const authFailConfig = new AuthorizationFailHandlerConfigurationImpl(
  baseConfig
);

// Usage example
const response = await authFailConfig.processRequest(request);
```

### Token Issue Endpoint (`/handler/token-issue/`)

Handles token issue endpoint.

```typescript
import { TokenIssueHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-issue';

const tokenIssueConfig = new TokenIssueHandlerConfigurationImpl(baseConfig);

// Usage example
const response = await tokenIssueConfig.processRequest(request);
```

### Token Create Endpoint (`/handler/token-create/`)

Handles token create endpoint.

```typescript
import { TokenCreateHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-create';

const tokenCreateConfig = new TokenCreateHandlerConfigurationImpl(baseConfig);

// Usage example
const response = await tokenCreateConfig.processRequest(request);
```

### Token Fail Endpoint (`/handler/token-fail/`)

Handles token fail endpoint.

```typescript
import { TokenFailHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-fail';

const tokenFailConfig = new TokenFailHandlerConfigurationImpl(baseConfig);

// Usage example
const response = await tokenFailConfig.processRequest(request);
```

### Introspection Endpoint (`/handler/introspection/`)

Handles token introspection endpoint.

```typescript
import { IntrospectionHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.introspection';

const introspectionConfig = new IntrospectionHandlerConfigurationImpl(
  baseConfig
);

// Usage example
const response = await introspectionConfig.processRequest(request);
```

### PAR Endpoint (`/handler/par/`)

Handles Pushed Authorization Request endpoint.

```typescript
import { ParHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.par';

const parConfig = new ParHandlerConfigurationImpl({
  baseHandlerConfiguration: baseConfig,
  extractorConfiguration: extractorConfig,
});

// Usage example
const response = await parConfig.processRequest(request);
```

### Credential Endpoints

#### Common Credential Handler (`@vecrea/au3te-ts-common/handler.credential`)

```typescript
import { CommonCredentialHandlerConfigurationImpl } from '@vecrea/au3te-ts-common/handler.credential';

const commonCredentialConfig = new CommonCredentialHandlerConfigurationImpl({
  userHandlerConfiguration,
});

// Usage example
const response = await commonCredentialConfig.processRequest(request);
```

#### Base Credential Handler (`/handler/credential/`)

```typescript
import { BaseCredentialHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential';

const baseCredentialConfig = new BaseCredentialHandlerConfigurationImpl({
  credentialMetadataHandlerConfiguration,
});

// Usage example
const response = await baseCredentialConfig.processRequest(request);
```

#### Credential Metadata (`/handler/credential-metadata/`)

```typescript
import { CredentialMetadataHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential-metadata';

const credentialMetadataConfig = new CredentialMetadataHandlerConfigurationImpl(
  baseConfig
);

// Usage example
const response = await credentialMetadataConfig.processRequest(request);
```

#### Credential Single Parse (`/handler/credential-single-parse/`)

```typescript
import { CredentialSingleParseHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential-single-parse';

const credentialParseConfig = new CredentialSingleParseHandlerConfigurationImpl(
  baseConfig
);

// Usage example
const response = await credentialParseConfig.processRequest(request);
```

#### Credential Single Issue (`/handler/credential-single-issue/`)

```typescript
import { CredentialSingleIssueHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential-single-issue';

const credentialIssueConfig = new CredentialSingleIssueHandlerConfigurationImpl(
  {
    extractorConfiguration,
    baseCredentialHandlerConfiguration,
    introspectionHandlerConfiguration,
    baseHandlerConfiguration,
    credentialSingleParseHandlerConfiguration,
    commonCredentialHandlerConfiguration,
  }
);

// Usage example
const response = await credentialIssueConfig.processRequest(request);
```

#### Credential Issuer JWKS (`/handler/credential-issuer-jwks/`)

```typescript
import { CredentialIssuerJwksHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential-issuer-jwks';

const credentialJwksConfig = new CredentialIssuerJwksHandlerConfigurationImpl(
  baseConfig
);

// Usage example
const response = await credentialJwksConfig.processRequest(request);
```

### Service Configuration Endpoints

#### Service Configuration (`/handler/service-configuration/`)

```typescript
import { ServiceConfigurationHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.service-configuration';

const serviceConfig = new ServiceConfigurationHandlerConfigurationImpl(
  baseConfig
);

// Usage example
const response = await serviceConfig.processRequest(request);
```

#### Service JWKS (`/handler/service-jwks/`)

```typescript
import { ServiceJwksHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.service-jwks';

const serviceJwksConfig = new ServiceJwksHandlerConfigurationImpl(baseConfig);

// Usage example
const response = await serviceJwksConfig.processRequest(request);
```

## Common Configuration

### BaseHandlerConfiguration

Base configuration used by all endpoints:

```typescript
import { BaseHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler';
import { ApiClientImpl } from '@vecrea/au3te-ts-server/api';
import { InMemorySession } from '@vecrea/au3te-ts-server/session';

const apiClient = new ApiClientImpl(authleteConfig);
const session = new InMemorySession();

const baseConfig = new BaseHandlerConfigurationImpl(apiClient, session);
```

### ExtractorConfiguration

Configuration for extracting request parameters:

```typescript
import { ExtractorConfigurationImpl } from '@vecrea/au3te-ts-server/extractor';

const extractorConfig = new ExtractorConfigurationImpl({
  // extraction configuration
});
```

## Response Handling

`processRequest()` returns a standard Web API `Response` object:

```typescript
const response = await handlerConfig.processRequest(request);

// Status code
console.log(response.status); // 200, 400, 401, etc.

// Headers
response.headers.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// Body
const body = await response.text(); // or response.json()
```

## Error Handling

When an error occurs, an appropriate HTTP status code and error response is returned:

```typescript
try {
  const response = await handlerConfig.processRequest(request);
  // Handle normal response
} catch (error) {
  // Handle unexpected errors
  console.error('Unexpected error:', error);
}
```

## Customization

Each HandlerConfiguration can be customized as needed:

```typescript
// Create HandlerConfiguration with custom settings
const customTokenConfig = new TokenHandlerConfigurationImpl({
  baseHandlerConfiguration: baseConfig,
  userHandlerConfiguration: customUserConfig,
  // ... other custom configurations
});
```
