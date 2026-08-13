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
    category: 'Men',
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
    category: 'Men',
    stock: 22,
    description: 'Pristine high-altitude cedar, crisp ozone, fresh pine needle, and cold leather.',
    images: [],
    sales: 18,
    rating: 4.6,
    createdAt: new Date().toISOString()
  }
]

// Translations Dictionary
const TRANSLATIONS = {
  uz: {
    // Nav
    navProducts: 'Mahsulotlar',
    navProfile: 'Profil',
    
    // Index
    tabAll: 'BARCHASI',
    tabMen: 'ERKAKLAR',
    tabWomen: 'AYOLLAR',
    syncingDb: 'Ma\'lumotlar bazasi sinxronlanmoqda...',
    noProductsFound: 'Mahsulotlar topilmadi',
    tryAdjusting: 'Filtrlarni yoki qidiruv mezonlarini o\'zgartirib ko\'ring.',
    createProduct: 'Mahsulot yaratish',
    stockLabel: 'Zahira:',
    salesLabel: 'Sotuv:',
    btnEdit: 'Tahrirlash',
    btnDelete: 'O\'chirish',
    confirmDeletionTitle: 'O\'chirishni tasdiqlang',
    confirmDeletionText1: 'Haqiqatan ham ',
    confirmDeletionText2: ' ni butunlay o\'chirib tashlamoqchimisiz? Bu harakatni bekor qilib bo\'lmaydi.',
    btnCancel: 'Bekor qilish',
    btnDeleteUpper: 'O\'CHIRISH',

    // Add / Edit
    titleCreateNew: 'Yangi yaratish',
    titleProduct: 'Mahsulot',
    titleEdit: 'Tahrirlash',
    productImages: 'MAHSULOT RASMLARI',
    selected: 'TANLANDI',
    addMore: 'YANA QO\'SHISH',
    dragDropTitle: 'RASMLARNI TORTIB KELING',
    dragDropDesc: 'Mahalliy fayllarni tanlang (JPG, PNG)',
    productDetails: 'MAHSULOT TAFSILOTLARI',
    labelName: 'Nomi',
    placeholderName: 'masalan, OUD NOIR',
    labelBrand: 'Brend',
    placeholderBrand: 'masalan, SABALI',
    labelDesc: 'Tavsifi',
    placeholderDesc: 'Mahsulot haqida batafsil ma\'lumot...',
    specifications: 'XUSUSIYATLARI',
    labelPrice: 'Narxi (UZS)',
    labelVolume: 'Hajmi',
    placeholderVolume: 'masalan, 100ml',
    labelCategory: 'Toifasi',
    selectCategory: 'Toifani tanlang',
    catMen: 'Erkaklar',
    catWomen: 'Ayollar',
    labelStock: 'Boshlang\'ich zahira',
    editStock: 'Zahira',
    btnPublish: 'MAHSULOTNI NASHR QILISH',
    btnSaving: 'Saqlanmoqda...',
    btnSaveChanges: 'O\'ZGARISHLARNI SAQLASH',
    productNotFound: 'Mahsulot topilmadi',
    returnToProducts: 'Mahsulotlarga qaytish',
    creationSuccessful: 'MUVAFFAQIYATLI YARATILDI',
    integratedInventory: 'Atir SABALI inventariga qo\'shildi.',

    // Profile (already present)
    storeInsights: 'Do\'kon tahlillari',
    profileStats: 'Profil va statistika',
    authorizedAccount: 'Ruxsat etilgan hisob',
    owner: 'EGA',
    totalStyles: 'JAMI USLUBLAR',
    activePerfumes: 'Faol atir modellari',
    stockUnits: 'ZAHIRA BIRLIKLARI',
    availableWarehouse: 'Omborda mavjud',
    depletedStock: 'TUGAGAN ZAHIRA',
    zeroStock: 'Zahirasi tugagan atirlar',
    estRevenue: 'TUSHUM (TAXMINIY)',
    basedOnSales: 'Qayd etilgan sotuvlar asosida',
    categoryDistribution: 'Toifalar taqsimoti',
    menPerfumes: 'ERKAKLAR ATIRLARI',
    womenPerfumes: 'AYOLLAR ATIRLARI',
    unisexPerfumes: 'UNISEKS ATIRLAR',
    styles: 'uslub',
    backendConnection: 'NestJS Backend ulanishi',
    backendDesc: 'Ushbu boshqaruv panelini to\'g\'ridan-to\'g\'ri ishlayotgan NestJS backend dasturiga ulang. Ma\'lumotlar darhol REST API bilan sinxronlanadi.',
    backendUrl: 'NESTJS ASOSIY URL',
    connect: 'Ulanish',
    targetEndpoint: 'Maqsadli nuqta:',
    syncProtocol: 'Sinxronlash protokoli:',
    activeHybrid: 'FAOL GIBRID',
    dbCacheReset: 'Ma\'lumotlar ombori keshini tozalash',
    dbCacheDesc: 'Standart namunalarni tiklash va LocalStorage-ni tozalash',
    wipeCache: 'Keshni tozalash',
    confirmWipe: 'KESHNI TOZALASH VA BARCHA NAMUNALARNI TIKLASHNI HOHLAYSIZMI?',
    editProfile: "O'zgartirish",
    editProfileTitle: "Profilni tahrirlash",
    adminNameLabel: "Admin nomi",
    profilePicLabel: "Profil rasmi",
    btnSave: "SAQLASH",
    backToProfile: "Profilga qaytish",
    changePhoto: "Rasmni o'zgartirish",
    defaultPhoto: "Standart rasm"
  },
  ru: {
    // Nav
    navProducts: 'Продукты',
    navProfile: 'Профиль',

    // Index
    tabAll: 'ВСЕ',
    tabMen: 'МУЖСКИЕ',
    tabWomen: 'ЖЕНСКИЕ',
    syncingDb: 'Синхронизация базы данных...',
    noProductsFound: 'Продукты не найдены',
    tryAdjusting: 'Попробуйте изменить фильтры или критерии поиска.',
    createProduct: 'Создать продукт',
    stockLabel: 'В наличии:',
    salesLabel: 'Продажи:',
    btnEdit: 'Изменить',
    btnDelete: 'Удалить',
    confirmDeletionTitle: 'Подтвердить удаление',
    confirmDeletionText1: 'Вы уверены, что хотите навсегда удалить ',
    confirmDeletionText2: '? Это действие необратимо.',
    btnCancel: 'Отмена',
    btnDeleteUpper: 'УДАЛИТЬ',

    // Add / Edit
    titleCreateNew: 'Создать новый',
    titleProduct: 'Продукт',
    titleEdit: 'Редактировать',
    productImages: 'ИЗОБРАЖЕНИЯ ПРОДУКТА',
    selected: 'ВЫБРАНО',
    addMore: 'ДОБАВИТЬ ЕЩЕ',
    dragDropTitle: 'ПЕРЕТАЩИТЕ ИЗОБРАЖЕНИЯ',
    dragDropDesc: 'Выберите локальные файлы (JPG, PNG)',
    productDetails: 'ДЕТАЛИ ПРОДУКТА',
    labelName: 'Название',
    placeholderName: 'например, OUD NOIR',
    labelBrand: 'Бренд',
    placeholderBrand: 'например, SABALI',
    labelDesc: 'Описание',
    placeholderDesc: 'Подробное описание продукта...',
    specifications: 'ХАРАКТЕРИСТИКИ',
    labelPrice: 'Цена (UZS)',
    labelVolume: 'Объем',
    placeholderVolume: 'например, 100ml',
    labelCategory: 'Категория',
    selectCategory: 'Выберите категорию',
    catMen: 'Мужские',
    catWomen: 'Женские',
    catUnisex: 'Унисекс',
    labelStock: 'Начальный запас',
    editStock: 'Запас',
    btnPublish: 'ОПУБЛИКОВАТЬ ПРОДУКТ',
    btnSaving: 'Сохранение...',
    btnSaveChanges: 'СОХРАНИТЬ ИЗМЕНЕНИЯ',
    productNotFound: 'Продукт не найден',
    returnToProducts: 'Вернуться к продуктам',
    creationSuccessful: 'УСПЕШНО СОЗДАНО',
    integratedInventory: 'Парфюм добавлен в инвентарь SABALI.',

    // Profile (already present)
    storeInsights: 'Аналитика магазина',
    profileStats: 'Профиль и статистика',
    authorizedAccount: 'Авторизованный аккаунт',
    owner: 'ВЛАДЕЛЕЦ',
    totalStyles: 'ВСЕГО СТИЛЕЙ',
    activePerfumes: 'Активные модели парфюма',
    stockUnits: 'ЕДИНИЦЫ НА СКЛАДЕ',
    availableWarehouse: 'Доступно на складе',
    depletedStock: 'ИСТОЩЕННЫЙ ЗАПАС',
    zeroStock: 'Парфюмы с нулевым запасом',
    estRevenue: 'ПРИБЫЛЬ (ОЦЕНКА)',
    basedOnSales: 'На основе зарегистрированных продаж',
    categoryDistribution: 'Распределение по категориям',
    menPerfumes: 'МУЖСКИЕ ПАРФЮМЫ',
    womenPerfumes: 'ЖЕНСКИЕ ПАРФЮМЫ',
    unisexPerfumes: 'УНИСЕКС ПАРФЮМЫ',
    styles: 'стилей',
    backendConnection: 'Подключение NestJS Backend',
    backendDesc: 'Привяжите эту панель напрямую к вашему работающему NestJS backend. Данные будут мгновенно синхронизироваться с REST API.',
    backendUrl: 'БАЗОВЫЙ URL NESTJS',
    connect: 'Подключить',
    targetEndpoint: 'Целевая точка:',
    syncProtocol: 'Протокол синхр.:',
    activeHybrid: 'АКТИВНЫЙ ГИБРИД',
    dbCacheReset: 'Сброс кэша базы данных',
    dbCacheDesc: 'Восстановить макеты и очистить LocalStorage',
    wipeCache: 'Очистить кэш',
    confirmWipe: 'ВЫ УВЕРЕНЫ, ЧТО ХОТИТЕ ОЧИСТИТЬ КЭШ И ВОССТАНОВИТЬ ВСЕ МАКЕТЫ?',
    editProfile: "Изменить",
    editProfileTitle: "Редактировать профиль",
    adminNameLabel: "Имя админа",
    profilePicLabel: "Фото профиля",
    btnSave: "СОХРАНИТЬ",
    backToProfile: "Вернуться в профиль",
    changePhoto: "Изменить фото",
    defaultPhoto: "Стандартное фото"
  }
}

export const useStore = () => {
  const products = useState<Product[]>('sabali-products', () => [])
  const loading = useState<boolean>('sabali-loading', () => false)
  const error = useState<string | null>('sabali-error', () => null)
  const apiBaseUrl = useState<string>('sabali-api-url', () => 'http://localhost:3000')
  const isDarkMode = useState<boolean>('sabali-dark-mode', () => true)
  
  // Localization state
  const locale = useState<'uz' | 'ru'>('sabali-locale', () => 'uz')

  // Admin Profile state
  const adminName = useState<string>('sabali-admin-name', () => 'SABALI PARFUME')
  const adminPic = useState<string | null>('sabali-admin-pic', () => null)

  // Check if we are running in the browser
  const isBrowser = typeof window !== 'undefined'

  // Translation helper
  const t = (key: keyof typeof TRANSLATIONS['uz']): string => {
    return TRANSLATIONS[locale.value][key] || key
  }

  // Initialize store from localStorage on client-side
  const initStore = () => {
    if (!isBrowser) return

    // Load admin profile details
    const savedAdminName = localStorage.getItem('sabali_admin_name')
    if (savedAdminName) {
      adminName.value = savedAdminName
    } else {
      adminName.value = 'SABALI PARFUME'
    }

    const savedAdminPic = localStorage.getItem('sabali_admin_pic')
    if (savedAdminPic) {
      adminPic.value = savedAdminPic
    }

    // Load theme
    const savedTheme = localStorage.getItem('sabali_theme')
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      isDarkMode.value = true
    }

    // Load language
    const savedLocale = localStorage.getItem('sabali_locale')
    if (savedLocale === 'uz' || savedLocale === 'ru') {
      locale.value = savedLocale
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
  
  const setLocale = (newLocale: 'uz' | 'ru') => {
    locale.value = newLocale
    if (isBrowser) {
      localStorage.setItem('sabali_locale', newLocale)
    }
  }

  const updateAdminProfile = (name: string, pic: string | null) => {
    adminName.value = name
    adminPic.value = pic
    if (isBrowser) {
      localStorage.setItem('sabali_admin_name', name)
      if (pic) {
        localStorage.setItem('sabali_admin_pic', pic)
      } else {
        localStorage.removeItem('sabali_admin_pic')
      }
    }
  }

  return {
    products,
    loading,
    error,
    apiBaseUrl,
    isDarkMode,
    locale,
    t,
    initStore,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateApiBaseUrl,
    toggleTheme,
    setLocale,
    adminName,
    adminPic,
    updateAdminProfile
  }
}
