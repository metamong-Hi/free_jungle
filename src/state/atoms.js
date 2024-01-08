import { atom } from 'recoil';

export const houseState = atom({
    key: 'houseState', // 고유한 키
    default: [], // 기본값은 빈 배열
});


export const jwtTokenState = atom({
    key: 'jwtTokenState', // 고유한 key
    default: null, // 기본값
});


export const usernameState= atom({
    key: 'usernameState', // 고유한 key
    default: null, // 기본값
});

export const housenameState=atom({
    key:'housenameState',
    default:null,
});
