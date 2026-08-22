// Shared cross-cutting types that don't belong to a single model/service.
// Model-specific types live alongside their schemas in src/models, and
// service-specific input types live alongside their service in src/services.

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
