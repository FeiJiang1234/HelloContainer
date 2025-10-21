/* Imports */
import * as imports from '../exports.bicep'

/* Parameters */
@description('Params needed for generating resource name.')
param resourceNameParams imports.resourceNameGeneratorParams

@description('Managed identity used for accessing acr, app config store and master key vault.')
param managedIdentityResourceId string

@description('Container Apps Environment Id to deploy the container app to.')
param containerAppsEnvironmentId string

@description('The target port for the application.')
param applicationTargetPort int

@description('The acr login server.')
param acrLoginServer string

@description('The image and tag to deploy.')
param image string

@description('The cpu resource for the container.')
param cpu string = '0.25'

@description('The memory resource for the container.')
param memory string = '0.5Gi'

@description('Environment variables for the container.')
param envVariables array = []

@description('Probes for the container.')
param probes array

@description('The minimum number of replicas.')
param minReplicas int = 2

@description('The maximum number of replicas.')
param maxReplicas int = 5

@description('The http scaler concurrent requests.')
param httpScalerConcurrentRequests string = '60'

@description('Identity type.')
@allowed([
  'SystemAssigned'
  'UserAssigned'
  'SystemAssigned,UserAssigned'
  ''
])
param identityType string = ''

@description('Managed identity to set on container app.')
param containerAppManagedIdentityResourceId string = ''


/* Variables */
@description('Container App Name.')
param containerAppName string = 'containerAppName'


@description('ASPNETCORE_ENVIRONMENT')
var ASPNETCORE_ENVIRONMENT = 'dev'

@description('Default environment variables.')
var defaultEnvVariables = [
  {
    name: 'ASPNETCORE_ENVIRONMENT'
    value: ASPNETCORE_ENVIRONMENT
  }
]

@description('Join default and custom environment variables.')
var env = union(defaultEnvVariables, envVariables)

@description('Identity object.')
var identity = contains(identityType, 'SystemAssigned') ? {
  type: 'SystemAssigned'
} : contains(identityType, 'UserAssigned') && containerAppManagedIdentityResourceId != '' ? {
  type: 'UserAssigned'
  userAssignedIdentities: {
    '${containerAppManagedIdentityResourceId}': {}
  }
} : null


resource containerApp 'Microsoft.App/containerApps@2022-06-01-preview' = {
  name: containerAppName
  identity: identity
  properties: {
    managedEnvironmentId: containerAppsEnvironmentId
    configuration: {
      ingress: {
        external: true
        targetPort: applicationTargetPort
        exposedPort: 0
        transport: 'Auto'
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
        allowInsecure: false
      }
      registries: [
        {
          identity: managedIdentityResourceId
          server: toLower(acrLoginServer)
        }
      ]
    }
    template: {
      containers: [
        {
          name: containerAppName
          image: image
          resources: {
            cpu: json(cpu)
            memory: memory
          }
          env: env
          probes: probes
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'http-scaler'
            http: {
              metadata: {
                 concurrentRequests: httpScalerConcurrentRequests
              }
            }
          }
        ]
      }
    }
  }
}


/* Outputs */
output id string = containerApp.id
output name string = containerApp.name
output principalId string = contains(identityType, 'SystemAssigned') ? containerApp.identity.principalId : ''
