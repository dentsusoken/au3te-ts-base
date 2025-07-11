# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2025-07-11

### Changed

- Extracted `CREDENTIAL_SINGLE_ISSUE_PATH` constant in `CredentialSingleIssueHandlerConfigurationImpl` for better maintainability

## [0.1.2] - 2025-07-11

### Changed

- Refactored credential handler: renamed `BaseCredentialHandler` to `ServerCredentialHandler` and updated all references
- Updated implementation and tests for `ServerCredentialHandler`
- Refactored and updated related `HandlerConfigurationImpl` files (authorization, token, introspection, etc.)
- Defined API paths as `XXX_PATH` constants in `HandlerConfigurationImpl` and referenced them in path definitions
- Updated test files and `__tests__` directories accordingly
- Removed obsolete `BaseCredentialHandler` files
- Updated `tsconfig.json`, `vite.config.ts`, and `vitest.config.ts` as needed

## [0.1.1] - 2025-07-09

### Changed

- Renamed `BaseHandlerConfiguration` and `BaseHandlerConfigurationImpl` to `ServerHandlerConfiguration` and `ServerHandlerConfigurationImpl` respectively
- Updated all handler configuration implementations to use `serverHandlerConfiguration` parameter instead of `baseHandlerConfiguration`
- Updated test configurations and mock objects to use the new naming convention
- Fixed all test files to use `mockServerConfig` instead of `mockBaseConfig`

### Fixed

- Resolved test failures caused by property name mismatches after the rename
- Updated `lib/testing/configurations.ts` to use correct property names
- Fixed constructor parameter names in all handler configuration implementations

## [0.1.0] - 2025-07-09

### Changed

- Renamed project from `au3te-ts-base` to `au3te-ts-server`
- Updated package name from `@vecrea/au3te-ts-base` to `@vecrea/au3te-ts-server`
- Updated all GitHub repository URLs to reflect new project name
- Updated import statements in documentation to use proper package imports instead of relative paths
- Updated library name in Vite configuration

### Added

- Initial release of au3te-ts-server
- OAuth 2.0 and OpenID Connect authorization server implementation
- Support for Verifiable Credential issuance (OpenID4VC)
- Modular handler architecture for easy customization
- Multiple OAuth 2.0 grant types support:
  - Authorization Code Grant
  - Resource Owner Password Credentials Grant
  - Token Exchange (RFC 8693)
  - JWT Bearer Token (RFC 7523)
- Comprehensive TypeScript support with full type definitions
- Session management with InMemorySession
- Request parameter extraction utilities
- API client for Authlete services integration

### Technical Details

- Built with Vite for optimal development and build experience
- Uses TypeScript for type safety and better developer experience
- Modular exports for selective importing of functionality
- Comprehensive test suite with Vitest
- Peer dependencies on `@vecrea/au3te-ts-common`, `@vecrea/oid4vc-core`, `u8a-utils`, and `zod`
