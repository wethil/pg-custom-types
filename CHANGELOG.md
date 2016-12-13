# v3.0.0
* Added key parameter to handle multiple different databases with different OID mappings.
* Restructured API to allow caller to provide its own querying.

# v2.0.0
* Add new `name` parameter to allow it to be called with different sets of types. Previously you could only call `types()` once and it always cached and returned whatever the first set of types was. This prevented multiple different modules or libraries of fetching different sets of custom types.

# v1.0.2
* Remove unnecessary usage of Array.from

# v1.0.1
* Fix build

# v1.0.0
* Rename ids -> oids and types -> names

# v0.0.1
* Initial release
