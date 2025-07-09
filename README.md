# au3te-ts-server

A TypeScript library for implementing OAuth 2.0 and OpenID Connect authorization servers using Authlete's API.

## Features

- **OAuth 2.0 Support**: Full implementation of OAuth 2.0 authorization server endpoints
- **OpenID Connect**: Complete OpenID Connect Core 1.0 implementation
- **Credential Issuance**: Support for Verifiable Credential issuance (OpenID4VC)
- **TypeScript**: Fully typed with TypeScript for better developer experience
- **Modular Design**: Modular architecture for easy customization and extension
- **Multiple Grant Types**: Support for various OAuth 2.0 grant types including:
  - Authorization Code Grant
  - Resource Owner Password Credentials Grant
  - Token Exchange (RFC 8693)
  - JWT Bearer Token (RFC 7523)

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Authlete service account

### Using npm

```bash
npm install @vecrea/au3te-ts-server
```

### Using yarn

```bash
yarn add @vecrea/au3te-ts-server
```

### Peer Dependencies

This library has the following peer dependencies that need to be installed separately:

- **`@vecrea/au3te-ts-common`**: Common types, interfaces, and utilities
- **`@vecrea/oid4vc-core`**: OpenID4VC core functionality
- **`u8a-utils`**: Uint8Array utilities
- **`zod`**: TypeScript-first schema validation

Install them with:

```bash
npm install @vecrea/au3te-ts-common @vecrea/oid4vc-core u8a-utils zod
```

Or with yarn:

```bash
yarn add @vecrea/au3te-ts-common @vecrea/oid4vc-core u8a-utils zod
```

## API Reference

### Core Modules

- **`/api`**: API client for communicating with Authlete services
- **`/handler`**: Core handler interfaces and utilities
- **`/handler.par`**: Pushed Authorization Request handlers
- **`/handler.authorization`**: Authorization endpoint handlers
- **`/handler.authorization-decision`**: Authorization decision handlers
- **`/handler.authorization-issue`**: Authorization issue handlers
- **`/handler.authorization-fail`**: Authorization fail handlers
- **`/handler.credential`**: Base credential handlers
- **`/handler.token`**: Token endpoint handlers
- **`/handler.token-issue`**: Token issue handlers
- **`/handler.token-fail`**: Token fail handlers
- **`/handler.token-create`**: Token create handlers
- **`/handler.introspection`**: Token introspection handlers
- **`/handler.service-configuration`**: Service configuration handlers
- **`/handler.credential-metadata`**: Credential metadata handlers
- **`/handler.credential-single-parse`**: Credential single parse handlers
- **`/handler.credential-single-issue`**: Credential single issue handlers
- **`/handler.credential-issuer-jwks`**: Credential issuer JWKS handlers
- **`/handler.service-jwks`**: Service JWKS handlers
- **`/extractor`**: Request parameter extraction utilities
- **`/session`**: Session management
- **`/utils`**: Utility functions

### Detailed Handler Documentation

For detailed information on how to create and use HandlerConfigurations for each endpoint, see the [Handler Configuration Guide](lib/handler/README.md).

## Development

### Prerequisites

```bash
git clone https://github.com/dentsusoken/au3te-ts-common
cd au3te-ts-common
npm install
npm run build
npm link
cd ..
```

### Setup

```bash
git clone https://github.com/dentsusoken/au3te-ts-server
cd au3te-ts-server
npm install
npm link @vecrea/au3te-ts-common
npm run build
npm link
cd ..
```

### Testing

```bash
npm test
```

### Building

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on the GitHub repository.
