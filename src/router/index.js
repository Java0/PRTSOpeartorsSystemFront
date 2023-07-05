
import Vue from 'vue';
import VueRouter from "vue-router";
import store from '@/store'


Vue.use(VueRouter);

import LogPage from '../pages/Log&Reg/LogPage'
import RegPage from '../pages/Log&Reg/RegPage'

import VisitorHomepage from '../pages/HomePage/VisitorHomepage'
import Homepage from '../pages/HomePage/Homepage'

import PersonalCenter from '../pages/PersonalInfo/PersonalCenter'
import AccountInfo from '../pages/PersonalInfo/AccountInfo'
import PersonalInfo from '../pages/PersonalInfo/PersonalInfo'
import ExamInfo from '../pages/PersonalInfo/ExamInfo'
import ArchivesInfo from '../pages/PersonalInfo/ArchivesInfo'




import Manage from '../pages/Manager/Manage'
import OperatorList from '../pages/Manager/OperatorList'

//防止跳转同一路由时报错
let originPush = VueRouter.prototype.push;   //备份原方法
const RouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return RouterPush.call(this, to).catch(err => err)
}
const RouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(to) {
    return RouterReplace.call(this, to).catch(err => err)
}


const router = new VueRouter({
    routes: [
        {
            name: 'visitorHomePage',
            path: '/visitor-home-page',
            component: VisitorHomepage
        },
        {
            name: 'homePage',
            path: '/home-page',
            component: Homepage,
            meta: {
                needLogin: true,
            }
        },
        {
            name: 'loginPage',
            path: '/login',
            component: LogPage
        },
        {
            name: 'registerPage',
            path: '/register',
            component: RegPage
        },

        {
            name: 'personalCenter',
            path: '/personal-center',
            component: PersonalCenter,
            meta: {
                needLogin: true,
            },
            children: [
                {
                    name: 'accountInfo',
                    path: 'account-info',
                    component: AccountInfo,
                    meta: {
                        needLogin: true,
                    },
                },
                {
                    name: 'personalInfo',
                    path: 'personal-info',
                    component: PersonalInfo,
                    meta: {
                        needLogin: true,
                    },
                },
                {
                    name: 'examInfo',
                    path: 'exam-info',
                    component: ExamInfo,
                    meta: {
                        needLogin: true,
                    },
                },
                {
                    name: 'archivesInfo',
                    path: 'archives-info',
                    component: ArchivesInfo,
                    meta: {
                        needLogin: true,
                    },
                },
            ]
        },

        {
            name: 'manage-page',
            path: '/manage',
            component: Manage,
            meta: {
                needLogin: true,
                authRequired: true
            },
            children: [
                {
                    name: 'operatorList',
                    path: 'operator-list',
                    component: OperatorList,
                    meta: {
                        needLogin: true,
                        authRequired: true
                    },
                },

                {
                    name: 'managePersonalCenter',
                    path: 'manage-personal-center',
                    component: PersonalCenter,
                    meta: {
                        needLogin: true,
                    },
                    props(route) {
                        return {
                            id: route.query.id,
                            name: route.query.name,
                            routeName: route.query.routeName
                        }
                    },
                    children: [

                        {
                            name: 'manageAccountInfo',
                            path: 'account-info',
                            component: AccountInfo,
                            props(route) {
                                return {
                                    id: route.query.id
                                }
                            },
                            meta: {
                                needLogin: true,
                                authRequired: true
                            },
                        },
                        {
                            name: 'managePersonalInfo',
                            path: 'personal-info',
                            component: PersonalInfo,
                            props(route) {
                                return {
                                    id: route.query.id
                                }
                            },
                            meta: {
                                needLogin: true,
                                authRequired: true
                            },
                        },
                        {
                            name: 'manageExamInfo',
                            path: 'exam-info',
                            component: ExamInfo,
                            props(route) {
                                return {
                                    id: route.query.id
                                }
                            },
                            meta: {
                                needLogin: true,
                                authRequired: true
                            },
                        },
                        {
                            name: 'manageArchivesInfo',
                            path: 'archives-info',
                            component: ArchivesInfo,
                            props(route) {
                                return {
                                    id: route.query.id,
                                    name: route.query.name
                                }
                            },
                            meta: {
                                needLogin: true,
                                authRequired: true
                            },
                        },
                    ]
                },
            ],
        }

    ]
});


router.beforeEach(
    (to, from, next) => {
        if (!to.meta.needLogin) {
            next();
        } else if (store.state.isLogined && !to.meta.authRequired) {
            next();
        } else if (store.state.isLogined && to.meta.authRequired && store.state.currentUser.authority > 5) {
            next();
        }
    }
)


export default router;