targetScope = 'resourceGroup'

@description('Import functions and abrivations.')
import * as imports from '..//../BicepModules/exports.bicep'

@description('Environment to deploy the resources to.')
param env string

@description('ACR login server.')
param acrLoginServer string

@description('Container Apps Environment Id.')
param containerAppsEnvironmentId string 

@description('Managed Identity Resource Id that has access to acr, app config store etc.')
param managedIdentityResourceId string

@description('Image tag to deploy.')
param imageTag string

@description('App Configuration Store Endpoint.')
param appConfigurationStoreEndpoint string

@description('App Configuration Store Resource ID.')
param appConfigurationStoreResourceId string

@description('Application Insights Connection String.')
param applicationInsightsConnectionString string

@description('Common key vault resource ID.')
param commonKeyVaultResourceId string

@description('Common resource group name.')
param commonResourceGroupName string

@description('CosmosDB Account name.')
param cosmosDbAccountName string

@description('Service bus namespace resource id.')
param serviceBusNamespaceResourceId string

@description('Global resource group name.')
param globalResourceGroupName string

@description('Global key vault resource ID.')
param globalKeyVaultResourceId string

/* Variables */
@description('Service name.')
var serviceName = 'container'

module containerApp '../BicepModules/containerApps/containerApp.bicep' = {
  name: serviceName
  params: {
    resourceNameParams: {
      env: env
      instanceNumber: '01'
      serviceName: serviceName
      projectNameAbrivation: 'vdp'
      usage: ''
    }
    acrLoginServer: acrLoginServer
    applicationTargetPort: 8080
    containerAppsEnvironmentId: containerAppsEnvironmentId
    managedIdentityResourceId: managedIdentityResourceId
    identityType: 'SystemAssigned'
    probes: [
      {
        type: 'Liveness'
        httpGet: { 
          port: 8080
          path: '/health'
          scheme: 'HTTP'
        }
      }
      {
        type: 'Readiness'
        httpGet: {
          port: 8080
          path: '/readiness'
          scheme: 'HTTP'
        }
      }
      {
        type: 'Startup'
        httpGet: {
          port: 8080
          path: '/startup'
          scheme: 'HTTP'
        }
      }
    ]
    envVariables: [
      {
        name: 'ASPNETCORE_HTTP_PORTS'
        value: '8080'
      }
      {
        name: 'CONFIG_STORE_CONNECTIONSTRING'
        value: appConfigurationStoreEndpoint
      }
      {
        name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
        value: applicationInsightsConnectionString
      }
    ]
    image: '${acrLoginServer}/${serviceName}:${imageTag}'
  }
}

/* Role Assignments */
module roleAssignmentsGlobal '../BicepModules/roleAssignment/roleassignment.json' = {
  name: 'roleAssignmentsGlobal'
  scope: resourceGroup(globalResourceGroupName)
  params: {
    roleAssignments: [
      {
        roleDefinitionId: imports.roleDefinitionIds.kvSecretUser
        resourceId: globalKeyVaultResourceId
        principalId: containerApp.outputs.principalId
      }
    ]
  }
}
