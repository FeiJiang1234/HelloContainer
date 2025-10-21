@export()
@description('Role definition ids.')
var roleDefinitionIds = {
  kvSecretUser: '00000000-0000-0000-0000-000000000001'
}

@export()
type resourceNameGeneratorParams = {
  @maxLength(3)
  @minLength(3)
  env: string

  @maxLength(3)
  @minLength(3)
  projectNameAbrivation: string

  location: string

  @maxLength(12)
  serviceName: string

  @maxLength(2)
  @minLength(2)
  instanceNumber: string

  usage: string
}
