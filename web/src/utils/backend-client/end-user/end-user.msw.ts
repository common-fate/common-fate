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
  RequestStatus,
  ApprovalMethod,
  IdpStatus
} from '.././types'

export const getListUserAccessRulesMock = () => ({accessRules: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), version: faker.random.word(), name: faker.random.word(), description: faker.random.word(), target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl9gdkj440000ooongp4vhclz': faker.random.word()
      }, withSelectable: {
        'cl9gdkj450001ooon7foe8618': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getUserGetAccessRuleMock = () => ({id: faker.random.word(), version: faker.random.word(), name: faker.random.word(), description: faker.random.word(), target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl9gdkj4a0002ooonatj7fgii': {title: faker.random.word(), label: faker.random.word(), value: faker.random.word()}
      }, withSelectable: {
        'cl9gdkj4b0003ooonbkf66we8': {options: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({value: faker.random.word(), label: faker.random.word(), valid: faker.datatype.boolean()})), title: faker.random.word()}
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()})

export const getUserGetAccessRuleApproversMock = () => ({users: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getUserListRequestsMock = () => ({requests: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestor: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), reason: faker.helpers.arrayElement([faker.random.word(), undefined]), timing: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, requestedAt: faker.random.word(), accessRule: {id: faker.random.word(), version: faker.random.word()}, updatedAt: faker.random.word(), grant: faker.helpers.arrayElement([{status: faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), subject: faker.internet.email(), provider: faker.random.word(), start: faker.random.word(), end: faker.random.word()}, undefined]), approvalMethod: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(ApprovalMethod)), undefined])})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getUserCreateRequestMock = () => ({id: faker.random.word(), requestor: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), reason: faker.helpers.arrayElement([faker.random.word(), undefined]), timing: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, requestedAt: faker.random.word(), accessRule: {id: faker.random.word(), version: faker.random.word()}, updatedAt: faker.random.word(), grant: faker.helpers.arrayElement([{status: faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), subject: faker.internet.email(), provider: faker.random.word(), start: faker.random.word(), end: faker.random.word()}, undefined]), approvalMethod: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(ApprovalMethod)), undefined])})

export const getUserGetRequestMock = () => ({id: faker.random.word(), requestor: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), reason: faker.helpers.arrayElement([faker.random.word(), undefined]), timing: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, requestedAt: faker.random.word(), accessRule: {id: faker.random.word(), version: faker.random.word(), name: faker.random.word(), description: faker.random.word(), with: {
        'cl9gdkj540004ooondtj21xv9': {title: faker.random.word(), label: faker.random.word(), value: faker.random.word()}
      }, isCurrent: faker.datatype.boolean(), provider: {id: faker.random.word(), type: faker.random.word()}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}}, updatedAt: faker.random.word(), grant: faker.helpers.arrayElement([{status: faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), subject: faker.internet.email(), provider: faker.random.word(), start: faker.random.word(), end: faker.random.word()}, undefined]), canReview: faker.datatype.boolean(), approvalMethod: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(ApprovalMethod)), undefined]), selectedWith: {
        'cl9gdkj550005ooonbujwbcsr': {title: faker.random.word(), label: faker.random.word(), value: faker.random.word()}
      }})

export const getListRequestEventsMock = () => ({events: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestId: faker.random.word(), createdAt: faker.random.word(), actor: faker.helpers.arrayElement([faker.random.word(), undefined]), fromStatus: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(RequestStatus)), undefined]), toStatus: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(RequestStatus)), undefined]), fromTiming: faker.helpers.arrayElement([{durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, undefined]), toTiming: faker.helpers.arrayElement([{durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, undefined]), fromGrantStatus: faker.helpers.arrayElement([faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), undefined]), toGrantStatus: faker.helpers.arrayElement([faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), undefined]), grantCreated: faker.helpers.arrayElement([faker.datatype.boolean(), undefined]), requestCreated: faker.helpers.arrayElement([faker.datatype.boolean(), undefined]), grantFailureReason: faker.helpers.arrayElement([faker.random.word(), undefined]), recordedEvent: faker.helpers.arrayElement([{}, undefined])})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getReviewRequestMock = () => ({request: faker.helpers.arrayElement([{id: faker.random.word(), requestor: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), reason: faker.helpers.arrayElement([faker.random.word(), undefined]), timing: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, requestedAt: faker.random.word(), accessRule: {id: faker.random.word(), version: faker.random.word()}, updatedAt: faker.random.word(), grant: faker.helpers.arrayElement([{status: faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), subject: faker.internet.email(), provider: faker.random.word(), start: faker.random.word(), end: faker.random.word()}, undefined]), approvalMethod: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(ApprovalMethod)), undefined])}, undefined])})

export const getCancelRequestMock = () => ({})

export const getGetAccessInstructionsMock = () => ({instructions: faker.helpers.arrayElement([faker.random.word(), undefined])})

export const getGetAccessTokenMock = () => (faker.random.word())

export const getGetUserMock = () => ({id: faker.random.word(), email: faker.random.word(), firstName: faker.random.word(), picture: faker.random.word(), status: faker.helpers.arrayElement(Object.values(IdpStatus)), lastName: faker.random.word(), updatedAt: faker.random.word(), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))})

export const getGetMeMock = () => ({user: {id: faker.random.word(), email: faker.random.word(), firstName: faker.random.word(), picture: faker.random.word(), status: faker.helpers.arrayElement(Object.values(IdpStatus)), lastName: faker.random.word(), updatedAt: faker.random.word(), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))}, isAdmin: faker.datatype.boolean()})

export const getAdminGetRequestMock = () => ({id: faker.random.word(), requestor: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), reason: faker.helpers.arrayElement([faker.random.word(), undefined]), timing: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, requestedAt: faker.random.word(), accessRule: {id: faker.random.word(), version: faker.random.word(), name: faker.random.word(), description: faker.random.word(), with: {
        'cl9gdkj72000kooonctlg6h5n': {title: faker.random.word(), label: faker.random.word(), value: faker.random.word()}
      }, isCurrent: faker.datatype.boolean(), provider: {id: faker.random.word(), type: faker.random.word()}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}}, updatedAt: faker.random.word(), grant: faker.helpers.arrayElement([{status: faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), subject: faker.internet.email(), provider: faker.random.word(), start: faker.random.word(), end: faker.random.word()}, undefined]), canReview: faker.datatype.boolean(), approvalMethod: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(ApprovalMethod)), undefined]), selectedWith: {
        'cl9gdkj72000looonbtc23gei': {title: faker.random.word(), label: faker.random.word(), value: faker.random.word()}
      }})

export const getEndUserMSW = () => [
rest.get('*/api/v1/access-rules', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getListUserAccessRulesMock()),
        )
      }),rest.get('*/api/v1/access-rules/:ruleId', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserGetAccessRuleMock()),
        )
      }),rest.get('*/api/v1/access-rules/:ruleId/approvers', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserGetAccessRuleApproversMock()),
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
ctx.json(getUserCreateRequestMock()),
        )
      }),rest.get('*/api/v1/requests/:requestId', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getUserGetRequestMock()),
        )
      }),rest.get('*/api/v1/requests/:requestId/events', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getListRequestEventsMock()),
        )
      }),rest.post('*/api/v1/requests/:requestId/review', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getReviewRequestMock()),
        )
      }),rest.post('*/api/v1/requests/:requestId/cancel', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getCancelRequestMock()),
        )
      }),rest.post('*/api/v1/requests/:requestid/revoke', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
        )
      }),rest.get('*/api/v1/requests/:requestId/access-instructions', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getGetAccessInstructionsMock()),
        )
      }),rest.get('*/api/v1/requests/:requestId/access-token', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getGetAccessTokenMock()),
        )
      }),rest.get('*/api/v1/users/:userId', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getGetUserMock()),
        )
      }),rest.get('*/api/v1/users/me', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getGetMeMock()),
        )
      }),rest.get('*/api/v1/admin/requests/:requestId', (_req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(200, 'Mocked status'),
ctx.json(getAdminGetRequestMock()),
        )
      }),]
