import avsc from 'avsc';

import type { JSONSchema7TypeName } from 'json-schema';
import type { Schema } from 'avsc';

import type { AsyncAPISchema, SchemaParser, ParseSchemaInput, ValidateSchemaInput, SchemaValidateResult, SpecTypesV2 } from '@asyncapi/parser';

type AvroSchema = Schema & { [key: string]: any };

export function AvroSchemaParser(): SchemaParser {
  return {
    validate,
    parse,
    getMimeTypes,
  };
}
export default AvroSchemaParser;

async function validate(input: ValidateSchemaInput<unknown, unknown>): Promise<SchemaValidateResult[]> {
  const result: SchemaValidateResult[] = [];
  
  try {
    validateAvroSchema(input.data as AvroSchema);  
  } catch (error) {
    if (error instanceof Error) {
      result.push({
        message: error.message,
        path: input.path, // avsc doesn't throw errors with meaningful paths
      });
    }
  }
  
  return result;
}

async function parse(input: ParseSchemaInput<unknown, unknown>): Promise<AsyncAPISchema> {
  const asyncAPISchema = await avroToJsonSchema(input.data as AvroSchema);
  const message = (input.meta as any).message;
  const key = message?.bindings?.kafka?.key;
  if (key) {
    const bindingsTransformed = await avroToJsonSchema(key);
    message['x-parser-original-bindings-kafka-key'] = key;
    message.bindings.kafka.key = bindingsTransformed;
  }

  return asyncAPISchema;
}

function getMimeTypes() {
  return [
    'application/vnd.apache.avro;version=1.9.0',
    'application/vnd.apache.avro+json;version=1.9.0',
    'application/vnd.apache.avro+yaml;version=1.9.0',
    'application/vnd.apache.avro;version=1.8.2',
    'application/vnd.apache.avro+json;version=1.8.2',
    'application/vnd.apache.avro+yaml;version=1.8.2'
  ];
}

const BYTES_PATTERN = '^[\u0000-\u00ff]*$';
const INT_MIN = Math.pow(-2, 31);
const INT_MAX = Math.pow(2, 31) - 1;
const LONG_MIN = Math.pow(-2, 63);
const LONG_MAX = Math.pow(2, 63) - 1;

const typeMappings: Record<string, JSONSchema7TypeName> = {
  null: 'null',
  boolean: 'boolean',
  int: 'integer',
  long: 'integer',
  float: 'number',
  double: 'number',
  bytes: 'string',
  string: 'string',
  fixed: 'string',
  map: 'object',
  array: 'array',
  enum: 'string',
  record: 'object',
  uuid: 'string',
};

function commonAttributesMapping(avroDefinition: AvroSchema, jsonSchema: SpecTypesV2.AsyncAPISchemaDefinition, recordCache: { [key:string]: AsyncAPISchema }): void {
  if (avroDefinition.doc) jsonSchema.description = avroDefinition.doc;
  if (avroDefinition.default !== undefined) jsonSchema.default = avroDefinition.default;

  const fullyQualifiedName = getFullyQualifiedName(avroDefinition);
  if (fullyQualifiedName !== undefined && recordCache[fullyQualifiedName]) {
    jsonSchema['x-parser-schema-id'] = fullyQualifiedName;
  }
}

function getFullyQualifiedName(avroDefinition: AvroSchema) {
  let name;

  if (avroDefinition.name) {
    if (avroDefinition.namespace) {
      name = `${avroDefinition.namespace}.${avroDefinition.name}`;
    } else {
      name = avroDefinition.name;
    }
  }

  return name;
}

/**
 * Enrich the parent's required attribute with the required record attributes
 * @param fieldDefinition the actual field definition
 * @param parentJsonSchema the parent json schema which contains the required property to enrich
 * @param haveDefaultValue we assure that a required field does not have a default value
 */
function requiredAttributesMapping(fieldDefinition: any, parentJsonSchema: SpecTypesV2.AsyncAPISchemaDefinition, haveDefaultValue: boolean): void {
  const isUnionWithNull = Array.isArray(fieldDefinition.type) && fieldDefinition.type.includes('null');

  // we assume that a union type without null and a field without default value is required
  if (!isUnionWithNull && !haveDefaultValue) {
    parentJsonSchema.required = parentJsonSchema.required || [];
    parentJsonSchema.required.push(fieldDefinition.name);
  }
}

function extractNonNullableTypeIfNeeded(typeInput: any, jsonSchemaInput: SpecTypesV2.AsyncAPISchemaDefinition): { type: string, jsonSchema: SpecTypesV2.AsyncAPISchemaDefinition } {
  let type = typeInput;
  let jsonSchema = jsonSchemaInput;
  // Map example to first non-null type
  if (Array.isArray(typeInput) && typeInput.length > 0) {
    const pickSecondType = typeInput.length > 1 && typeInput[0] === 'null';
    type = typeInput[+pickSecondType];
    if (jsonSchema.oneOf !== undefined) {
      jsonSchema = jsonSchema.oneOf[0] as SpecTypesV2.AsyncAPISchemaDefinition;
    }
  }
  return { type, jsonSchema };
}

function exampleAttributeMapping(type: any, example: any, jsonSchema: SpecTypesV2.AsyncAPISchemaDefinition): void {
  if (example === undefined || jsonSchema.examples || Array.isArray(type)) return;

  switch (type) {
  case 'boolean':
    jsonSchema.examples = [example === 'true'];
    break;
  case 'int':
    jsonSchema.examples = [parseInt(example, 10)];
    break;
  default:
    jsonSchema.examples = [example];
  }
}

function additionalAttributesMapping(typeInput: any, avroDefinition: AvroSchema, jsonSchemaInput: SpecTypesV2.AsyncAPISchemaDefinition): void {
  const __ret = extractNonNullableTypeIfNeeded(typeInput, jsonSchemaInput);
  const type = __ret.type;
  const jsonSchema = __ret.jsonSchema;

  exampleAttributeMapping(type, avroDefinition.example, jsonSchema);

  function setAdditionalAttribute(...names: string[]) {
    names.forEach(name => {
      let isValueCoherent = true;
      if (name === 'minLength' || name === 'maxLength') {
        isValueCoherent = avroDefinition[name] > -1;
      } else if (name === 'multipleOf') {
        isValueCoherent = avroDefinition[name] > 0;
      }
      if (avroDefinition[name] !== undefined && isValueCoherent) jsonSchema[name] = avroDefinition[name];
    });
  }

  switch (type) {
  case 'int':   // int, long, float, and double must support the attributes bellow
  case 'long':
  case 'float':
  case 'double':
    setAdditionalAttribute('minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf');
    break;
  case 'string':
    if (avroDefinition.logicalType) {
      jsonSchema.format = avroDefinition.logicalType;
    }
    setAdditionalAttribute('pattern', 'minLength', 'maxLength');
    break;
  case 'array':
    setAdditionalAttribute('minItems', 'maxItems', 'uniqueItems');
    break;
  default:
    break;
  }
}

function validateAvroSchema(avroDefinition: AvroSchema): void | never {
  // don't need to use the output from parsing the
  //  avro definition - we're just using this as a
  //  validator as this will throw an exception if
  //  there are any problems with the definition
  avsc.Type.forSchema(avroDefinition);
}

/**
 * Cache the passed value under the given key. If the key is undefined the value will not be cached. This function
 * uses mutation of the passed cache object rather than a copy on write cache strategy.
 *
 * @param cache Map<String, JsonSchema> the cache to store the JsonSchema
 * @param key String | Undefined - the fully qualified name of an avro record
 * @param value JsonSchema - The json schema from the avro record
 */
function cacheAvroRecordDef(cache: { [key:string]: AsyncAPISchema }, key: string, value: AsyncAPISchema): void {
  if (key !== undefined) {
    cache[key] = value;
  }
}

async function convertAvroToJsonSchema(avroDefinition: AvroSchema , isTopLevel: boolean, recordCache: Map<string, SpecTypesV2.AsyncAPISchemaDefinition> | any = {}): Promise<SpecTypesV2.AsyncAPISchemaDefinition> {
  let jsonSchema: SpecTypesV2.AsyncAPISchemaDefinition = {};
  const isUnion = Array.isArray(avroDefinition);

  if (isUnion) {
    return processUnionSchema(jsonSchema, avroDefinition, isTopLevel, recordCache);
  }

  // Avro definition can be a string (e.g. "int")
  // or an object like { type: "int" }
  const type = avroDefinition.type || avroDefinition;
  jsonSchema.type = typeMappings[type];

  switch (type) {
  case 'int': {
    jsonSchema.minimum = INT_MIN;
    jsonSchema.maximum = INT_MAX;
    break;
  }
  case 'long': {
    jsonSchema.minimum = LONG_MIN;
    jsonSchema.maximum = LONG_MAX;
    break;
  }
  case 'bytes': {
    jsonSchema.pattern = BYTES_PATTERN;
    break;
  }
  case 'fixed': {
    jsonSchema.pattern = BYTES_PATTERN;
    jsonSchema.minLength = avroDefinition.size;
    jsonSchema.maxLength = avroDefinition.size;
    break;
  }
  case 'map': {
    jsonSchema.additionalProperties = await convertAvroToJsonSchema(avroDefinition.values, false);
    break;
  }
  case 'array': {
    jsonSchema.items = await convertAvroToJsonSchema(avroDefinition.items, false);
    break;
  }
  case 'enum': {
    jsonSchema.enum = avroDefinition.symbols;
    break;
  }
  case 'float': // float and double must support the format attribute from the avro type
  case 'double': {
    jsonSchema.format = type;
    break;
  }
  case 'record': {
    const propsMap = await processRecordSchema(avroDefinition, recordCache, jsonSchema);
    cacheAvroRecordDef(recordCache, getFullyQualifiedName(avroDefinition), propsMap);
    jsonSchema.properties = Object.fromEntries(propsMap.entries());
    break;
  }
  default: {
    const cachedRecord = recordCache[getFullyQualifiedName(avroDefinition)];
    if (cachedRecord) {
      jsonSchema = cachedRecord;
    }
    break;
  }
  }

  commonAttributesMapping(avroDefinition, jsonSchema, recordCache);
  additionalAttributesMapping(type, avroDefinition, jsonSchema);

  return jsonSchema;
}

/**
 * When a record type is found in an avro schema this function can be used to process the underlying fields and return
 * the map of props contained by the record. The record will also be cached.
 *
 * @param avroDefinition the avro schema to be processed
 * @param recordCache the cache of previously processed avro record types
 * @param jsonSchema the schema for the record.
 * @returns {Promise<Map<string, any>>}
 */
async function processRecordSchema(avroDefinition: AvroSchema, recordCache: Record<string, SpecTypesV2.AsyncAPISchemaDefinition>, jsonSchema: SpecTypesV2.AsyncAPISchemaDefinition): Promise<Map<string, any>> {
  const propsMap = new Map<string, any>();
  for (const field of avroDefinition.fields) {
    // If the type is a sub schema it will have been stored in the cache.
    if (recordCache[field.type]) {
      propsMap.set(field.name, recordCache[field.type]);
    } else {
      const def = await convertAvroToJsonSchema(field.type, false, recordCache);

      requiredAttributesMapping(field, jsonSchema, field.default !== undefined);
      commonAttributesMapping(field, def, recordCache);
      additionalAttributesMapping(field.type, field, def);

      propsMap.set(field.name, def);
      // If there is a name for the sub record cache it under the name.
      const qualifiedFieldName = getFullyQualifiedName(field.type);
      cacheAvroRecordDef(recordCache, qualifiedFieldName, def);
    }
  }
  return propsMap;
}

/**
 * Handles processing union avro schema types by creating a oneOf jsonSchema definition. This will mutate the passed
 * jsonSchema and recordCache objects.
 *
 * @param jsonSchema the jsonSchema object that will be mutated.
 * @param avroDefinition the avro schema to be processed
 * @param isTopLevel is this the top level of the schema or is this a sub schema
 * @param recordCache the cache of previously processed record types
 * @returns {Promise<AsyncAPISchema>} the mutated jsonSchema that was provided to the function
 */
async function processUnionSchema(jsonSchema: SpecTypesV2.AsyncAPISchemaDefinition, avroDefinition: AvroSchema, isTopLevel: boolean, recordCache: Record<string, SpecTypesV2.AsyncAPISchemaDefinition>): Promise<SpecTypesV2.AsyncAPISchemaDefinition> {
  jsonSchema.oneOf = [];
  let nullDef = null;
  
  for (const avroDef of avroDefinition as AvroSchema[]) {
    const def = await convertAvroToJsonSchema(avroDef, isTopLevel, recordCache);
    // avroDef can be { type: 'int', default: 1 } and this is why avroDef.type has priority here
    const defType = avroDef.type || avroDef;
    // To prefer non-null values in the examples skip null definition here and push it as the last element after loop
    if (defType === 'null') {
      nullDef = def;
    } else {
      jsonSchema.oneOf.push(def);
      const qualifiedName = getFullyQualifiedName(avroDef);
      cacheAvroRecordDef(recordCache, qualifiedName, def);
    }
  }
  if (nullDef) jsonSchema.oneOf.push(nullDef);

  return jsonSchema;
}

export async function avroToJsonSchema(avroDefinition: AvroSchema) {
  return convertAvroToJsonSchema(avroDefinition, true);
}
