import { ref, computed, onMounted } from 'vue'
import { useStore } from './useStore'

export interface AdminActionResponse {
  success: boolean
  message?: string
  token?: string
  product?: any
}

export const useActions = () => {
  const store = useStore()
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  
  const actionsBaseUrl = ref<string>('http://localhost:4000')
  const token = ref<string | null>('SABALI')
  const isLoggedIn = ref<boolean>(false)

  // Initialize Auth State from localStorage (safely client-side)
  const initAuth = () => {
    if (typeof window === 'undefined') return
    const savedToken = localStorage.getItem('sabali_admin_token')
    if (savedToken) {
      token.value = savedToken
      isLoggedIn.value = true
    }
  }

  // Helper for Category Mapping (front-end 'Men'|'Women' -> back-end 'mens'|'womens')
  const mapCategoryToBackend = (cat: string): 'mens' | 'womens' => {
    const lower = cat.toLowerCase()
    if (lower === 'men' || lower === 'mens') return 'mens'
    return 'womens'
  }

  // Unified Request Helper to automatically append Authorization token headers
  const request = async <T = any>(url: string, options: any = {}): Promise<T> => {
    const headers = { ...options.headers }
    headers['Authorization'] = 'Bearer SABALI'
    
    return await $fetch<T>(url, {
      ...options,
      headers
    })
  }

  // 1. Authenticates admin credentials
  // POST /admin-actions/login
  const login = async (username: string, password: string): Promise<AdminActionResponse> => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<AdminActionResponse>(`${actionsBaseUrl.value}/admin-actions/login`, {
        method: 'POST',
        body: { username, password }
      })
      
      if (response && response.token) {
        token.value = response.token
        isLoggedIn.value = true
        if (typeof window !== 'undefined') {
          localStorage.setItem('sabali_admin_token', response.token)
        }
      }
      return response
    } catch (e: any) {
      const msg = e.data?.message || e.message || 'Authentication failed'
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  // Clears active authentication state
  const logout = (): void => {
    token.value = null
    isLoggedIn.value = false
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sabali_admin_token')
    }
  }

  // 2. Creates and uploads a new perfume product (supports multipart/form-data)
  // POST /admin-actions/product/new
  const createNewProduct = async (data: {
    category: 'Men' | 'Women' | 'mens' | 'womens'
    name: string
    brand: string
    price: number
    description: string
    image?: File | null
    starred?: boolean
  }): Promise<AdminActionResponse> => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('category', mapCategoryToBackend(data.category))
      formData.append('name', data.name)
      formData.append('brand', data.brand)
      formData.append('price', String(data.price))
      formData.append('description', data.description)
      if (data.image) {
        formData.append('image', data.image)
      }
      formData.append('starred', String(data.starred ?? false))

      const response = await request<AdminActionResponse>(`${actionsBaseUrl.value}/admin-actions/product/new`, {
        method: 'POST',
        body: formData
      })

      // Soft refresh local store with updated records
      await store.fetchProducts()
      
      return response
    } catch (e: any) {
      const msg = e.data?.message || e.message || 'Failed to create product'
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  // 3. Updates an existing product's fields (supports patch with multipart/form-data)
  // PATCH /admin-actions/product/:category/:id
  const updateProductActions = async (
    category: 'Men' | 'Women' | 'mens' | 'womens',
    id: string,
    data: {
      name?: string
      brand?: string
      price?: number
      description?: string
      image?: File | null
      starred?: boolean
    }
  ): Promise<AdminActionResponse> => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      if (data.name !== undefined) formData.append('name', data.name)
      if (data.brand !== undefined) formData.append('brand', data.brand)
      if (data.price !== undefined) formData.append('price', String(data.price))
      if (data.description !== undefined) formData.append('description', data.description)
      if (data.image) formData.append('image', data.image)
      if (data.starred !== undefined) formData.append('starred', String(data.starred))

      const backendCat = mapCategoryToBackend(category)
      const response = await request<AdminActionResponse>(`${actionsBaseUrl.value}/admin-actions/product/${backendCat}/${id}`, {
        method: 'PATCH',
        body: formData
      })

      // Soft refresh local store with updated records
      await store.fetchProducts()

      return response
    } catch (e: any) {
      const msg = e.data?.message || e.message || 'Failed to update product'
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  // 4. Deletes an existing product and corresponding images from astorage
  // DELETE /admin-actions/product/:category/:id
  const deleteProductActions = async (
    category: 'Men' | 'Women' | 'mens' | 'womens',
    id: string
  ): Promise<AdminActionResponse> => {
    loading.value = true
    error.value = null
    try {
      const backendCat = mapCategoryToBackend(category)
      const response = await request<AdminActionResponse>(`${actionsBaseUrl.value}/admin-actions/product/${backendCat}/${id}`, {
        method: 'DELETE'
      })

      // Soft refresh local store with updated records
      await store.fetchProducts()

      return response
    } catch (e: any) {
      const msg = e.data?.message || e.message || 'Failed to delete product'
      error.value = msg
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    actionsBaseUrl,
    token,
    isLoggedIn,
    initAuth,
    login,
    logout,
    createNewProduct,
    updateProductActions,
    deleteProductActions
  }
}
