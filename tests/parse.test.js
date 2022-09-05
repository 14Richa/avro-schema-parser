const fs = require('fs');
const path = require('path');
const avroSchemaParser = require('..');
const parser = require('@asyncapi/parser');

const inputWithAvro182 = fs.readFileSync(path.resolve(__dirname, './asyncapi-avro-1.8.2.yaml'), 'utf8');
const outputWithAvro182 = '{"asyncapi":"2.0.0","info":{"title":"My API","version":"1.0.0"},"channels":{"mychannel":{"publish":{"message":{"payload":{"type":"object","required":["name","favoriteProgrammingLanguage","address"],"properties":{"name":{"type":"string","examples":["Donkey"],"x-parser-schema-id":"<anonymous-schema-2>"},"age":{"oneOf":[{"type":"integer","minimum":-2147483648,"maximum":2147483647,"x-parser-schema-id":"<anonymous-schema-4>"},{"type":"null","x-parser-schema-id":"<anonymous-schema-5>"}],"default":null,"x-parser-schema-id":"<anonymous-schema-3>"},"favoriteProgrammingLanguage":{"type":"string","enum":["JS","Java","Go","Rust","C"],"x-parser-schema-id":"<anonymous-schema-6>"},"address":{"type":"object","required":["zipcode"],"properties":{"zipcode":{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[53003],"x-parser-schema-id":"<anonymous-schema-7>"}},"x-parser-schema-id":"Address"}},"x-parser-schema-id":"<anonymous-schema-1>"},"x-parser-original-schema-format":"application/vnd.apache.avro;version=1.8.2","x-parser-original-payload":{"type":"record","fields":[{"name":"name","type":"string","example":"Donkey"},{"name":"age","type":["null","int"],"default":null},{"name":"favoriteProgrammingLanguage","type":{"name":"ProgrammingLanguage","type":"enum","symbols":["JS","Java","Go","Rust","C"]}},{"name":"address","type":{"name":"Address","type":"record","fields":[{"name":"zipcode","type":"int","example":53003}]}}]},"schemaFormat":"application/vnd.aai.asyncapi;version=2.0.0","x-parser-message-parsed":true,"x-parser-message-name":"<anonymous-message-1>"}}}},"x-parser-spec-parsed":true}';

const inputWithAvro190 = fs.readFileSync(path.resolve(__dirname, './asyncapi-avro-1.9.0.yaml'), 'utf8');
const outputWithAvro190 = '{"asyncapi":"2.0.0","info":{"title":"My API","version":"1.0.0"},"channels":{"mychannel":{"publish":{"message":{"payload":{"type":"object","required":["name","favoriteProgrammingLanguage","address","someid"],"properties":{"name":{"type":"string","examples":["Donkey"],"x-parser-schema-id":"<anonymous-schema-1>"},"age":{"oneOf":[{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[123],"x-parser-schema-id":"<anonymous-schema-3>"},{"type":"null","x-parser-schema-id":"<anonymous-schema-4>"}],"default":null,"x-parser-schema-id":"<anonymous-schema-2>"},"favoriteProgrammingLanguage":{"type":"string","enum":["JS","Java","Go","Rust","C"],"default":"JS","x-parser-schema-id":"<anonymous-schema-5>"},"address":{"type":"object","required":["zipcode"],"properties":{"zipcode":{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[53003],"x-parser-schema-id":"<anonymous-schema-6>"}},"x-parser-schema-id":"Address"},"someid":{"type":"string","format":"uuid","x-parser-schema-id":"<anonymous-schema-7>"}},"x-parser-schema-id":"Person"},"x-parser-original-schema-format":"application/vnd.apache.avro;version=1.9.0","x-parser-original-payload":{"name":"Person","type":"record","fields":[{"name":"name","type":"string","example":"Donkey"},{"name":"age","type":["null","int"],"default":null,"example":123},{"name":"favoriteProgrammingLanguage","type":{"name":"ProgrammingLanguage","type":"enum","symbols":["JS","Java","Go","Rust","C"],"default":"JS"}},{"name":"address","type":{"name":"Address","type":"record","fields":[{"name":"zipcode","type":"int","example":53003}]}},{"name":"someid","type":"string","logicalType":"uuid"}]},"schemaFormat":"application/vnd.aai.asyncapi;version=2.0.0","x-parser-message-parsed":true,"x-parser-message-name":"<anonymous-message-1>"}}}},"x-parser-spec-parsed":true}';

const inputWithAvro190WithNamespace = fs.readFileSync(path.resolve(__dirname, './asyncapi-avro-1.9.0-namespace.yaml'), 'utf8');
const outputWithAvro190WithNamespace = '{"asyncapi":"2.0.0","info":{"title":"My API","version":"1.0.0"},"channels":{"mychannel":{"publish":{"message":{"payload":{"type":"object","required":["name","favoriteProgrammingLanguage","address","someid"],"properties":{"name":{"type":"string","examples":["Donkey"],"x-parser-schema-id":"<anonymous-schema-1>"},"age":{"oneOf":[{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[123],"x-parser-schema-id":"<anonymous-schema-3>"},{"type":"null","x-parser-schema-id":"<anonymous-schema-4>"}],"default":null,"x-parser-schema-id":"<anonymous-schema-2>"},"favoriteProgrammingLanguage":{"type":"string","enum":["JS","Java","Go","Rust","C"],"default":"JS","x-parser-schema-id":"<anonymous-schema-5>"},"address":{"type":"object","required":["zipcode"],"properties":{"zipcode":{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[53003],"x-parser-schema-id":"<anonymous-schema-6>"}},"x-parser-schema-id":"Address"},"someid":{"type":"string","format":"uuid","x-parser-schema-id":"<anonymous-schema-7>"}},"x-parser-schema-id":"com.company.Person"},"x-parser-original-schema-format":"application/vnd.apache.avro;version=1.9.0","x-parser-original-payload":{"name":"Person","namespace":"com.company","type":"record","fields":[{"name":"name","type":"string","example":"Donkey"},{"name":"age","type":["null","int"],"default":null,"example":123},{"name":"favoriteProgrammingLanguage","type":{"name":"ProgrammingLanguage","type":"enum","symbols":["JS","Java","Go","Rust","C"],"default":"JS"}},{"name":"address","type":{"name":"Address","type":"record","fields":[{"name":"zipcode","type":"int","example":53003}]}},{"name":"someid","type":"string","logicalType":"uuid"}]},"schemaFormat":"application/vnd.aai.asyncapi;version=2.0.0","x-parser-message-parsed":true,"x-parser-message-name":"<anonymous-message-1>"}}}},"x-parser-spec-parsed":true}';

const inputWithAvro190WithBindings = fs.readFileSync(path.resolve(__dirname, './asyncapi-avro-1.9.0-bindings.yaml'), 'utf8');
const outputWithAvro190WithBindings = '{"asyncapi":"2.0.0","info":{"title":"My API","version":"1.0.0"},"channels":{"mychannel":{"publish":{"message":{"payload":{"type":"object","required":["name","favoriteProgrammingLanguage","address","someid"],"properties":{"name":{"type":"string","examples":["Donkey"],"x-parser-schema-id":"<anonymous-schema-1>"},"age":{"oneOf":[{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[123],"x-parser-schema-id":"<anonymous-schema-3>"},{"type":"null","x-parser-schema-id":"<anonymous-schema-4>"}],"default":null,"x-parser-schema-id":"<anonymous-schema-2>"},"favoriteProgrammingLanguage":{"type":"string","enum":["JS","Java","Go","Rust","C"],"default":"JS","x-parser-schema-id":"<anonymous-schema-5>"},"address":{"type":"object","required":["zipcode"],"properties":{"zipcode":{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[53003],"x-parser-schema-id":"<anonymous-schema-6>"}},"x-parser-schema-id":"Address"},"someid":{"type":"string","format":"uuid","x-parser-schema-id":"<anonymous-schema-7>"}},"x-parser-schema-id":"com.company.Person"},"bindings":{"kafka":{"key":{"type":"object","required":["name","favoriteProgrammingLanguage","address","someid"],"properties":{"name":{"type":"string","examples":["Donkey"]},"age":{"oneOf":[{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[123]},{"type":"null"}],"default":null},"favoriteProgrammingLanguage":{"type":"string","enum":["JS","Java","Go","Rust","C"],"default":"JS"},"address":{"type":"object","required":["zipcode"],"properties":{"zipcode":{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[53003]}},"x-parser-schema-id":"Address"},"someid":{"type":"string","format":"uuid"}},"x-parser-schema-id":"com.company.Person"}},"mqtt":{"x-test":{"type":"string"}}},"x-parser-original-schema-format":"application/vnd.apache.avro;version=1.9.0","x-parser-original-payload":{"name":"Person","namespace":"com.company","type":"record","fields":[{"name":"name","type":"string","example":"Donkey"},{"name":"age","type":["null","int"],"default":null,"example":123},{"name":"favoriteProgrammingLanguage","type":{"name":"ProgrammingLanguage","type":"enum","symbols":["JS","Java","Go","Rust","C"],"default":"JS"}},{"name":"address","type":{"name":"Address","type":"record","fields":[{"name":"zipcode","type":"int","example":53003}]}},{"name":"someid","type":"string","logicalType":"uuid"}]},"x-parser-original-bindings-kafka-key":{"name":"Person","namespace":"com.company","type":"record","fields":[{"name":"name","type":"string","example":"Donkey"},{"name":"age","type":["null","int"],"default":null,"example":123},{"name":"favoriteProgrammingLanguage","type":{"name":"ProgrammingLanguage","type":"enum","symbols":["JS","Java","Go","Rust","C"],"default":"JS"}},{"name":"address","type":{"name":"Address","type":"record","fields":[{"name":"zipcode","type":"int","example":53003}]}},{"name":"someid","type":"string","logicalType":"uuid"}]},"schemaFormat":"application/vnd.aai.asyncapi;version=2.0.0","x-parser-message-parsed":true,"x-parser-message-name":"<anonymous-message-1>"}}}},"x-parser-spec-parsed":true}';

const inputWithAvroAdditionalAttributes = fs.readFileSync(path.resolve(__dirname, './asyncapi-avro-1.9.0-additional-attributes.yaml'), 'utf8');
const outputWithAvroAdditionalAttributes = '{"asyncapi":"2.1.0","info":{"title":"My API","version":"1.0.0"},"channels":{"mychannel":{"publish":{"message":{"payload":{"type":"object","required":["name","serialNo","favoriteProgrammingLanguage","certifications","address","weight","height","someid"],"properties":{"name":{"type":"string","examples":["Donkey"],"minLength":0,"x-parser-schema-id":"<anonymous-schema-1>"},"serialNo":{"type":"string","minLength":0,"maxLength":50,"x-parser-schema-id":"<anonymous-schema-2>"},"email":{"oneOf":[{"type":"string","examples":["donkey@asyncapi.com"],"pattern":"^[\\\\w-\\\\.]+@([\\\\w-]+\\\\.)+[\\\\w-]{2,4}$","x-parser-schema-id":"<anonymous-schema-4>"},{"type":"null","x-parser-schema-id":"<anonymous-schema-5>"}],"x-parser-schema-id":"<anonymous-schema-3>"},"age":{"oneOf":[{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[123],"exclusiveMinimum":0,"exclusiveMaximum":200,"x-parser-schema-id":"<anonymous-schema-7>"},{"type":"null","x-parser-schema-id":"<anonymous-schema-8>"}],"default":null,"x-parser-schema-id":"<anonymous-schema-6>"},"favoriteProgrammingLanguage":{"type":"string","enum":["JS","Java","Go","Rust","C"],"default":"JS","x-parser-schema-id":"<anonymous-schema-9>"},"certifications":{"type":"array","items":{"type":"string","x-parser-schema-id":"<anonymous-schema-11>"},"minItems":1,"maxItems":500,"uniqueItems":true,"x-parser-schema-id":"<anonymous-schema-10>"},"address":{"type":"object","required":["zipcode"],"properties":{"zipcode":{"type":"integer","minimum":-2147483648,"maximum":2147483647,"examples":[53003],"x-parser-schema-id":"<anonymous-schema-12>"},"country":{"oneOf":[{"type":"string","x-parser-schema-id":"<anonymous-schema-14>"},{"type":"null","x-parser-schema-id":"<anonymous-schema-15>"}],"x-parser-schema-id":"<anonymous-schema-13>"}},"x-parser-schema-id":"Address"},"weight":{"type":"number","format":"float","examples":[65.1],"minimum":0,"maximum":500,"x-parser-schema-id":"<anonymous-schema-16>"},"height":{"type":"number","format":"double","examples":[1.85],"minimum":0,"maximum":3,"x-parser-schema-id":"<anonymous-schema-17>"},"someid":{"type":"string","format":"uuid","x-parser-schema-id":"<anonymous-schema-18>"}},"x-parser-schema-id":"com.company.Person"},"x-parser-original-schema-format":"application/vnd.apache.avro;version=1.9.0","x-parser-original-payload":{"name":"Person","namespace":"com.company","type":"record","fields":[{"name":"name","type":"string","example":"Donkey","minLength":0},{"name":"serialNo","type":"string","minLength":0,"maxLength":50},{"name":"email","type":["null","string"],"example":"donkey@asyncapi.com","pattern":"^[\\\\w-\\\\.]+@([\\\\w-]+\\\\.)+[\\\\w-]{2,4}$"},{"name":"age","type":["null","int"],"default":null,"example":123,"exclusiveMinimum":0,"exclusiveMaximum":200},{"name":"favoriteProgrammingLanguage","type":{"name":"ProgrammingLanguage","type":"enum","symbols":["JS","Java","Go","Rust","C"],"default":"JS"}},{"name":"certifications","type":{"type":"array","items":"string","minItems":1,"maxItems":500,"uniqueItems":true}},{"name":"address","type":{"name":"Address","type":"record","fields":[{"name":"zipcode","type":"int","example":53003},{"name":"country","type":["null","string"]}]}},{"name":"weight","type":"float","example":65.1,"minimum":0,"maximum":500},{"name":"height","type":"double","example":1.85,"minimum":0,"maximum":3},{"name":"someid","type":"string","logicalType":"uuid"}]},"schemaFormat":"application/vnd.aai.asyncapi;version=2.1.0","x-parser-message-parsed":true,"x-parser-message-name":"<anonymous-message-1>"}}}},"x-parser-spec-parsed":true}';

const inputWithInvalidAvro = fs.readFileSync(path.resolve(__dirname, './asyncapi-avro-invalid.yaml'), 'utf8');
const inputWithBrokenAvro = fs.readFileSync(path.resolve(__dirname, './asyncapi-avro-broken.yaml'), 'utf8');

const inputWithSubAvro190 = fs.readFileSync(path.resolve(__dirname, './asyncapi-avro-111-1.9.0.yaml'), 'utf8');
const outputWithSubAvro190 = '{"asyncapi":"2.0.0","info":{"title":"My API","version":"1.0.0"},"channels":{"mychannel":{"publish":{"message":{"payload":{"type":"object","required":["metadata","auth_code","triggered_by"],"properties":{"metadata":{"type":"object","required":["id","timestamp"],"properties":{"id":{"type":"string","format":"uuid","description":"Unique identifier for this specific event","x-parser-schema-id":"<anonymous-schema-1>"},"timestamp":{"type":"integer","minimum":-9223372036854776000,"maximum":9223372036854776000,"description":"Instant the event took place (not necessary when it was published)","x-parser-schema-id":"<anonymous-schema-2>"},"correlation_id":{"oneOf":[{"type":"string","format":"uuid","x-parser-schema-id":"<anonymous-schema-4>"},{"type":"null","x-parser-schema-id":"<anonymous-schema-5>"}],"description":"id of the event that resulted in this\\nevent being published (optional)","default":null,"x-parser-schema-id":"<anonymous-schema-3>"},"publisher_context":{"oneOf":[{"type":"object","additionalProperties":{"type":"string","x-parser-schema-id":"<anonymous-schema-8>"},"x-parser-schema-id":"<anonymous-schema-7>"},{"type":"null","x-parser-schema-id":"<anonymous-schema-9>"}],"description":"optional set of key-value pairs of context to be echoed back\\nin any resulting message (like a richer\\ncorrelationId.\\n\\nThese values are likely only meaningful to the publisher\\nof the correlated event","default":null,"x-parser-schema-id":"<anonymous-schema-6>"}},"description":"Metadata to be associated with every published event","x-parser-schema-id":"com.foo.EventMetadata"},"auth_code":{"type":"object","required":["value","nonce","key"],"properties":{"value":{"type":"string","description":"A sequence of bytes that has been AES encrypted in CTR mode.","x-parser-schema-id":"<anonymous-schema-10>"},"nonce":{"type":"string","description":"A nonce, used by the CTR encryption mode for our encrypted value. Not encrypted, not a secret.","x-parser-schema-id":"<anonymous-schema-11>"},"key":{"type":"string","description":"An AES key, used to encrypt the value field, that has itself been encrypted using RSA.","x-parser-schema-id":"<anonymous-schema-12>"}},"description":"Encrypted auth_code received when user authorizes the app.","x-parser-schema-id":"com.foo.EncryptedString"},"refresh_token":{"type":"object","required":["value","nonce","key"],"properties":{"value":{"type":"string","description":"A sequence of bytes that has been AES encrypted in CTR mode.","x-parser-schema-id":"<anonymous-schema-10>"},"nonce":{"type":"string","description":"A nonce, used by the CTR encryption mode for our encrypted value. Not encrypted, not a secret.","x-parser-schema-id":"<anonymous-schema-11>"},"key":{"type":"string","description":"An AES key, used to encrypt the value field, that has itself been encrypted using RSA.","x-parser-schema-id":"<anonymous-schema-12>"}},"description":"Encrypted auth_code received when user authorizes the app.","x-parser-schema-id":"com.foo.EncryptedString"},"triggered_by":{"type":"string","format":"uuid","description":"ID of the user who triggered this event.","x-parser-schema-id":"<anonymous-schema-13>"}},"description":"An example schema to illustrate the issue","x-parser-schema-id":"com.foo.connections.ConnectionRequested"},"x-parser-original-schema-format":"application/vnd.apache.avro;version=1.9.0","x-parser-original-payload":{"type":"record","name":"ConnectionRequested","namespace":"com.foo.connections","doc":"An example schema to illustrate the issue","fields":[{"name":"metadata","type":{"type":"record","name":"EventMetadata","namespace":"com.foo","doc":"Metadata to be associated with every published event","fields":[{"name":"id","type":{"type":"string","logicalType":"uuid"},"doc":"Unique identifier for this specific event"},{"name":"timestamp","type":{"type":"long","logicalType":"timestamp-millis"},"doc":"Instant the event took place (not necessary when it was published)"},{"name":"correlation_id","type":["null",{"type":"string","logicalType":"uuid"}],"doc":"id of the event that resulted in this\\nevent being published (optional)","default":null},{"name":"publisher_context","type":["null",{"type":"map","values":{"type":"string","avro.java.string":"String"},"avro.java.string":"String"}],"doc":"optional set of key-value pairs of context to be echoed back\\nin any resulting message (like a richer\\ncorrelationId.\\n\\nThese values are likely only meaningful to the publisher\\nof the correlated event","default":null}]}},{"name":"auth_code","type":{"type":"record","name":"EncryptedString","namespace":"com.foo","doc":"A string that was encrypted with AES (using CTR mode), its key encrypted with RSA, and the nonce used for the encryption.","fields":[{"name":"value","type":"string","doc":"A sequence of bytes that has been AES encrypted in CTR mode."},{"name":"nonce","type":"string","doc":"A nonce, used by the CTR encryption mode for our encrypted value. Not encrypted, not a secret."},{"name":"key","type":"string","doc":"An AES key, used to encrypt the value field, that has itself been encrypted using RSA."}]},"doc":"Encrypted auth_code received when user authorizes the app."},{"name":"refresh_token","type":"com.foo.EncryptedString","doc":"Encrypted refresh_token generated by using clientId and clientSecret."},{"name":"triggered_by","type":{"type":"string","logicalType":"uuid"},"doc":"ID of the user who triggered this event."}]},"schemaFormat":"application/vnd.aai.asyncapi;version=2.0.0","x-parser-message-parsed":true,"x-parser-message-name":"<anonymous-message-1>"}}}},"x-parser-spec-parsed":true}';

const inputWithOneOfReferenceAvro190 = fs.readFileSync(path.resolve(__dirname, './asyncapi-avro-113-1.9.0.yaml'), 'utf8');
const outputWithOneOfReferenceAvro190 = '{"asyncapi":"2.0.0","info":{"title":"My API","version":"1.0.0"},"channels":{"mychannel":{"publish":{"message":{"payload":{"oneOf":[{"type":"object","required":["streetaddress","city"],"properties":{"streetaddress":{"type":"string","x-parser-schema-id":"<anonymous-schema-2>"},"city":{"type":"string","x-parser-schema-id":"<anonymous-schema-3>"}},"x-parser-schema-id":"com.example.Address"},{"type":"object","required":["firstname","lastname"],"properties":{"firstname":{"type":"string","x-parser-schema-id":"<anonymous-schema-4>"},"lastname":{"type":"string","x-parser-schema-id":"<anonymous-schema-5>"},"address":{"type":"object","required":["streetaddress","city"],"properties":{"streetaddress":{"type":"string","x-parser-schema-id":"<anonymous-schema-2>"},"city":{"type":"string","x-parser-schema-id":"<anonymous-schema-3>"}},"x-parser-schema-id":"com.example.Address"}},"x-parser-schema-id":"com.example.Person"}],"x-parser-schema-id":"<anonymous-schema-1>"},"x-parser-original-schema-format":"application/vnd.apache.avro;version=1.9.0","x-parser-original-payload":[{"type":"record","name":"Address","namespace":"com.example","fields":[{"name":"streetaddress","type":"string"},{"name":"city","type":"string"}]},{"type":"record","name":"Person","namespace":"com.example","fields":[{"name":"firstname","type":"string"},{"name":"lastname","type":"string"},{"name":"address","type":"com.example.Address"}]}],"schemaFormat":"application/vnd.aai.asyncapi;version=2.0.0","x-parser-message-parsed":true,"x-parser-message-name":"<anonymous-message-1>"}}}},"x-parser-spec-parsed":true}';

const inputWithRecordReferencesAvro190 = fs.readFileSync(path.resolve(__dirname, './asyncapi-avro-148-record-references.yml'), 'utf8');
const outputWithRecordReferencesAvro190 = '{"asyncapi":"2.4.0","info":{"title":"Validate record references generation","version":"1.0.0"},"channels":{"test-topic":{"description":"Test"}},"components":{"messages":{"ValidateRecordReferences":{"name":"ValidateRecordReferences","title":"ValidateRecordReferences","payload":{"type":"object","required":["Record1","simpleField"],"properties":{"Record1":{"type":"object","required":["string"],"properties":{"string":{"type":"string","description":"field in Record1","x-parser-schema-id":"<anonymous-schema-1>"}},"description":"Reused in other fields","x-parser-schema-id":"Record1"},"FieldThatDefineRecordInUnion":{"oneOf":[{"type":"object","required":["number"],"properties":{"number":{"type":"integer","minimum":0,"maximum":2,"description":"field in RecordDefinedInUnion","x-parser-schema-id":"<anonymous-schema-3>"}},"x-parser-schema-id":"com.example.model.RecordDefinedInUnion"},{"type":"null","x-parser-schema-id":"<anonymous-schema-4>"}],"default":null,"x-parser-schema-id":"<anonymous-schema-2>"},"FieldThatReuseRecordDefinedInUnion":{"oneOf":[{"type":"object","required":["number"],"properties":{"number":{"type":"integer","minimum":0,"maximum":2,"description":"field in RecordDefinedInUnion","x-parser-schema-id":"<anonymous-schema-3>"}},"x-parser-schema-id":"com.example.model.RecordDefinedInUnion"},{"type":"null","x-parser-schema-id":"<anonymous-schema-6>"}],"default":null,"x-parser-schema-id":"<anonymous-schema-5>"},"FieldThatReuseRecord1":{"oneOf":[{"type":"object","required":["string"],"properties":{"string":{"type":"string","description":"field in Record1","x-parser-schema-id":"<anonymous-schema-1>"}},"description":"Reused in other fields","x-parser-schema-id":"Record1"},{"type":"null","x-parser-schema-id":"<anonymous-schema-8>"}],"default":null,"x-parser-schema-id":"<anonymous-schema-7>"},"simpleField":{"type":"string","x-parser-schema-id":"<anonymous-schema-9>"}},"x-parser-schema-id":"com.example.RecordWithReferences"},"x-parser-original-schema-format":"application/vnd.apache.avro;version=1.9.0","x-parser-original-payload":{"type":"record","name":"RecordWithReferences","namespace":"com.example","fields":[{"name":"Record1","type":{"type":"record","name":"Record1","doc":"Reused in other fields","fields":[{"name":"string","type":"string","doc":"field in Record1"}]}},{"name":"FieldThatDefineRecordInUnion","type":["null",{"type":"record","name":"RecordDefinedInUnion","namespace":"com.example.model","doc":"","fields":[{"name":"number","type":"long","doc":"field in RecordDefinedInUnion","minimum":0,"maximum":2}]}],"default":null},{"name":"FieldThatReuseRecordDefinedInUnion","type":["null","com.example.model.RecordDefinedInUnion"],"default":null},{"name":"FieldThatReuseRecord1","type":["null","Record1"],"default":null},{"name":"simpleField","type":"string"}]},"schemaFormat":"application/vnd.aai.asyncapi;version=2.4.0","x-parser-message-parsed":true}}},"x-parser-spec-parsed":true}';

parser.registerSchemaParser(avroSchemaParser);

describe('parse()', function() {
  it('should parse Avro schema 1.8.2', async function() {
    const result = await parser.parse(inputWithAvro182, { path: __filename });
    expect(JSON.stringify(result.json())).toEqual(outputWithAvro182);
  });
  it('should parse Avro schema 1.9.0', async function() {
    const result = await parser.parse(inputWithAvro190, { path: __filename });
    expect(JSON.stringify(result.json())).toEqual(outputWithAvro190);
  });

  it('should parse Avro schema 1.9.0 with a namespace', async function() {
    const result = await parser.parse(inputWithAvro190WithNamespace, { path: __filename });
    expect(JSON.stringify(result.json())).toEqual(outputWithAvro190WithNamespace);
  });
  it('should parse Avro schema in kafka bindings', async function() {
    const result = await parser.parse(inputWithAvro190WithBindings, { path: __filename });
    expect(JSON.stringify(result.json())).toEqual(outputWithAvro190WithBindings);
  });
  it('should handle additional Avro attributes like', async function() {
    const result = await parser.parse(inputWithAvroAdditionalAttributes, { path: __filename });
    expect(JSON.stringify(result.json())).toEqual(outputWithAvroAdditionalAttributes);
  });
  it('should reject invalid Avro schemas', async function() {
    await expect(parser.parse(inputWithInvalidAvro, { path: __filename }))
      .rejects.toThrow('unknown type: undefined');
  });
  it('should identify bugs in Avro schemas', async function() {
    await expect(parser.parse(inputWithBrokenAvro, { path: __filename }))
      .rejects.toThrow('undefined type name: notAValidAvroType');
  });
  it('Issue #111 should handle pre defined records in schemas', async function() {
    const result = await parser.parse(inputWithSubAvro190, { path: __filename });
    expect(JSON.stringify(result.json())).toEqual(outputWithSubAvro190);
  });
  it('Issue #113 should handle pre defined records in top level oneOf schema', async function() {
    const result = await parser.parse(inputWithOneOfReferenceAvro190, { path: __filename });
    console.log(JSON.stringify(result.json()));
    expect(JSON.stringify(result.json())).toEqual(outputWithOneOfReferenceAvro190);
  });

  it('Issue #148 should handle records references in a top level record', async function() {
    const result = await parser.parse(inputWithRecordReferencesAvro190, { path: __filename });
    console.log(JSON.stringify(result.json()));
    expect(JSON.stringify(result.json())).toEqual(outputWithRecordReferencesAvro190);
  });
});
