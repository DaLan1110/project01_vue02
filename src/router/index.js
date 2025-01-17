import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Login.vue'
import RegistrationView from '@/views/Registration.vue'
import LayoutView from '@/views/AppLayout.vue'
import HomeView from '@/views/Home.vue'
import CompanyView from '@/views/member/Company.vue'
import CompanyCreateView from '@/views/member/CompanyCreate.vue'
import CompanyUpdateView from '@/views/member/CompanyUpdate.vue'
import CompanyUpdateUserView from '@/views/member/CompanyUpdateUser.vue'
import MemberView from '@/views/member/Member.vue'
import MemberCreateView from '@/views/member/MemberCreate.vue'
import MmeberUpdateView from '@/views/member/MemberUpdate.vue'
import ProductView from '@/views/product/ProductView.vue'
import ProductCreateView from '@/views/product/ProductCreate.vue'
import ProductUpdateView from '@/views/product/ProductUpdate.vue'
import OrderView from '@/views/product/Order.vue'
import OrderDataView from '@/views/product/OrderData.vue'
import AddressView from '@/views/Join/Address.vue'
import JoinData from '@/views/Join/JoinData.vue'
import JoinView from '@/views/Join/Join.vue'
import SettingView from '@/views/Setting.vue'
import { useUserStore } from '@/stores/users'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: LayoutView,
      redirect: '/home', // 當訪問 `/` 時，自動重定向到 `/home`
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: HomeView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }]
          }
        },
        {
          path: 'company',
          name: 'company',
          component: CompanyView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '公司'
            }]
          },
        },
        {
          path: 'company/create',
          name: 'companyCreate',
          component: CompanyCreateView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '公司',
              link: '/company'
            },
            {
              name: '新增人員'
            }
            ]
          },
        },
        {
          path: 'company/:id/update',
          name: 'companyUpdate',
          component: CompanyUpdateView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '公司',
              link: '/company'
            },
            {
              name: '修改公司人員資料'
            }
            ]
          },
        },
        {
          path: 'company/:id/updateUser',
          name: 'companyUpdateUser',
          component: CompanyUpdateUserView,
          props: true,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '公司',
              link: '/company'
            },
            {
              name: '修改個人人員資料'
            }
            ]
          },
        },
        {
          path: 'member',
          name: 'member',
          component: MemberView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '會員'
            }]
          }
        },
        {
          path: 'member/create',
          name: 'memberCreate',
          component: MemberCreateView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '會員',
              link: '/member'
            }, {
              name: '新增會員',
            }]
          }
        },
        {
          path: 'member/:id/update',
          name: 'memberUpdate',
          component: MmeberUpdateView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '會員',
              link: '/member'
            }, {
              name: '修改會員資料',
            }]
          }
        },
        {
          path: 'product',
          name: 'product',
          component: ProductView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '產品'
            }]
          }
        },
        {
          path: 'product/create',
          name: 'productCreate',
          component: ProductCreateView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '產品',
              link: '/product'
            }, {
              name: '新增產品'
            }]
          }
        },
        {
          path: 'product/:id/update',
          name: 'productUpdate',
          component: ProductUpdateView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '產品',
              link: '/product'
            }, {
              name: '修改產品'
            }]
          }
        },
        {
          path: 'order',
          name: 'order',
          component: OrderView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '訂單'
            }]
          },
        },
        {
          path: 'order/:id/data',
          name: 'orderData',
          component: OrderDataView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '訂單',
              link: '/order'
            }, {
              name: '訂單資料'
            }]
          },
        },
        {
          path: 'address',
          name: 'address',
          component: AddressView,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '加盟地址'
            }]
          }
        },
        {
          path: 'address/:id/data',
          name: 'joinData',
          component: JoinData,
          meta: {
            requiresAuth: true,
            breadcrumb: [{
              name: '首頁',
              link: '/'
            }, {
              name: '加盟地址',
              link: '/address'
            }, {
              name: '加盟資料'
            }]
          }
        },
        // {
        //   path: 'join',
        //   name: 'join',
        //   component: JoinView,
        //   meta: {
        //     requiresAuth: true,
        //     breadcrumb: [{
        //       name: '首頁',
        //       link: '/'
        //     }, {
        //       name: '加入加盟'
        //     }]
        //   }
        // },
        // {
        //   path: 'setting',
        //   name: 'setting',
        //   component: SettingView,
        //   meta: {
        //     requiresAuth: true,
        //     breadcrumb: [{
        //       name: '首頁',
        //       link: '/'
        //     }, {
        //       name: '設定'
        //     }]
        //   }
        // }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // 確保在檢查身份驗證之前檢查用戶狀態
  await userStore.checkAuthStatus();

  if (to.meta.requiresAuth) {
    // 如果路由需要身份驗證
    if (!userStore.isAuthenticated) {
      // 如果用戶未登入，重定向到登入頁
      next({ name: 'login' });
    } else {
      // 如果用戶已登入，繼續導航
      next();
    }
  } else {
    // 不需要身份驗證的路由
    next();
  }
});

export default router
