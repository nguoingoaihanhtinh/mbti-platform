export const testKeys = {
  all: ["tests"] as const,
  details: (id: string) => [...testKeys.all, id] as const,
  versions: (id: string) => [...testKeys.all, id, "versions"] as const,
};

export const questionKeys = {
  all: ["questions"] as const,
  byTest: (testId: string, versionId?: string, page?: number, limit?: number) =>
    [...questionKeys.all, testId, versionId, page, limit] as const,
};

export const answerKeys = {
  byQuestion: (questionId: string, page?: number, limit?: number) => ["answers", questionId, page, limit] as const,
};

export const assessmentKeys = {
  all: ["assessments"] as const,
  mine: (page: number, limit: number) => [...assessmentKeys.all, "me", page, limit] as const,
  detail: (id: string) => [...assessmentKeys.all, id] as const,
  responses: (id: string) => [...assessmentKeys.all, id, "responses"] as const,
  result: (id: string) => [...assessmentKeys.all, id, "result"] as const,
};

export const adminKeys = {
  all: ["admin"] as const,

  packages: () => [...adminKeys.all, "packages"] as const,
  packageDetail: (id: string) => [...adminKeys.packages(), id] as const,

  dashboard: {
    stats: () => [...adminKeys.all, "dashboard", "stats"] as const,
    timeline: () => [...adminKeys.all, "dashboard", "timeline"] as const,
  },

  users: (page: number, limit: number) => [...adminKeys.all, "users", page, limit] as const,

  companies: (page: number, limit: number) => [...adminKeys.all, "companies", page, limit] as const,

  tests: (page: number, limit: number) => [...adminKeys.all, "tests", page, limit] as const,

  testCandidates: (testId: string, page: number, limit: number) =>
    [...adminKeys.all, "tests", testId, "candidates", page, limit] as const,

  candidateResult: (assessmentId: string) => [...adminKeys.all, "candidates", assessmentId, "result"] as const,
};
