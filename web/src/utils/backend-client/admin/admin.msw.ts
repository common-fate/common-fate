/**
 * Generated by orval v6.9.6 🍺
 * Do not edit manually.
 * Approvals
 * Granted Approvals API
 * OpenAPI spec version: 1.0
 */
import {
  rest
} from 'msw'
import {
  faker
} from '@faker-js/faker'
import {
  AccessRuleStatus,
  RequestStatus,
  ApprovalMethod,
  IdpStatus
} from '.././types'

export const getAdminListAccessRulesMock = () => ({accessRules: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), version: faker.random.word(), status: faker.helpers.arrayElement(Object.values(AccessRuleStatus)), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), approval: {users: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))}, name: faker.random.word(), description: faker.random.word(), metadata: {createdAt: faker.random.word(), createdBy: faker.random.word(), updatedAt: faker.random.word(), updatedBy: faker.random.word(), updateMessage: faker.helpers.arrayElement([faker.random.word(), undefined])}, target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl7a3hyol000bl749a6drgpqc': faker.random.word()
      }, withSelectable: {
        'cl7a3hyol000cl7490ktc5x1q': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getAdminCreateAccessRuleMock = () => ({id: faker.random.word(), version: faker.random.word(), status: faker.helpers.arrayElement(Object.values(AccessRuleStatus)), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), approval: {users: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))}, name: faker.random.word(), description: faker.random.word(), metadata: {createdAt: faker.random.word(), createdBy: faker.random.word(), updatedAt: faker.random.word(), updatedBy: faker.random.word(), updateMessage: faker.helpers.arrayElement([faker.random.word(), undefined])}, target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl7a3hyol000dl749hc1d8aln': faker.random.word()
      }, withSelectable: {
        'cl7a3hyol000el749h2lo1hen': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()})

export const getAdminGetAccessRuleMock = () => ({id: faker.random.word(), version: faker.random.word(), status: faker.helpers.arrayElement(Object.values(AccessRuleStatus)), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), approval: {users: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))}, name: faker.random.word(), description: faker.random.word(), metadata: {createdAt: faker.random.word(), createdBy: faker.random.word(), updatedAt: faker.random.word(), updatedBy: faker.random.word(), updateMessage: faker.helpers.arrayElement([faker.random.word(), undefined])}, target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl7a3hyop000fl7494521bnzs': faker.random.word()
      }, withSelectable: {
        'cl7a3hyop000gl7491f4nhcjx': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()})

export const getAdminUpdateAccessRuleMock = () => ({id: faker.random.word(), version: faker.random.word(), status: faker.helpers.arrayElement(Object.values(AccessRuleStatus)), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), approval: {users: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))}, name: faker.random.word(), description: faker.random.word(), metadata: {createdAt: faker.random.word(), createdBy: faker.random.word(), updatedAt: faker.random.word(), updatedBy: faker.random.word(), updateMessage: faker.helpers.arrayElement([faker.random.word(), undefined])}, target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl7a3hyop000hl749ch7c0p85': faker.random.word()
      }, withSelectable: {
        'cl7a3hyop000il749gf6wa8nb': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()})

export const getAdminGetAccessRuleVersionsMock = () => ({accessRules: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), version: faker.random.word(), status: faker.helpers.arrayElement(Object.values(AccessRuleStatus)), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), approval: {users: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))}, name: faker.random.word(), description: faker.random.word(), metadata: {createdAt: faker.random.word(), createdBy: faker.random.word(), updatedAt: faker.random.word(), updatedBy: faker.random.word(), updateMessage: faker.helpers.arrayElement([faker.random.word(), undefined])}, target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl7a3hyot000ll7490q6t7grb': faker.random.word()
      }, withSelectable: {
        'cl7a3hyot000ml7499nlx5o0x': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getAdminGetAccessRuleVersionMock = () => ({id: faker.random.word(), version: faker.random.word(), status: faker.helpers.arrayElement(Object.values(AccessRuleStatus)), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), approval: {users: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))}, name: faker.random.word(), description: faker.random.word(), metadata: {createdAt: faker.random.word(), createdBy: faker.random.word(), updatedAt: faker.random.word(), updatedBy: faker.random.word(), updateMessage: faker.helpers.arrayElement([faker.random.word(), undefined])}, target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl7a3hyov000nl749gup8762c': faker.random.word()
      }, withSelectable: {
        'cl7a3hyov000ol749b7k3eed5': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()})

export const getAdminListRequestsMock = () => ({requests: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestor: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), reason: faker.helpers.arrayElement([faker.random.word(), undefined]), timing: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, requestedAt: faker.random.word(), accessRule: {id: faker.random.word(), version: faker.random.word()}, updatedAt: faker.random.word(), grant: faker.helpers.arrayElement([{status: faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), subject: faker.internet.email(), provider: faker.random.word(), start: faker.random.word(), end: faker.random.word()}, undefined]), approvalMethod: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(ApprovalMethod)), undefined]), selectedWith: {
        'cl7a3hyox000pl7495x6ih2iv': {value: faker.random.word(), label: faker.random.word()}
      }})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getGetUsersMock = () => ({users: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), email: faker.random.word(), firstName: faker.random.word(), picture: faker.random.word(), status: faker.helpers.arrayElement(Object.values(IdpStatus)), lastName: faker.random.word(), updatedAt: faker.random.word()})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getGetGroupsMock = () => ({groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({name: faker.random.word(), description: faker.random.word(), id: faker.random.word(), memberCount: faker.datatype.number({min: undefined, max: undefined})})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getGetGroupMock = () => ({name: faker.random.word(), description: faker.random.word(), id: faker.random.word(), memberCount: faker.datatype.number({min: undefined, max: undefined})})

export const getAdminMSW = () => [
rest.get('*/api/v1/admin/access-rules', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getAdminListAccessRulesMock()),
        )
      }),rest.post('*/api/v1/admin/access-rules', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getAdminCreateAccessRuleMock()),
        )
      }),rest.get('*/api/v1/admin/access-rules/:ruleId', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getAdminGetAccessRuleMock()),
        )
      }),rest.put('*/api/v1/admin/access-rules/:ruleId', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getAdminUpdateAccessRuleMock()),
        )
      }),rest.get('*/api/v1/admin/access-rules/:ruleId/versions', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getAdminGetAccessRuleVersionsMock()),
        )
      }),rest.get('*/api/v1/admin/access-rules/:ruleId/versions/:version', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getAdminGetAccessRuleVersionMock()),
        )
      }),rest.get('*/api/v1/admin/requests', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getAdminListRequestsMock()),
        )
      }),rest.get('*/api/v1/admin/users', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getGetUsersMock()),
        )
      }),rest.get('*/api/v1/admin/groups', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getGetGroupsMock()),
        )
      }),rest.get('*/api/v1/admin/groups/:groupId', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getGetGroupMock()),
        )
      }),]
