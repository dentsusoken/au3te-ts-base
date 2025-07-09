# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
