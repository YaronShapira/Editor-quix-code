// import { getWap1Template } from '../wap-templates/wap-template-1/wap-1-template'
import { getDemoCmps1 } from '../wap-templates/wap-1/wap-1'
// import { getWap2Template } from '../wap-templates/wap-template-2/wap-2-template'
import { getDemoCmps2 } from '../wap-templates/wap-2/wap-2'
// import { getWap3Template } from '../wap-templates/wap-template-3/wap-template-3'
import { getDemoCmps3 } from '../wap-templates/wap-3/wap-3'
import { getDemoGeneralCmps } from '../wap-templates/general-cmps/general-cmps'
import { getDemoCmps4 } from '../wap-templates/wap-4/wap-4'
import { getDemoCmps5 } from '../wap-templates/wap-5/wap-5'
import { getDemoCmps6 } from '../wap-templates/wap-6/wap-6'
import { getDemoCmps7 } from '../wap-templates/wap-7/wap-7'
import { httpService } from './http.service'

import { storageService } from './async-storage.service'
import { makeId, utilService } from './util.service'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = MINUTE * 60

export const wapService = {
    getCmpById,
    query,
    get,
    remove,
    save,
    getEditedWap,
    getCmpsByCategory,
    findParentCmp,
    getWapByUrl,
    removeCmp,
    saveCmp,
    getBlankWap,
}

let gCmpsMap
const STORAGE_KEY = 'wapDB'
const EDITED_WAP_STORAGE_KEY = 'editedWap'

// _createWaps()
_createMap()
function getCmpById(activeModule, cmpId) {
    return gCmpsMap[activeModule].find(cmp => cmp.id === cmpId)
    // return httpService.get(`wap`, { category: activeModule, cmpId })
}
async function getWapByUrl(wapUrl) {
    // let wap = await query({ owner: 'guest', url: wapUrl })
    // if (!wap[0]) Promise.reject('NOT FOUND')
    return httpService.get(`wap/${wapUrl}`)
    // return gCmpsMap[activeModule].find(cmp => cmp.url === cmpUrl)
}

function _createMap() {
    const allFractions = [
        ...getDemoCmps1(),
        ...getDemoCmps2(),
        ...getDemoCmps3(),
        ...getDemoCmps4(),
        ...getDemoCmps5(),
        ...getDemoCmps6(),
        ...getDemoCmps7(),
        ...getDemoGeneralCmps(),
    ]
    gCmpsMap = allFractions.reduce((acc, fraction) => {
        if (acc[fraction.category]) {
            acc[fraction.category].push(fraction)
        } else {
            acc[fraction.category] = [fraction]
        }
        return acc
    }, {})
}

// function updateCmp(cmp, parentCmp) {
//     let foundCmp = parentCmp?.cmps?.find(c => c.id === cmp.id)
//     if (foundCmp) {
//         foundCmp = cmp
//     } else {
//         return parentCmp?.cmps?.forEach(c => updateCmp(cmp, c))
//     }
// }

function getCmpsByCategory(category) {
    return gCmpsMap[category]
}

async function query(filterBy = { owner: 'guest' }) {
    return httpService.get(`wap`, filterBy)
}

// function getUserSites(userWaps) {
//     const sites = userWaps.reduce((acc, wap) => {
//         acc.push({
//             _id: wap._id,
//             leads: wap.leads,
//             subscribers: wap.subscribers,
//             msgs: wap.msgs,
//             title: wap.title,
//             thumbnail: wap.thumbnail,
//             schedule: wap.schedule,
//         })
//         return acc
//     }, [])
//     return sites
// }

async function get(wapId) {
    // return await storageService.get(STORAGE_KEY, wapId)
    return httpService.get(`wap/${wapId}`)
}
function remove(wapId) {
    // return storageService.remove(STORAGE_KEY, wapId)
    return httpService.remove(`wap/${wapId}`)
}

async function save(wap) {
    let savedWap
    if (wap._id) {
        // savedWap = await storageService.put(STORAGE_KEY, wap)
        savedWap = httpService.put(`wap/${wap._id}`, wap)
        // savedCar = await httpService.put(`car/${car._id}`, car)
    } else {
        // Later, owner is set by the backend
        // car.owner = userService.getLoggedinUser()
        // savedWap = await storageService.post(STORAGE_KEY, wap)
        savedWap = httpService.post('', wap)
        // savedCar = await httpService.post('car', car)
    }
    return savedWap
}

function getEditedWap() {
    return utilService.loadFromStorage(EDITED_WAP_STORAGE_KEY)
}

function getBlankWap() {
    return {
        _id: makeId(),
        owner: 'guest',
        title: 'blank-template',
        cmps: [],
        msgs: [],
        leads: [],
        subscribers: [],
        schedule: {
            eventDuration: 30,
            daysForward: 6,
            data: [],
            days: ['sunday', 'monday', 'tuesday', 'wednesday'],
            startHour: 8,
            endHour: 17,
        },
        breakpoints: { mobileLayout: 800, tabletLayout: 1050 },
    }
}

function _createWaps() {
    let waps = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!waps || !waps.length) {
        waps = [
            {
                _id: utilService.makeId(),
                name: 'wap-1',
                owner: 'admin',
                leads: [],
                schedule: {
                    eventDuration: 30,
                    daysForward: 6,
                    data: [],
                    days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
                    startHour: 8,
                    endHour: 17,
                },
                subscribers: [],
                cmps: getDemoCmps1(),
                pallete: ['#ffbf23', '#ffd7ef', '#ffffff', '#101010'],
                themeClass: 'wap1-primary',
                breakpoints: { mobileLayout: 800, tabletLayout: 1350 },
                msgs: {
                    guest1: [
                        { by: 'customer', txt: "Hey, man! What's up, Mr Stark?", date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: "Kid, where'd you come from?", date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'Field trip!', date: new Date().getTime() - HOUR },
                        {
                            by: 'owner',
                            txt: "Uh, what is this guy's problem, Mr. Stark?",
                            date: new Date().getTime() - HOUR,
                        },
                        {
                            by: 'customer',
                            txt: "Uh, he's from space, he came here to steal a necklace from a wizard.",
                            date: new Date().getTime() - HOUR - HOUR,
                        },
                    ],
                    guest2: [
                        { by: 'customer', txt: 'hahaha', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'Yes this is lit', date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'help me please!', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'NOOO!' },
                        { by: 'customer', txt: 'I love Wix!', date: new Date().getTime() - HOUR },
                    ],
                },
                thumbnail:
                    'https://res.cloudinary.com/dotasvsuv/image/upload/v1674060298/wap-1-index-thumbnail_ygzwg7.jpg',
                title: 'Tech Company',
            },
            {
                _id: utilService.makeId(),
                name: 'wap-2',
                owner: 'admin',
                leads: [],
                schedule: {
                    eventDuration: 30,
                    daysForward: 6,
                    data: [],
                    days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
                    startHour: 8,
                    endHour: 17,
                },
                subscribers: [],
                cmps: getDemoCmps2(),
                pallete: ['#a3eee9', '#0b1321', '#8b95a6', '#eef'],
                themeClass: 'wap2-primary',
                breakpoints: {
                    tabletLayout: 1000,
                },
                msgs: {
                    guest1: [
                        { by: 'customer', txt: "Hey, man! What's up, Mr Stark?", date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: "Kid, where'd you come from?", date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'Field trip!', date: new Date().getTime() - HOUR },
                        {
                            by: 'owner',
                            txt: "Uh, what is this guy's problem, Mr. Stark?",
                            date: new Date().getTime() - HOUR,
                        },
                        {
                            by: 'customer',
                            txt: "Uh, he's from space, he came here to steal a necklace from a wizard.",
                            date: new Date().getTime() - HOUR - HOUR,
                        },
                    ],
                    guest2: [
                        { by: 'customer', txt: 'hahaha', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'Yes this is lit', date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'help me please!', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'NOOO!' },
                        { by: 'customer', txt: 'I love Wix!', date: new Date().getTime() - HOUR },
                    ],
                },

                thumbnail:
                    'https://res.cloudinary.com/dotasvsuv/image/upload/v1674060311/wap-2-index-thumbnail_ausxyt.jpg',
                title: 'Gaming Startup',
            },
            {
                _id: utilService.makeId(),
                name: 'wap-3',
                owner: 'admin',
                leads: [],
                schedule: {
                    eventDuration: 30,
                    daysForward: 6,
                    data: [],
                    days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
                    startHour: 8,
                    endHour: 17,
                },
                subscribers: [],
                cmps: getDemoCmps3(),
                pallete: ['#dcdcdc', '#303030', '#5783de'],
                themeClass: 'wap3-primary',
                breakpoints: {
                    mobileLayout: 700,
                    tabletLayout: 1050,
                },
                msgs: {
                    guest1: [
                        { by: 'customer', txt: "Hey, man! What's up, Mr Stark?", date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: "Kid, where'd you come from?", date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'Field trip!', date: new Date().getTime() - HOUR },
                        {
                            by: 'owner',
                            txt: "Uh, what is this guy's problem, Mr. Stark?",
                            date: new Date().getTime() - HOUR,
                        },
                        {
                            by: 'customer',
                            txt: "Uh, he's from space, he came here to steal a necklace from a wizard.",
                            date: new Date().getTime() - HOUR - HOUR,
                        },
                    ],
                    guest2: [
                        { by: 'customer', txt: 'hahaha', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'Yes this is lit', date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'help me please!', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'NOOO!' },
                        { by: 'customer', txt: 'I love Wix!', date: new Date().getTime() - HOUR },
                    ],
                },

                thumbnail:
                    'https://res.cloudinary.com/dotasvsuv/image/upload/v1674060492/wap-3-index-thumbnail_dheye8.jpg',
                title: 'Fintech Webinar',
            },
            {
                _id: utilService.makeId(),
                name: 'wap-4',
                owner: 'admin',
                leads: [],
                schedule: {
                    eventDuration: 30,
                    daysForward: 6,
                    data: [],
                    days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
                    startHour: 8,
                    endHour: 17,
                },
                subscribers: [],
                cmps: getDemoCmps4(),
                themeClass: 'wap4-primary',
                breakpoints: {
                    mobileLayout: 750,
                    tabletLayout: 1400,
                },
                msgs: {
                    guest1: [
                        { by: 'customer', txt: "Hey, man! What's up, Mr Stark?", date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: "Kid, where'd you come from?", date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'Field trip!', date: new Date().getTime() - HOUR },
                        {
                            by: 'owner',
                            txt: "Uh, what is this guy's problem, Mr. Stark?",
                            date: new Date().getTime() - HOUR,
                        },
                        {
                            by: 'customer',
                            txt: "Uh, he's from space, he came here to steal a necklace from a wizard.",
                            date: new Date().getTime() - HOUR - HOUR,
                        },
                    ],
                    guest2: [
                        { by: 'customer', txt: 'hahaha', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'Yes this is lit', date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'help me please!', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'NOOO!' },
                        { by: 'customer', txt: 'I love Wix!', date: new Date().getTime() - HOUR },
                    ],
                },

                thumbnail: 'https://res.cloudinary.com/dotasvsuv/image/upload/v1674259751/wap4-thumbnail_lj6j7a.jpg',
                title: 'Movie Blog',
            },
            {
                _id: utilService.makeId(),
                name: 'wap-5',
                owner: 'admin',
                leads: [],
                schedule: {
                    eventDuration: 30,
                    daysForward: 6,
                    data: [],
                    days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
                    startHour: 8,
                    endHour: 17,
                },
                subscribers: [],
                cmps: getDemoCmps5(),
                themeClass: 'wap5-primary',
                breakpoints: {
                    mobileLayout: 680,
                    tabletLayout: 880,
                    desktopLayout: 1300,
                },
                msgs: {
                    guest1: [
                        { by: 'customer', txt: "Hey, man! What's up, Mr Stark?", date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: "Kid, where'd you come from?", date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'Field trip!', date: new Date().getTime() - HOUR },
                        {
                            by: 'owner',
                            txt: "Uh, what is this guy's problem, Mr. Stark?",
                            date: new Date().getTime() - HOUR,
                        },
                        {
                            by: 'customer',
                            txt: "Uh, he's from space, he came here to steal a necklace from a wizard.",
                            date: new Date().getTime() - HOUR - HOUR,
                        },
                    ],
                    guest2: [
                        { by: 'customer', txt: 'hahaha', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'Yes this is lit', date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'help me please!', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'NOOO!' },
                        { by: 'customer', txt: 'I love Wix!', date: new Date().getTime() - HOUR },
                    ],
                },

                thumbnail: 'https://res.cloudinary.com/dotasvsuv/image/upload/v1674500846/wap5-thumbnail_n4g3mz.jpg',
                title: 'Restaurant Webflow',
            },
            {
                _id: utilService.makeId(),
                name: 'wap-6',
                owner: 'admin',
                leads: [],
                schedule: {
                    eventDuration: 30,
                    daysForward: 6,
                    data: [],
                    days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
                    startHour: 8,
                    endHour: 17,
                },
                subscribers: [],
                cmps: getDemoCmps6(),
                themeClass: 'wap6-primary',
                breakpoints: {
                    tabletLayout: 800,
                },
                msgs: {
                    guest1: [
                        { by: 'customer', txt: "Hey, man! What's up, Mr Stark?", date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: "Kid, where'd you come from?", date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'Field trip!', date: new Date().getTime() - HOUR },
                        {
                            by: 'owner',
                            txt: "Uh, what is this guy's problem, Mr. Stark?",
                            date: new Date().getTime() - HOUR,
                        },
                        {
                            by: 'customer',
                            txt: "Uh, he's from space, he came here to steal a necklace from a wizard.",
                            date: new Date().getTime() - HOUR - HOUR,
                        },
                    ],
                    guest2: [
                        { by: 'customer', txt: 'hahaha', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'Yes this is lit', date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'help me please!', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'NOOO!' },
                        { by: 'customer', txt: 'I love Wix!', date: new Date().getTime() - HOUR },
                    ],
                },

                thumbnail: 'https://res.cloudinary.com/dotasvsuv/image/upload/v1674563731/wap-6-thumbnail_fcovpe.jpg',
                title: 'Cafe & Bakery',
            },
            {
                _id: utilService.makeId(),
                name: 'wap-7',
                owner: 'admin',
                leads: [],
                schedule: {
                    eventDuration: 30,
                    daysForward: 6,
                    data: [],
                    days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
                    startHour: 8,
                    endHour: 17,
                },
                subscribers: [],
                cmps: getDemoCmps7(),
                themeClass: 'wap7-primary',
                breakpoints: {
                    mobileLayout: 700,
                    tabletLayout: 1230,
                    desktopLayout: 1400,
                },
                msgs: {
                    guest1: [
                        { by: 'customer', txt: "Hey, man! What's up, Mr Stark?", date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: "Kid, where'd you come from?", date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'Field trip!', date: new Date().getTime() - HOUR },
                        {
                            by: 'owner',
                            txt: "Uh, what is this guy's problem, Mr. Stark?",
                            date: new Date().getTime() - HOUR,
                        },
                        {
                            by: 'customer',
                            txt: "Uh, he's from space, he came here to steal a necklace from a wizard.",
                            date: new Date().getTime() - HOUR - HOUR,
                        },
                    ],
                    guest2: [
                        { by: 'customer', txt: 'hahaha', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'Yes this is lit', date: new Date().getTime() - HOUR },
                        { by: 'customer', txt: 'help me please!', date: new Date().getTime() - HOUR },
                        { by: 'owner', txt: 'NOOO!' },
                        { by: 'customer', txt: 'I love Wix!', date: new Date().getTime() - HOUR },
                    ],
                },

                thumbnail: 'https://res.cloudinary.com/dotasvsuv/image/upload/v1674479603/wap-7-thumbnail_f7fyrx.jpg',
                title: 'Music Podcast',
            },
        ]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(waps))
    }
}

function saveCmp(cmp, index, parentCmp) {
    parentCmp.cmps.splice(index, 1, cmp)
}

function findParentCmp(cmp, parentCmp, cb) {
    const isFoundCmpIndex = parentCmp?.cmps?.findIndex(c => c.id === cmp.id)
    if (isFoundCmpIndex > -1) {
        cb(cmp, isFoundCmpIndex, parentCmp)
    } else {
        return parentCmp?.cmps?.forEach(c => findParentCmp(cmp, c, cb))
    }
}

function removeCmp(cmp, index, parentCmp) {
    parentCmp.cmps.splice(index, 1)
}
