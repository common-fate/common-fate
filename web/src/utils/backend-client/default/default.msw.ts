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
import {
  LogLevel,
  RequestStatus,
  GrantStatus
} from '.././types'

export const getAdminListTargetRoutesMock = () => ({routes: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({targetGroupId: faker.random.word(), handlerId: faker.random.word(), kind: faker.random.word(), priority: faker.datatype.number({min: undefined, max: undefined}), valid: faker.datatype.boolean(), diagnostics: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({level: faker.helpers.arrayElement(Object.values(LogLevel)), code: faker.random.word(), message: faker.random.word()}))})), next: faker.helpers.arrayElement([faker.random.word(), undefined])})

export const getUserListEntitlementsMock = () => ({targetGroups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), schema: {
        'clgolgunz0008j4on82x44dpo': {id: faker.random.word(), title: faker.random.word(), description: faker.helpers.arrayElement([faker.random.word(), undefined])}
      }, from: {publisher: faker.random.word(), name: faker.random.word(), version: faker.random.word(), kind: faker.random.word()}, icon: faker.random.word(), createdAt: faker.helpers.arrayElement([faker.random.word(), undefined]), updatedAt: faker.helpers.arrayElement([faker.random.word(), undefined])})), next: faker.helpers.arrayElement([faker.random.word(), undefined])})

export const getUserListEntitlementResourcesMock = () => ({resources: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.helpers.arrayElement([faker.random.word(), undefined])})), next: faker.helpers.arrayElement([faker.random.word(), undefined])})

export const getUserListEntitlementTargetsMock = () => ({targets: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), targetGroupId: faker.random.word(), targetGroupFrom: {publisher: faker.random.word(), name: faker.random.word(), version: faker.random.word(), kind: faker.random.word()}, fields: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), fieldTitle: faker.random.word(), fieldDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), valueLabel: faker.random.word(), valueDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), value: faker.random.word()}))})), next: faker.helpers.arrayElement([faker.random.word(), undefined])})

export const getUserListRequestsMock = () => ({requests: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), purpose: faker.helpers.arrayElement([{reason: faker.helpers.arrayElement([faker.random.word(), undefined])}, undefined]), accessGroups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestId: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), time: {maxDurationSeconds: faker.datatype.number({min: 60, max: 15724800})}, overrideTiming: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, updatedAt: faker.random.word(), createdAt: faker.random.word(), targets: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestId: faker.random.word(), accessGroupId: faker.random.word(), targetGroupId: faker.random.word(), targetGroupFrom: {publisher: faker.random.word(), name: faker.random.word(), version: faker.random.word(), kind: faker.random.word()}, fields: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), fieldTitle: faker.random.word(), fieldDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), valueLabel: faker.random.word(), valueDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), value: faker.random.word()})), status: faker.helpers.arrayElement(Object.values(GrantStatus))}))})), requestedBy: faker.random.word(), requestedAt: faker.random.word()})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getUserRequestPreflightMock = () => ({id: faker.random.word(), accessGroups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), status: faker.random.word(), time: {maxDurationSeconds: faker.datatype.number({min: 60, max: 15724800})}, targets: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), targetGroupId: faker.random.word(), targetGroupFrom: {publisher: faker.random.word(), name: faker.random.word(), version: faker.random.word(), kind: faker.random.word()}, fields: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), fieldTitle: faker.random.word(), fieldDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), valueLabel: faker.random.word(), valueDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), value: faker.random.word()}))}))})), createdAt: faker.random.word()})

export const getUserGetRequestMock = () => ({id: faker.random.word(), accessGroups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), status: faker.random.word(), time: {maxDurationSeconds: faker.datatype.number({min: 60, max: 15724800})}, targets: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), targetGroupId: faker.random.word(), targetGroupFrom: {publisher: faker.random.word(), name: faker.random.word(), version: faker.random.word(), kind: faker.random.word()}, fields: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), fieldTitle: faker.random.word(), fieldDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), valueLabel: faker.random.word(), valueDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), value: faker.random.word()}))}))})), createdAt: faker.random.word()})

export const getUserListRequestAccessGroupsMock = () => ({groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestId: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), time: {maxDurationSeconds: faker.datatype.number({min: 60, max: 15724800})}, overrideTiming: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, updatedAt: faker.random.word(), createdAt: faker.random.word(), targets: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestId: faker.random.word(), accessGroupId: faker.random.word(), targetGroupId: faker.random.word(), targetGroupFrom: {publisher: faker.random.word(), name: faker.random.word(), version: faker.random.word(), kind: faker.random.word()}, fields: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), fieldTitle: faker.random.word(), fieldDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), valueLabel: faker.random.word(), valueDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), value: faker.random.word()})), status: faker.helpers.arrayElement(Object.values(GrantStatus))}))})), next: faker.helpers.arrayElement([faker.random.word(), undefined])})

export const getUserGetRequestAccessGroupMock = () => ({id: faker.random.word(), requestId: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), time: {maxDurationSeconds: faker.datatype.number({min: 60, max: 15724800})}, overrideTiming: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, updatedAt: faker.random.word(), createdAt: faker.random.word(), targets: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestId: faker.random.word(), accessGroupId: faker.random.word(), targetGroupId: faker.random.word(), targetGroupFrom: {publisher: faker.random.word(), name: faker.random.word(), version: faker.random.word(), kind: faker.random.word()}, fields: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), fieldTitle: faker.random.word(), fieldDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), valueLabel: faker.random.word(), valueDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), value: faker.random.word()})), status: faker.helpers.arrayElement(Object.values(GrantStatus))}))})

export const getUserListRequestAccessGroupGrantsMock = () => ({grants: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestId: faker.random.word(), accessGroupId: faker.random.word(), targetGroupId: faker.random.word(), targetGroupFrom: {publisher: faker.random.word(), name: faker.random.word(), version: faker.random.word(), kind: faker.random.word()}, fields: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), fieldTitle: faker.random.word(), fieldDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), valueLabel: faker.random.word(), valueDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), value: faker.random.word()})), status: faker.helpers.arrayElement(Object.values(GrantStatus))})), next: faker.helpers.arrayElement([faker.random.word(), undefined])})

export const getUserGetRequestAccessGroupGrantMock = () => ({id: faker.random.word(), requestId: faker.random.word(), accessGroupId: faker.random.word(), targetGroupId: faker.random.word(), targetGroupFrom: {publisher: faker.random.word(), name: faker.random.word(), version: faker.random.word(), kind: faker.random.word()}, fields: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), fieldTitle: faker.random.word(), fieldDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), valueLabel: faker.random.word(), valueDescription: faker.helpers.arrayElement([faker.random.word(), undefined]), value: faker.random.word()})), status: faker.helpers.arrayElement(Object.values(GrantStatus))})

export const getDefaultMSW = () => [
rest.get('*/api/v1/admin/target-groups/:id/routes', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getAdminListTargetRoutesMock()),
        )
      }),rest.get('*/api/v1/entitlements', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserListEntitlementsMock()),
        )
      }),rest.get('*/api/v1/entitlements/resources', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserListEntitlementResourcesMock()),
        )
      }),rest.get('*/api/v1/entitlements/targets', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserListEntitlementTargetsMock()),
        )
      }),rest.get('*/api/v1/requests', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserListRequestsMock()),
        )
      }),rest.post('*/api/v1/requests', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
        )
      }),rest.post('*/api/v1/preflight', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserRequestPreflightMock()),
        )
      }),rest.get('*/api/v1/requests/:requestId', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserGetRequestMock()),
        )
      }),rest.get('*/api/v1/requests/:requestId/groups', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserListRequestAccessGroupsMock()),
        )
      }),rest.get('*/api/v1/requests/:requestId/groups/:groupId', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserGetRequestAccessGroupMock()),
        )
      }),rest.get('*/api/v1/groups/:groupId/grants', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserListRequestAccessGroupGrantsMock()),
        )
      }),rest.get('*/api/v1/groups/:gid/grants:grantid', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserGetRequestAccessGroupGrantMock()),
        )
      }),]
