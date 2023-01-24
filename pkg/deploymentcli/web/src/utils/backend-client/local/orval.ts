/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Deployment CLI
 * Deployment CLI
 * OpenAPI spec version: 1.0
 */
import useSwr from 'swr'
import type {
  SWRConfiguration,
  Key
} from 'swr'
import {
  rest
} from 'msw'
import {
  faker
} from '@faker-js/faker'
import { customInstanceLocal } from '../../custom-instance'
import type { ErrorType } from '../../custom-instance'
export type ListProvidersResponseResponse = {
  next: string | null;
  providers: Provider[];
};

export type ListRegistryProvidersResponseResponse = {
  next: string | null;
  providers: RegistryProvider[];
};

export type ErrorResponseResponse = {
  error?: string;
};

export interface Provider {
  team: string;
  name: string;
  version: string;
  alias: string;
  id: string;
}

export interface RegistryProvider {
  team: string;
  name: string;
  version: string;
}




  
  // eslint-disable-next-line
  type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;

/**
 * @summary Your GET endpoint
 */
export const listProviders = (
    
 options?: SecondParameter<typeof customInstanceLocal>) => {
      return customInstanceLocal<ListProvidersResponseResponse>(
      {url: `/api/v1/providers`, method: 'get'
    },
      options);
    }
  

export const getListProvidersKey = () => [`/api/v1/providers`];

    
export type ListProvidersQueryResult = NonNullable<Awaited<ReturnType<typeof listProviders>>>
export type ListProvidersQueryError = ErrorType<ErrorResponseResponse>

export const useListProviders = <TError = ErrorType<ErrorResponseResponse>>(
  options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof listProviders>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceLocal> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getListProvidersKey() : null);
  const swrFn = () => listProviders(requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}


/**
 * @summary Your GET endpoint
 */
export const listRegistryProviders = (
    
 options?: SecondParameter<typeof customInstanceLocal>) => {
      return customInstanceLocal<ListRegistryProvidersResponseResponse>(
      {url: `/api/v1/registry/providers`, method: 'get'
    },
      options);
    }
  

export const getListRegistryProvidersKey = () => [`/api/v1/registry/providers`];

    
export type ListRegistryProvidersQueryResult = NonNullable<Awaited<ReturnType<typeof listRegistryProviders>>>
export type ListRegistryProvidersQueryError = ErrorType<ErrorResponseResponse>

export const useListRegistryProviders = <TError = ErrorType<ErrorResponseResponse>>(
  options?: { swr?:SWRConfiguration<Awaited<ReturnType<typeof listRegistryProviders>>, TError> & { swrKey?: Key, enabled?: boolean }, request?: SecondParameter<typeof customInstanceLocal> }

  ) => {

  const {swr: swrOptions, request: requestOptions} = options ?? {}

  const isEnabled = swrOptions?.enabled !== false
    const swrKey = swrOptions?.swrKey ?? (() => isEnabled ? getListRegistryProvidersKey() : null);
  const swrFn = () => listRegistryProviders(requestOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(swrKey, swrFn, swrOptions)

  return {
    swrKey,
    ...query
  }
}




export const getListProvidersMock = () => ({next: faker.helpers.arrayElement([faker.random.word(), null]), providers: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({team: faker.random.word(), name: faker.random.word(), version: faker.random.word(), alias: faker.random.word(), id: faker.random.word()}))})

export const getListRegistryProvidersMock = () => ({next: faker.helpers.arrayElement([faker.random.word(), null]), providers: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({team: faker.random.word(), name: faker.random.word(), version: faker.random.word()}))})

export const getDeploymentCLIMSW = () => [
rest.get('*/api/v1/providers', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getListProvidersMock()),
        )
      }),rest.get('*/api/v1/registry/providers', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getListRegistryProvidersMock()),
        )
      }),]
