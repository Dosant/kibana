<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-core-server](./kibana-plugin-core-server.md) &gt; [SavedObjectsFindOptions](./kibana-plugin-core-server.savedobjectsfindoptions.md)

## SavedObjectsFindOptions interface


<b>Signature:</b>

```typescript
export interface SavedObjectsFindOptions 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [defaultSearchOperator?](./kibana-plugin-core-server.savedobjectsfindoptions.defaultsearchoperator.md) | 'AND' \| 'OR' | <i>(Optional)</i> The search operator to use with the provided filter. Defaults to <code>OR</code> |
|  [fields?](./kibana-plugin-core-server.savedobjectsfindoptions.fields.md) | string\[\] | <i>(Optional)</i> An array of fields to include in the results |
|  [filter?](./kibana-plugin-core-server.savedobjectsfindoptions.filter.md) | string \| KueryNode | <i>(Optional)</i> |
|  [hasReference?](./kibana-plugin-core-server.savedobjectsfindoptions.hasreference.md) | SavedObjectsFindOptionsReference \| SavedObjectsFindOptionsReference\[\] | <i>(Optional)</i> Search for documents having a reference to the specified objects. Use <code>hasReferenceOperator</code> to specify the operator to use when searching for multiple references. |
|  [hasReferenceOperator?](./kibana-plugin-core-server.savedobjectsfindoptions.hasreferenceoperator.md) | 'AND' \| 'OR' | <i>(Optional)</i> The operator to use when searching by multiple references using the <code>hasReference</code> option. Defaults to <code>OR</code> |
|  [namespaces?](./kibana-plugin-core-server.savedobjectsfindoptions.namespaces.md) | string\[\] | <i>(Optional)</i> |
|  [page?](./kibana-plugin-core-server.savedobjectsfindoptions.page.md) | number | <i>(Optional)</i> |
|  [perPage?](./kibana-plugin-core-server.savedobjectsfindoptions.perpage.md) | number | <i>(Optional)</i> |
|  [pit?](./kibana-plugin-core-server.savedobjectsfindoptions.pit.md) | SavedObjectsPitParams | <i>(Optional)</i> Search against a specific Point In Time (PIT) that you've opened with [SavedObjectsClient.openPointInTimeForType()](./kibana-plugin-core-server.savedobjectsclient.openpointintimefortype.md)<!-- -->. |
|  [preference?](./kibana-plugin-core-server.savedobjectsfindoptions.preference.md) | string | <i>(Optional)</i> An optional ES preference value to be used for the query \* |
|  [rootSearchFields?](./kibana-plugin-core-server.savedobjectsfindoptions.rootsearchfields.md) | string\[\] | <i>(Optional)</i> The fields to perform the parsed query against. Unlike the <code>searchFields</code> argument, these are expected to be root fields and will not be modified. If used in conjunction with <code>searchFields</code>, both are concatenated together. |
|  [search?](./kibana-plugin-core-server.savedobjectsfindoptions.search.md) | string | <i>(Optional)</i> Search documents using the Elasticsearch Simple Query String syntax. See Elasticsearch Simple Query String <code>query</code> argument for more information |
|  [searchAfter?](./kibana-plugin-core-server.savedobjectsfindoptions.searchafter.md) | estypes.Id\[\] | <i>(Optional)</i> Use the sort values from the previous page to retrieve the next page of results. |
|  [searchFields?](./kibana-plugin-core-server.savedobjectsfindoptions.searchfields.md) | string\[\] | <i>(Optional)</i> The fields to perform the parsed query against. See Elasticsearch Simple Query String <code>fields</code> argument for more information |
|  [sortField?](./kibana-plugin-core-server.savedobjectsfindoptions.sortfield.md) | string | <i>(Optional)</i> |
|  [sortOrder?](./kibana-plugin-core-server.savedobjectsfindoptions.sortorder.md) | estypes.SortOrder | <i>(Optional)</i> |
|  [type](./kibana-plugin-core-server.savedobjectsfindoptions.type.md) | string \| string\[\] |  |
|  [typeToNamespacesMap?](./kibana-plugin-core-server.savedobjectsfindoptions.typetonamespacesmap.md) | Map&lt;string, string\[\] \| undefined&gt; | <i>(Optional)</i> This map defines each type to search for, and the namespace(s) to search for the type in; this is only intended to be used by a saved object client wrapper. If this is defined, it supersedes the <code>type</code> and <code>namespaces</code> fields when building the Elasticsearch query. Any types that are not included in this map will be excluded entirely. If a type is included but its value is undefined, the operation will search for that type in the Default namespace. |

