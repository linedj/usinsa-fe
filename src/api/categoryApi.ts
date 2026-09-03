import { http } from './http'
import type { CategoryResponse, CategoryCreateRequest } from './types'

// 백엔드 Category API는 RsData 래퍼 없이 직접 데이터를 반환합니다
export const categoryApi = {
  /**
   * 카테고리 전체 조회
   */
  async getAllCategories(): Promise<CategoryResponse[]> {
    const { data } = await http.get<CategoryResponse[]>('/api/v1/categories')
    return data
  },

  /**
   * 카테고리 단건 조회
   */
  async getCategory(id: number): Promise<CategoryResponse> {
    const { data } = await http.get<CategoryResponse>(`/api/v1/categories/${id}`)
    return data
  },

  /**
   * 카테고리 등록
   */
  async createCategory(payload: CategoryCreateRequest): Promise<CategoryResponse> {
    const { data } = await http.post<CategoryResponse>('/api/v1/categories', payload)
    return data
  },
}

/**
 * 백엔드가 공용 Response DTO를 재사용하는 탓에 카테고리명이
 * name 또는 categoryName 어느 쪽에 실려 올지 보장되지 않는다.
 * 화면 표시용 이름을 안전하게 뽑아내는 헬퍼.
 */
export function getCategoryDisplayName(category: CategoryResponse): string {
  return category.name || category.categoryName || `카테고리 ${category.id}`
}
