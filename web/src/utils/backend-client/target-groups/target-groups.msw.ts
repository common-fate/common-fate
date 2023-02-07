/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Common Fate
 * Common Fate API
 * OpenAPI spec version: 1.0
 */
import {
  rest
} from 'msw'
import {
  faker
} from '@faker-js/faker'

export const getListTargetGroupDeploymentsMock = () => ({res: faker.helpers.arrayElement([Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.helpers.arrayElement([faker.random.word(), undefined]), functionArn: faker.helpers.arrayElement([faker.random.word(), undefined]), awsAccount: faker.helpers.arrayElement([faker.random.word(), undefined]), healthy: faker.helpers.arrayElement([faker.datatype.boolean(), undefined]), diagnostics: faker.helpers.arrayElement([Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({})), undefined]), activeConfig: faker.helpers.arrayElement([faker.random.word(), undefined]), provider: faker.helpers.arrayElement([faker.random.word(), undefined])})), undefined]), next: faker.helpers.arrayElement([faker.random.word(), undefined])})

export const getGetTargetGroupMock = () => ({id: faker.random.word(), targetSchema: {From: faker.random.word(), Schema: {
        'cldthc87s000ofaondm66h56u': {id: faker.random.word(), title: faker.random.word(), description: faker.helpers.arrayElement([faker.random.word(), undefined]), ruleFormElement: faker.helpers.arrayElement(['INPUT','MULTISELECT','SELECT']), requestFormElement: faker.helpers.arrayElement(['SELECT']), groups: {
        'cldthc87s000nfaong3g855dg': {id: faker.random.word(), title: faker.random.word(), description: faker.helpers.arrayElement([faker.random.word(), undefined])}
      }}
      }}, icon: faker.random.word(), targetDeployments: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({Id: faker.random.word(), Priority: faker.datatype.number({min: undefined, max: undefined}), Valid: faker.datatype.boolean(), Diagnostics: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({}))}))})

export const getListTargetGroupsMock = () => ({targetGroups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), targetSchema: {From: faker.random.word(), Schema: {
        'cldthc87u000qfaondfy4cwfy': {id: faker.random.word(), title: faker.random.word(), description: faker.helpers.arrayElement([faker.random.word(), undefined]), ruleFormElement: faker.helpers.arrayElement(['INPUT','MULTISELECT','SELECT']), requestFormElement: faker.helpers.arrayElement(['SELECT']), groups: {
        'cldthc87u000pfaon4hukb2rt': {id: faker.random.word(), title: faker.random.word(), description: faker.helpers.arrayElement([faker.random.word(), undefined])}
      }}
      }}, icon: faker.random.word(), targetDeployments: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({Id: faker.random.word(), Priority: faker.datatype.number({min: undefined, max: undefined}), Valid: faker.datatype.boolean(), Diagnostics: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({}))}))})), next: faker.helpers.arrayElement([faker.random.word(), undefined])})

export const getTargetGroupsMSW = () => [
rest.get('*/api/v1/target-group-deployments/:id', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
        )
      }),rest.get('*/api/v1/target-group-deployments', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getListTargetGroupDeploymentsMock()),
        )
      }),rest.post('*/api/v1/target-group-deployments', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
        )
      }),rest.get('*/api/v1/target-groups/:id', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getGetTargetGroupMock()),
        )
      }),rest.get('*/api/v1/target-groups', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getListTargetGroupsMock()),
        )
      }),rest.post('*/api/v1/target-groups', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
        )
      }),rest.post('*/api/v1/target-groups/:id/link', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
        )
      }),]
