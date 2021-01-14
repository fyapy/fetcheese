## 1.1.0 (2021-01-11)

### Features

* **fetch/downloadProgress:** Added helper fuction for working with download-progress.


### Bug Fixes

* **createClient:** Fixed TypeScript declarations.


### Code Refactoring

* Added Jest tests for createClient.
* **fetch/downloadProgress:** Added Cypress test.



## [1.0.7](https://github.com/fyapy/fetcheese/compare/v1.0.3...master) (2021-01-11)

### Features

* **createClient:** Separate global and local option `after` lifecycle hook, with prioritet for local hook.
* **createClient:** Separate global and local option `before` lifecycle hook, with prioritet for local hook.
* **createClient:** Separate global and local option `transform` data hook, with prioritet for local hook.
* **createClient:** Separate global and local option `handleError` hook, with prioritet for local hook.


## 1.0.4 (2021-01-10)

### Features

* **createClient:** Added option `before` lifecycle hook.



## [1.0.3](https://github.com/fyapy/fetcheese/compare/v1.0.3...master) (2021-01-09)

### Features

* **createClient:** Added option `after` lifecycle hook.
* **createClient:** Added option `transform` data hook.
* **createClient:** Added option `handleError` hook.



## 1.0.0 (2021-01-08)

### Features

* **createClient:** Basic setup based on Fetch-API.
