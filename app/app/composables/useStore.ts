import { ref, computed, onMounted } from 'vue'

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  volume: string
  category: 'Men' | 'Women' 
  stock: number
  description: string
  images: string[]
  sales: number
  rating: number
  createdAt: string
}

// Initial mockup perfumes
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'sabali-1',
    name: 'SABALI OUD NOIR',
    brand: 'SABALI',
    price: 165,
    volume: '100ml',
    category: 'Unisex',
    stock: 14,
    description: 'An intense, dark wood perfume featuring deep notes of agarwood, sandalwood, and rich incense.',
    images: [],
    sales: 34,
    rating: 4.9,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sabali-2',
    name: 'SABALI VELVET ROSE',
    brand: 'SABALI',
    price: 145,
    volume: '50ml',
    category: 'Women',
    stock: 8,
    description: 'Elegant Turkish rose wrapped in smoky patchouli and delicate white musk.',
    images: [],
    sales: 22,
    rating: 4.7,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sabali-3',
    name: 'SABALI CHROME VETIVER',
    brand: 'SABALI',
    price: 135,
    volume: '100ml',
    category: 'Men',
    stock: 3,
    description: 'Crisp grapefruit opening into metallic vetiver notes, earth, and amberwood.',
    images: [],
    sales: 41,
    rating: 4.8,
    createdAt: new Date().toISOString()
  },
  {
    id: 'sabali-4',
    name: 'SABALI SIBERIAN CEDAR',
    brand: 'SABALI',
    price: 155,
    volume: '100ml',
    category: 'Unisex',
    stock: 22,
    description: 'Pristine high-altitude cedar, crisp ozone, fresh pine needle, and cold leather.',
    images: [],
    sales: 18,
    rating: 4.6,
    createdAt: new Date().toISOString()
  }
]

export const useStore = () => {
  const products = useState<Product[]>('sabali-products', () => [])
  const loading = useState<boolean>('sabali-loading', () => false)
  const error = useState<string | null>('sabali-error', () => null)
  const apiBaseUrl = useState<string>('sabali-api-url', () => 'http://localhost:3000')
  const isDarkMode = useState<boolean>('sabali-dark-mode', () => true)

  // Check if we are running in the browser
  const isBrowser = typeof window !== 'undefined'

  // Initialize store from localStorage on client-side
  const initStore = () => {
    if (!isBrowser) return

    // Load theme
    const savedTheme = localStorage.getItem('sabali_theme')
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      isDarkMode.value = true
    }

    // Load API URL
    const savedUrl = localStorage.getItem('sabali_api_url')
    if (savedUrl) {
      apiBaseUrl.value = savedUrl
    }

    // Load products
    const savedProducts = localStorage.getItem('sabali_products')
    if (savedProducts) {
      try {
        let parsed = JSON.parse(savedProducts)
        // Migration: convert single image to images array
        parsed = parsed.map((p: any) => {
          if (p.image && !p.images) {
            p.images = [p.image]
            delete p.image
          }
          if (!p.images) p.images = []
          return p
        })
        products.value = parsed
      } catch (e) {
        console.error('Error parsing local storage products:', e)
        products.value = [...DEFAULT_PRODUCTS]
        localStorage.setItem('sabali_products', JSON.stringify(DEFAULT_PRODUCTS))
      }
    } else {
      products.value = [...DEFAULT_PRODUCTS]
      localStorage.setItem('sabali_products', JSON.stringify(DEFAULT_PRODUCTS))
    }
  }

  // Fetch from NestJS or fallback
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    
    // First, sync with local storage
    if (isBrowser) {
      const savedProducts = localStorage.getItem('sabali_products')
      if (savedProducts) {
        try {
          let parsed = JSON.parse(savedProducts)
          parsed = parsed.map((p: any) => {
            if (p.image && !p.images) {
              p.images = [p.image]
              delete p.image
            }
            if (!p.images) p.images = []
            return p
          })
          products.value = parsed
        } catch (e) {
          // ignore
        }
      }
    }

    try {
      // Try to fetch from real NestJS backend
      let response = await $fetch<Product[]>(`${apiBaseUrl.value}/products`, {
        timeout: 3000 // fail fast if offline
      })
      
      if (response && Array.isArray(response)) {
        // Run migration for backend data as well
        response = response.map((p: any) => {
          if (p.image && !p.images) {
            p.images = [p.image]
            delete p.image
          }
          if (!p.images) p.images = []
          return p
        })
        
        products.value = response
        if (isBrowser) {
          localStorage.setItem('sabali_products', JSON.stringify(response))
        }
      }
    } catch (e) {
      console.warn('Backend offline, using mock/local storage storage.', e)
      // We fall back quietly as this is designed to operate locally as well
    } finally {
      loading.value = false
    }
  }

  // Save changes helper
  const syncAndSave = async (updatedProducts: Product[]) => {
    products.value = updatedProducts
    if (isBrowser) {
      localStorage.setItem('sabali_products', JSON.stringify(updatedProducts))
    }
  }

  // Create Product
  const addProduct = async (productData: Omit<Product, 'id' | 'sales' | 'rating' | 'createdAt'>) => {
    loading.value = true
    error.value = null

    const newProduct: Product = {
      ...productData,
      id: 'sabali-' + Math.random().toString(36).substr(2, 9),
      sales: 0,
      rating: 5.0,
      createdAt: new Date().toISOString()
    }

    const updated = [newProduct, ...products.value]
    await syncAndSave(updated)

    try {
      // Attempt backend API call
      await $fetch(`${apiBaseUrl.value}/products`, {
        method: 'POST',
        body: newProduct,
        timeout: 2000
      })
    } catch (e) {
      console.warn('Could not post to NestJS backend, saved locally.', e)
    } finally {
      loading.value = false
    }

    return newProduct
  }

  // Update Product
  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    loading.value = true
    error.value = null

    const updated = products.value.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedData }
      }
      return p
    })
    await syncAndSave(updated)

    try {
      // Attempt backend API call
      await $fetch(`${apiBaseUrl.value}/products/${id}`, {
        method: 'PUT',
        body: updatedData,
        timeout: 2000
      })
    } catch (e) {
      console.warn('Could not put to NestJS backend, saved locally.', e)
    } finally {
      loading.value = false
    }
  }

  // Delete Product
  const deleteProduct = async (id: string) => {
    loading.value = true
    error.value = null

    const updated = products.value.filter(p => p.id !== id)
    await syncAndSave(updated)

    try {
      // Attempt backend API call
      await $fetch(`${apiBaseUrl.value}/products/${id}`, {
        method: 'DELETE',
        timeout: 2000
      })
    } catch (e) {
      console.warn('Could not delete from NestJS backend, removed locally.', e)
    } finally {
      loading.value = false
    }
  }

  // Update API URL
  const updateApiBaseUrl = (url: string) => {
    apiBaseUrl.value = url
    if (isBrowser) {
      localStorage.setItem('sabali_api_url', url)
    }
  }

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    if (isBrowser) {
      localStorage.setItem('sabali_theme', isDarkMode.value ? 'dark' : 'light')
    }
  }

  return {
    products,
    loading,
    error,
    apiBaseUrl,
    isDarkMode,
    initStore,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateApiBaseUrl,
    toggleTheme
  }
}
