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
        'cl82p12ij0000o1on2v1t192p': faker.random.word()
      }, withSelectable: {
        'cl82p12ij0001o1on12ntf1lp': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getUserGetAccessRuleMock = () => ({id: faker.random.word(), version: faker.random.word(), name: faker.random.word(), description: faker.random.word(), target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl82p12io0002o1on29wx38cr': faker.random.word()
      }, withSelectable: {
        'cl82p12io0003o1onduys2eqq': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({option: {value: faker.random.word(), label: faker.random.word()}, valid: faker.datatype.boolean()}))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()})

export const getUserGetAccessRuleApproversMock = () => ({users: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word())), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getUserListRequestsMock = () => ({requests: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestor: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), reason: faker.helpers.arrayElement([faker.random.word(), undefined]), timing: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, requestedAt: faker.random.word(), accessRule: {id: faker.random.word(), version: faker.random.word()}, updatedAt: faker.random.word(), grant: faker.helpers.arrayElement([{status: faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), subject: faker.internet.email(), provider: faker.random.word(), start: faker.random.word(), end: faker.random.word()}, undefined]), approvalMethod: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(ApprovalMethod)), undefined]), selectedWith: {
        'cl82p12j10004o1oncjkv7rxf': {value: faker.random.word(), label: faker.random.word()}
      }})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getUserGetRequestMock = () => ({id: faker.random.word(), requestor: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), reason: faker.helpers.arrayElement([faker.random.word(), undefined]), timing: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, requestedAt: faker.random.word(), accessRule: {id: faker.random.word(), version: faker.random.word(), name: faker.random.word(), description: faker.random.word(), target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl82p12j90007o1on71hhdhfz': faker.random.word()
      }, withSelectable: {
        'cl82p12j90008o1on57rbgt9i': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()}, updatedAt: faker.random.word(), grant: faker.helpers.arrayElement([{status: faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), subject: faker.internet.email(), provider: faker.random.word(), start: faker.random.word(), end: faker.random.word()}, undefined]), canReview: faker.datatype.boolean(), approvalMethod: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(ApprovalMethod)), undefined]), selectedWith: faker.helpers.arrayElement([{
        'cl82p12j90009o1on82evcblf': {value: faker.random.word(), label: faker.random.word()}
      }, undefined])})

export const getListRequestEventsMock = () => ({events: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({id: faker.random.word(), requestId: faker.random.word(), createdAt: faker.random.word(), actor: faker.helpers.arrayElement([faker.random.word(), undefined]), fromStatus: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(RequestStatus)), undefined]), toStatus: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(RequestStatus)), undefined]), fromTiming: faker.helpers.arrayElement([{durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, undefined]), toTiming: faker.helpers.arrayElement([{durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, undefined]), fromGrantStatus: faker.helpers.arrayElement([faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), undefined]), toGrantStatus: faker.helpers.arrayElement([faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), undefined]), grantCreated: faker.helpers.arrayElement([faker.datatype.boolean(), undefined]), requestCreated: faker.helpers.arrayElement([faker.datatype.boolean(), undefined]), grantFailureReason: faker.helpers.arrayElement([faker.random.word(), undefined]), recordedEvent: faker.helpers.arrayElement([{}, undefined])})), next: faker.helpers.arrayElement([faker.random.word(), null])})

export const getReviewRequestMock = () => ({request: faker.helpers.arrayElement([{id: faker.random.word(), requestor: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), reason: faker.helpers.arrayElement([faker.random.word(), undefined]), timing: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, requestedAt: faker.random.word(), accessRule: {id: faker.random.word(), version: faker.random.word()}, updatedAt: faker.random.word(), grant: faker.helpers.arrayElement([{status: faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), subject: faker.internet.email(), provider: faker.random.word(), start: faker.random.word(), end: faker.random.word()}, undefined]), approvalMethod: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(ApprovalMethod)), undefined]), selectedWith: {
        'cl82p12je000ao1onc803ef22': {value: faker.random.word(), label: faker.random.word()}
      }}, undefined])})

export const getCancelRequestMock = () => ({})

export const getGetAccessInstructionsMock = () => ({instructions: faker.helpers.arrayElement([faker.random.word(), undefined])})

export const getGetAccessTokenMock = () => (faker.random.word())

export const getGetUserMock = () => ({id: faker.random.word(), email: faker.random.word(), firstName: faker.random.word(), picture: faker.random.word(), status: faker.helpers.arrayElement(Object.values(IdpStatus)), lastName: faker.random.word(), updatedAt: faker.random.word(), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))})

export const getGetMeMock = () => ({user: {id: faker.random.word(), email: faker.random.word(), firstName: faker.random.word(), picture: faker.random.word(), status: faker.helpers.arrayElement(Object.values(IdpStatus)), lastName: faker.random.word(), updatedAt: faker.random.word(), groups: Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))}, isAdmin: faker.datatype.boolean()})

export const getAdminGetRequestMock = () => ({id: faker.random.word(), requestor: faker.random.word(), status: faker.helpers.arrayElement(Object.values(RequestStatus)), reason: faker.helpers.arrayElement([faker.random.word(), undefined]), timing: {durationSeconds: faker.datatype.number({min: undefined, max: undefined}), startTime: faker.helpers.arrayElement([faker.random.word(), undefined])}, requestedAt: faker.random.word(), accessRule: {id: faker.random.word(), version: faker.random.word(), name: faker.random.word(), description: faker.random.word(), target: {provider: {id: faker.random.word(), type: faker.random.word()}, with: {
        'cl82p12k6000qo1ondr5j1a41': faker.random.word()
      }, withSelectable: {
        'cl82p12k6000ro1on2moy32yl': Array.from({ length: faker.datatype.number({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => (faker.random.word()))
      }}, timeConstraints: {maxDurationSeconds: faker.datatype.number({min: 60, max: undefined})}, isCurrent: faker.datatype.boolean()}, updatedAt: faker.random.word(), grant: faker.helpers.arrayElement([{status: faker.helpers.arrayElement(['PENDING','ACTIVE','ERROR','REVOKED','EXPIRED']), subject: faker.internet.email(), provider: faker.random.word(), start: faker.random.word(), end: faker.random.word()}, undefined]), canReview: faker.datatype.boolean(), approvalMethod: faker.helpers.arrayElement([faker.helpers.arrayElement(Object.values(ApprovalMethod)), undefined]), selectedWith: faker.helpers.arrayElement([{
        'cl82p12k7000so1on0zxq4ikw': {value: faker.random.word(), label: faker.random.word()}
      }, undefined])})

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
