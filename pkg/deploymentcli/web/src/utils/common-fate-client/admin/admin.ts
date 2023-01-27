/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */
import useSwr from 'swr'
import type {
  SWRConfiguration,
  Key
} from 'swr'
import type {
  ListAccessRulesDetailResponseResponse,
  AdminListAccessRulesParams,
  AccessRuleDetail,
  ErrorResponseResponse,
  CreateAccessRuleRequestBody,
  DeploymentVersionResponseResponse,
  ListRequestsResponseResponse,
  AdminListRequestsParams,
  User,
  AdminUpdateUserBody,
  ListUserResponseResponse,
  AdminListUsersParams,
  CreateUserRequestBody,
  ListGroupsResponseResponse,
  AdminListGroupsParams,
  Group,
  CreateGroupRequestBody,
  Provider,
  AdminListProviderArgOptionsParams,
  ListProviderSetupsResponseResponse,
  ProviderSetupResponseResponse,
  CreateProviderSetupRequestBody,
  ListProviderSetupsV2ResponseResponse,
  CreateProviderSetupRequestV2Body,
  ProviderSetupV2ResponseResponse,
  ProviderSetupInstructions,
  CompleteProviderSetupResponseResponse,
  ProviderSetupStepCompleteRequestBody,
  IdentityConfigurationResponseResponse
} from '.././types'
import type {
  ArgSchema,
  ArgOptionsResponseResponse
} from '.././types/accesshandler-openapi.yml'
import { customInstanceCommonfate } from '../../custom-instance'
import type { ErrorType } from '../../custom-instance'


  
  // eslint-disable-next-line
  type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;

/**
 * List all access rules
 * @summary List Access Rules
 */
export const adminListAccessRules = (
    params?: AdminListAccessRulesParams,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ListAccessRulesDetailResponseResponse>(
      {url: `/api/v1/admin/access-rules`, method: 'get',
        params
    },
      options);
    }
  

export const getAdminListAccessRulesKey = (params?: AdminListAccessRulesParams,) => [`/api/v1/admin/access-rules`, ...(params ? [params]: [])];

    
export type AdminListAccessRulesQueryResult = NonNullable<Awaited<ReturnType<typeof adminListAccessRules>>>
export type AdminListAccessRulesQueryError = ErrorType<unknown>

export const useAdminListAccessRules = <TError = ErrorType<unknown>>(
 params?: AdminListAccessRulesParams, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminListAccessRules>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminListAccessRulesKey(params) : null);
  const swrFn = () => adminListAccessRules(params, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Create an access rule
 * @summary Create Access Rule
 */
export const adminCreateAccessRule = (
    createAccessRuleRequestBody: CreateAccessRuleRequestBody,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<AccessRuleDetail>(
      {url: `/api/v1/admin/access-rules`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createAccessRuleRequestBody
    },
      options);
    }
  

/**
 * Get an Access Rule.
 * @summary Get Access Rule
 */
export const adminGetAccessRule = (
    ruleId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<AccessRuleDetail>(
      {url: `/api/v1/admin/access-rules/${ruleId}`, method: 'get'
    },
      options);
    }
  

export const getAdminGetAccessRuleKey = (ruleId: string,) => [`/api/v1/admin/access-rules/${ruleId}`];

    
export type AdminGetAccessRuleQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetAccessRule>>>
export type AdminGetAccessRuleQueryError = ErrorType<ErrorResponseResponse>

export const useAdminGetAccessRule = <TError = ErrorType<ErrorResponseResponse>>(
 ruleId: string, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetAccessRule>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false && !!(ruleId)
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetAccessRuleKey(ruleId) : null);
  const swrFn = () => adminGetAccessRule(ruleId, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Updates an Access Rule. Updating a rule creates a new version.
 * @summary Update Access Rule
 */
export const adminUpdateAccessRule = (
    ruleId: string,
    createAccessRuleRequestBody: CreateAccessRuleRequestBody,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<AccessRuleDetail>(
      {url: `/api/v1/admin/access-rules/${ruleId}`, method: 'put',
      headers: {'Content-Type': 'application/json', },
      data: createAccessRuleRequestBody
    },
      options);
    }
  

/**
 * Marks an access rule as archived.
Any pending requests for this access rule will be cancelled.
 * @summary Archive Access Rule
 */
export const adminArchiveAccessRule = (
    ruleId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<AccessRuleDetail>(
      {url: `/api/v1/admin/access-rules/${ruleId}/archive`, method: 'post'
    },
      options);
    }
  

/**
 * Returns a version history for a particular Access Rule.
 * @summary Get Access Rule version history
 */
export const adminGetAccessRuleVersions = (
    ruleId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ListAccessRulesDetailResponseResponse>(
      {url: `/api/v1/admin/access-rules/${ruleId}/versions`, method: 'get'
    },
      options);
    }
  

export const getAdminGetAccessRuleVersionsKey = (ruleId: string,) => [`/api/v1/admin/access-rules/${ruleId}/versions`];

    
export type AdminGetAccessRuleVersionsQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetAccessRuleVersions>>>
export type AdminGetAccessRuleVersionsQueryError = ErrorType<void>

export const useAdminGetAccessRuleVersions = <TError = ErrorType<void>>(
 ruleId: string, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetAccessRuleVersions>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false && !!(ruleId)
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetAccessRuleVersionsKey(ruleId) : null);
  const swrFn = () => adminGetAccessRuleVersions(ruleId, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Returns a specific version for an Access Rule.
 * @summary Get Access Rule Version
 */
export const adminGetAccessRuleVersion = (
    ruleId: string,
    version: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<AccessRuleDetail>(
      {url: `/api/v1/admin/access-rules/${ruleId}/versions/${version}`, method: 'get'
    },
      options);
    }
  

export const getAdminGetAccessRuleVersionKey = (ruleId: string,
    version: string,) => [`/api/v1/admin/access-rules/${ruleId}/versions/${version}`];

    
export type AdminGetAccessRuleVersionQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetAccessRuleVersion>>>
export type AdminGetAccessRuleVersionQueryError = ErrorType<ErrorResponseResponse>

export const useAdminGetAccessRuleVersion = <TError = ErrorType<ErrorResponseResponse>>(
 ruleId: string,
    version: string, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetAccessRuleVersion>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false && !!(ruleId && version)
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetAccessRuleVersionKey(ruleId,version) : null);
  const swrFn = () => adminGetAccessRuleVersion(ruleId,version, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Returns the version information
 * @summary Get deployment version details
 */
export const adminGetDeploymentVersion = (
    
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<DeploymentVersionResponseResponse>(
      {url: `/api/v1/admin/deployment/version`, method: 'get'
    },
      options);
    }
  

export const getAdminGetDeploymentVersionKey = () => [`/api/v1/admin/deployment/version`];

    
export type AdminGetDeploymentVersionQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetDeploymentVersion>>>
export type AdminGetDeploymentVersionQueryError = ErrorType<unknown>

export const useAdminGetDeploymentVersion = <TError = ErrorType<unknown>>(
  options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetDeploymentVersion>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetDeploymentVersionKey() : null);
  const swrFn = () => adminGetDeploymentVersion(requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Return a list of all requests
 * @summary Your GET endpoint
 */
export const adminListRequests = (
    params?: AdminListRequestsParams,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ListRequestsResponseResponse>(
      {url: `/api/v1/admin/requests`, method: 'get',
        params
    },
      options);
    }
  

export const getAdminListRequestsKey = (params?: AdminListRequestsParams,) => [`/api/v1/admin/requests`, ...(params ? [params]: [])];

    
export type AdminListRequestsQueryResult = NonNullable<Awaited<ReturnType<typeof adminListRequests>>>
export type AdminListRequestsQueryError = ErrorType<unknown>

export const useAdminListRequests = <TError = ErrorType<unknown>>(
 params?: AdminListRequestsParams, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminListRequests>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminListRequestsKey(params) : null);
  const swrFn = () => adminListRequests(params, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Update a user including group membership
 * @summary Update User
 */
export const adminUpdateUser = (
    userId: string,
    adminUpdateUserBody: AdminUpdateUserBody,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<User>(
      {url: `/api/v1/admin/users/${userId}`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: adminUpdateUserBody
    },
      options);
    }
  

/**
 * Fetch a list of users
 * @summary Returns a list of users
 */
export const adminListUsers = (
    params?: AdminListUsersParams,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ListUserResponseResponse>(
      {url: `/api/v1/admin/users`, method: 'get',
        params
    },
      options);
    }
  

export const getAdminListUsersKey = (params?: AdminListUsersParams,) => [`/api/v1/admin/users`, ...(params ? [params]: [])];

    
export type AdminListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof adminListUsers>>>
export type AdminListUsersQueryError = ErrorType<unknown>

export const useAdminListUsers = <TError = ErrorType<unknown>>(
 params?: AdminListUsersParams, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminListUsers>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminListUsersKey(params) : null);
  const swrFn = () => adminListUsers(params, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Create new user in the Cognito user pool if it is enabled.
 * @summary Create User
 */
export const adminCreateUser = (
    createUserRequestBody: CreateUserRequestBody,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<User>(
      {url: `/api/v1/admin/users`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createUserRequestBody
    },
      options);
    }
  

/**
 * Lists all active groups
 * @summary List groups
 */
export const adminListGroups = (
    params?: AdminListGroupsParams,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ListGroupsResponseResponse>(
      {url: `/api/v1/admin/groups`, method: 'get',
        params
    },
      options);
    }
  

export const getAdminListGroupsKey = (params?: AdminListGroupsParams,) => [`/api/v1/admin/groups`, ...(params ? [params]: [])];

    
export type AdminListGroupsQueryResult = NonNullable<Awaited<ReturnType<typeof adminListGroups>>>
export type AdminListGroupsQueryError = ErrorType<unknown>

export const useAdminListGroups = <TError = ErrorType<unknown>>(
 params?: AdminListGroupsParams, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminListGroups>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminListGroupsKey(params) : null);
  const swrFn = () => adminListGroups(params, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Create new group in the Cognito user pool if it is enabled.
 * @summary Create Group
 */
export const adminCreateGroup = (
    createGroupRequestBody: CreateGroupRequestBody,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<Group>(
      {url: `/api/v1/admin/groups`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createGroupRequestBody
    },
      options);
    }
  

/**
 * Returns information for a group.
 * @summary Get Group Details
 */
export const adminGetGroup = (
    groupId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<Group>(
      {url: `/api/v1/admin/groups/${groupId}`, method: 'get'
    },
      options);
    }
  

export const getAdminGetGroupKey = (groupId: string,) => [`/api/v1/admin/groups/${groupId}`];

    
export type AdminGetGroupQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetGroup>>>
export type AdminGetGroupQueryError = ErrorType<unknown>

export const useAdminGetGroup = <TError = ErrorType<unknown>>(
 groupId: string, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetGroup>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false && !!(groupId)
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetGroupKey(groupId) : null);
  const swrFn = () => adminGetGroup(groupId, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Update a group
 * @summary Update Group
 */
export const adminUpdateGroup = (
    groupId: string,
    createGroupRequestBody: CreateGroupRequestBody,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<Group>(
      {url: `/api/v1/admin/groups/${groupId}`, method: 'put',
      headers: {'Content-Type': 'application/json', },
      data: createGroupRequestBody
    },
      options);
    }
  

/**
 * Delete an internal group
 * @summary Delete Group
 */
export const adminDeleteGroup = (
    groupId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<void>(
      {url: `/api/v1/admin/groups/${groupId}`, method: 'delete'
    },
      options);
    }
  

/**
 * List providers
 * @summary List providers
 */
export const adminListProviders = (
    
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<Provider[]>(
      {url: `/api/v1/admin/providers`, method: 'get'
    },
      options);
    }
  

export const getAdminListProvidersKey = () => [`/api/v1/admin/providers`];

    
export type AdminListProvidersQueryResult = NonNullable<Awaited<ReturnType<typeof adminListProviders>>>
export type AdminListProvidersQueryError = ErrorType<ErrorResponseResponse>

export const useAdminListProviders = <TError = ErrorType<ErrorResponseResponse>>(
  options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminListProviders>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminListProvidersKey() : null);
  const swrFn = () => adminListProviders(requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Get provider by id
 * @summary List providers
 */
export const adminGetProvider = (
    providerId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<Provider>(
      {url: `/api/v1/admin/providers/${providerId}`, method: 'get'
    },
      options);
    }
  

export const getAdminGetProviderKey = (providerId: string,) => [`/api/v1/admin/providers/${providerId}`];

    
export type AdminGetProviderQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetProvider>>>
export type AdminGetProviderQueryError = ErrorType<ErrorResponseResponse>

export const useAdminGetProvider = <TError = ErrorType<ErrorResponseResponse>>(
 providerId: string, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetProvider>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false && !!(providerId)
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetProviderKey(providerId) : null);
  const swrFn = () => adminGetProvider(providerId, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Gets the argSchema describing the args for this provider
 * @summary Get provider arg schema
 */
export const adminGetProviderArgs = (
    providerId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ArgSchema>(
      {url: `/api/v1/admin/providers/${providerId}/args`, method: 'get'
    },
      options);
    }
  

export const getAdminGetProviderArgsKey = (providerId: string,) => [`/api/v1/admin/providers/${providerId}/args`];

    
export type AdminGetProviderArgsQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetProviderArgs>>>
export type AdminGetProviderArgsQueryError = ErrorType<ErrorResponseResponse>

export const useAdminGetProviderArgs = <TError = ErrorType<ErrorResponseResponse>>(
 providerId: string, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetProviderArgs>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false && !!(providerId)
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetProviderArgsKey(providerId) : null);
  const swrFn = () => adminGetProviderArgs(providerId, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Returns the options for a particular Access Provider argument. The options may be cached. To refresh the cache, pass the `refresh` query parameter.
 * @summary List provider arg options
 */
export const adminListProviderArgOptions = (
    providerId: string,
    argId: string,
    params?: AdminListProviderArgOptionsParams,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ArgOptionsResponseResponse>(
      {url: `/api/v1/admin/providers/${providerId}/args/${argId}/options`, method: 'get',
        params
    },
      options);
    }
  

export const getAdminListProviderArgOptionsKey = (providerId: string,
    argId: string,
    params?: AdminListProviderArgOptionsParams,) => [`/api/v1/admin/providers/${providerId}/args/${argId}/options`, ...(params ? [params]: [])];

    
export type AdminListProviderArgOptionsQueryResult = NonNullable<Awaited<ReturnType<typeof adminListProviderArgOptions>>>
export type AdminListProviderArgOptionsQueryError = ErrorType<ErrorResponseResponse>

export const useAdminListProviderArgOptions = <TError = ErrorType<ErrorResponseResponse>>(
 providerId: string,
    argId: string,
    params?: AdminListProviderArgOptionsParams, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminListProviderArgOptions>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false && !!(providerId && argId)
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminListProviderArgOptionsKey(providerId,argId,params) : null);
  const swrFn = () => adminListProviderArgOptions(providerId,argId,params, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * List providers which are still in the process of being set up.
 * @summary List the provider setups in progress
 */
export const adminListProvidersetups = (
    
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ListProviderSetupsResponseResponse>(
      {url: `/api/v1/admin/providersetups`, method: 'get'
    },
      options);
    }
  

export const getAdminListProvidersetupsKey = () => [`/api/v1/admin/providersetups`];

    
export type AdminListProvidersetupsQueryResult = NonNullable<Awaited<ReturnType<typeof adminListProvidersetups>>>
export type AdminListProvidersetupsQueryError = ErrorType<unknown>

export const useAdminListProvidersetups = <TError = ErrorType<unknown>>(
  options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminListProvidersetups>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminListProvidersetupsKey() : null);
  const swrFn = () => adminListProvidersetups(requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Begins the guided setup process for a new Access Provider.
 * @summary Begin the setup process for a new Access Provider
 */
export const adminCreateProvidersetup = (
    createProviderSetupRequestBody: CreateProviderSetupRequestBody,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ProviderSetupResponseResponse>(
      {url: `/api/v1/admin/providersetups`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createProviderSetupRequestBody
    },
      options);
    }
  

/**
 * List providers which are still in the process of being set up.
 * @summary List the provider setups in progress
 */
export const adminListProvidersetupsv2 = (
    
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ListProviderSetupsV2ResponseResponse>(
      {url: `/api/v1/admin/providersetupsv2`, method: 'get'
    },
      options);
    }
  

export const getAdminListProvidersetupsv2Key = () => [`/api/v1/admin/providersetupsv2`];

    
export type AdminListProvidersetupsv2QueryResult = NonNullable<Awaited<ReturnType<typeof adminListProvidersetupsv2>>>
export type AdminListProvidersetupsv2QueryError = ErrorType<unknown>

export const useAdminListProvidersetupsv2 = <TError = ErrorType<unknown>>(
  options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminListProvidersetupsv2>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminListProvidersetupsv2Key() : null);
  const swrFn = () => adminListProvidersetupsv2(requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Begins the guided setup process for a new Access Provider.
 * @summary Begin the setup process for a new Access Provider
 */
export const adminCreateProvidersetupv2 = (
    createProviderSetupRequestV2Body: CreateProviderSetupRequestV2Body,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ProviderSetupResponseResponse>(
      {url: `/api/v1/admin/providersetupsv2`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createProviderSetupRequestV2Body
    },
      options);
    }
  

/**
 * Get the setup instructions for an Access Provider.
 * @summary Get an in-progress provider setup
 */
export const adminGetProvidersetup = (
    providersetupId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ProviderSetupResponseResponse>(
      {url: `/api/v1/admin/providersetups/${providersetupId}`, method: 'get'
    },
      options);
    }
  

export const getAdminGetProvidersetupKey = (providersetupId: string,) => [`/api/v1/admin/providersetups/${providersetupId}`];

    
export type AdminGetProvidersetupQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetProvidersetup>>>
export type AdminGetProvidersetupQueryError = ErrorType<unknown>

export const useAdminGetProvidersetup = <TError = ErrorType<unknown>>(
 providersetupId: string, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetProvidersetup>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false && !!(providersetupId)
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetProvidersetupKey(providersetupId) : null);
  const swrFn = () => adminGetProvidersetup(providersetupId, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Removes an in-progress provider setup and deletes all data relating to it.

Returns the deleted provider.
 * @summary Delete an in-progress provider setup
 */
export const adminDeleteProvidersetupv2 = (
    providersetupId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ProviderSetupResponseResponse>(
      {url: `/api/v1/admin/providersetups/${providersetupId}`, method: 'delete'
    },
      options);
    }
  

/**
 * Get the setup instructions for an Access Provider.
 * @summary Get an in-progress provider setup
 */
export const adminGetProvidersetupv2 = (
    providersetupId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ProviderSetupV2ResponseResponse>(
      {url: `/api/v1/admin/providersetupsv2/${providersetupId}`, method: 'get'
    },
      options);
    }
  

export const getAdminGetProvidersetupv2Key = (providersetupId: string,) => [`/api/v1/admin/providersetupsv2/${providersetupId}`];

    
export type AdminGetProvidersetupv2QueryResult = NonNullable<Awaited<ReturnType<typeof adminGetProvidersetupv2>>>
export type AdminGetProvidersetupv2QueryError = ErrorType<unknown>

export const useAdminGetProvidersetupv2 = <TError = ErrorType<unknown>>(
 providersetupId: string, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetProvidersetupv2>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false && !!(providersetupId)
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetProvidersetupv2Key(providersetupId) : null);
  const swrFn = () => adminGetProvidersetupv2(providersetupId, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Removes an in-progress provider setup and deletes all data relating to it.

Returns the deleted provider.
 * @summary Delete an in-progress provider setup
 */
export const adminDeleteProvidersetup = (
    providersetupId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ProviderSetupV2ResponseResponse>(
      {url: `/api/v1/admin/providersetupsv2/${providersetupId}`, method: 'delete'
    },
      options);
    }
  

/**
 * Get the setup instructions for an Access Provider.
 * @summary Get the setup instructions for an Access Provider
 */
export const adminGetProvidersetupInstructions = (
    providersetupId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ProviderSetupInstructions>(
      {url: `/api/v1/admin/providersetups/${providersetupId}/instructions`, method: 'get'
    },
      options);
    }
  

export const getAdminGetProvidersetupInstructionsKey = (providersetupId: string,) => [`/api/v1/admin/providersetups/${providersetupId}/instructions`];

    
export type AdminGetProvidersetupInstructionsQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetProvidersetupInstructions>>>
export type AdminGetProvidersetupInstructionsQueryError = ErrorType<unknown>

export const useAdminGetProvidersetupInstructions = <TError = ErrorType<unknown>>(
 providersetupId: string, options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetProvidersetupInstructions>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false && !!(providersetupId)
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetProvidersetupInstructionsKey(providersetupId) : null);
  const swrFn = () => adminGetProvidersetupInstructions(providersetupId, requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}

/**
 * Validates the configuration values for an access provider being setup.

Will return a HTTP200 OK response even if there are validation errors. The errors can be found by inspecting the validation diagnostics in the `configValidation` field.

Will return a HTTP400 response if the provider cannot be validated (for example, the config values for the provider are incomplete).
 * @summary Validate the configuration for a Provider Setup
 */
export const adminValidateProvidersetup = (
    providersetupId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ProviderSetupResponseResponse>(
      {url: `/api/v1/admin/providersetups/${providersetupId}/validate`, method: 'post'
    },
      options);
    }
  

/**
 * If Runtime Configuration is enabled, this will write the Access Provider to the configuration storage and activate it. If Runtime Configuration is disabled, this endpoint does nothing.
 * @summary Complete a ProviderSetup
 */
export const adminCompleteProvidersetup = (
    providersetupId: string,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<CompleteProviderSetupResponseResponse>(
      {url: `/api/v1/admin/providersetups/${providersetupId}/complete`, method: 'post'
    },
      options);
    }
  

/**
 * The updated provider setup.
 * @summary Update the completion status for a Provider setup step
 */
export const adminSubmitProvidersetupStep = (
    providersetupId: string,
    stepIndex: number,
    providerSetupStepCompleteRequestBody: ProviderSetupStepCompleteRequestBody,
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<ProviderSetupResponseResponse>(
      {url: `/api/v1/admin/providersetups/${providersetupId}/steps/${stepIndex}/complete`, method: 'put',
      headers: {'Content-Type': 'application/json', },
      data: providerSetupStepCompleteRequestBody
    },
      options);
    }
  

/**
 * Run the identity sync operation on demand
 * @summary Sync Identity
 */
export const adminSyncIdentity = (
    
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<void>(
      {url: `/api/v1/admin/identity/sync`, method: 'post'
    },
      options);
    }
  

/**
 * Get information about the identity configuration
 * @summary Get identity configuration
 */
export const adminGetIdentityConfiguration = (
    
 options?: SecondParameter<typeof customInstanceCommonfate>) => {
      return customInstanceCommonfate<IdentityConfigurationResponseResponse>(
      {url: `/api/v1/admin/identity`, method: 'get'
    },
      options);
    }
  

export const getAdminGetIdentityConfigurationKey = () => [`/api/v1/admin/identity`];

    
export type AdminGetIdentityConfigurationQueryResult = NonNullable<Awaited<ReturnType<typeof adminGetIdentityConfiguration>>>
export type AdminGetIdentityConfigurationQueryError = ErrorType<ErrorResponseResponse>

export const useAdminGetIdentityConfiguration = <TError = ErrorType<ErrorResponseResponse>>(
  options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof adminGetIdentityConfiguration>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceCommonfate> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getAdminGetIdentityConfigurationKey() : null);
  const swrFn = () => adminGetIdentityConfiguration(requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}
