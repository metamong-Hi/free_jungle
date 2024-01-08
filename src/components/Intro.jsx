
import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './Intro.css';
import { useRecoilValue } from 'recoil';
import { useRecoilState } from 'recoil';
import { usernameState } from '../state/atoms';
function IntroPage() {
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(true);
    const [realusername, setUsername] = useRecoilState(usernameState);
    const navigate = useNavigate();
    const signin = () => {

        const nickname = document.getElementById('loginEmail').value.trim();
        const pw = document.getElementById('loginPassword').value.trim();
        if (nickname === "") {
            alert("닉네임을 입력해주세요");
            return;
        } else if (pw === "") {
            alert("비밀번호를 입력해주세요.");
            return;
        }
        // 로그인 로직 구현
        axios.post("http://192.168.0.30:8080/user/login/",{
 
            password: pw,
            nickname: nickname,
        }).then(function(response) {
            console.log(response.data);
            alert('로그인이 완료되었습니다!');
            localStorage.setItem('jwt', response.data.jwt);
            const token = localStorage.getItem('jwt');

            localStorage.setItem('userId',response.data.userId);
            const userId=localStorage.getItem('userId');

            // localStorage.setItem('nickname',response.data.nickname);
            // const user_nickname=localStorage.getItem('nickname');
            // setUsername(nickname);
            // console.log("닉네임은 어디있을까"+realusername)
            console.log(token); 
            console.log("userID"+userId);
            // console.log("닉네임은 바로 "+user_nickname);
            navigate(`/ground`);
        }).catch(function(error) {
            alert('로그인망함')
            console.log(error.response);
        });
    
    };

    const signup = () => {
        const username = document.getElementById('signupName').value.trim();
        const nickname = document.getElementById('signupNickName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const pw1 = document.getElementById('signupPassword').value.trim();
        const pw2 = document.getElementById('signupConfirmPassword').value.trim();

        if (username === "") {
            alert('아이디를 입력해주세요.');
            return;
        } else if (nickname === "") {
            alert('닉네임을 입력해주세요.');
            return;
        } else if (email === "") {
            alert('이메일을 입력해주세요.');
            return;
        } else if (pw1 === "") {
            alert('비밀번호를 입력해주세요.');
            return;
        } else if (pw2 === "") {
            alert('비밀번호 확인을 위해 비밀번호를 한 번 더 입력해주세요.');
            return;
        }

        if (pw1 !== pw2) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        // 회원가입 로직 구현
         axios.post("http://192.168.0.30:8080/user/",{
            "name": username,
            "email": email,
            "password": pw2,
            "nickname": nickname,
        }).then(function(response) {
            console.log("성공함")
            console.log(response.data);
            alert('회원가입이 완료되었습니다!');
        }).catch(function(error) {
            alert("망함")
            console.log(error.response);
        });
    };

    const toggleToSignup = () => {
        setIsLoginFormVisible(false);
    };

    const toggleToLogin = () => {
        setIsLoginFormVisible(true);
    };


    return (
        <div className='real_container'>
            <div className="wrapper">
                <div className="title-text">
                    <div className={isLoginFormVisible ? "title login" : "title login hide"}>Login</div>
                    <div className={isLoginFormVisible ? "title signup hide" : "title signup"}>Register</div>
                </div>
                <div className="form-container">
                    <div className="slide-controls">
                        <input type="radio" name="slide" id="login" checked={isLoginFormVisible} onChange={toggleToLogin} />
                        <input type="radio" name="slide" id="signup" checked={!isLoginFormVisible} onChange={toggleToSignup} />
                        <label htmlFor="login" className="slide login">Login</label>
                        <label htmlFor="signup" className="slide signup">Register</label>
                        <div className="slider-tab"></div>
                    </div>
                    <div className="form-inner">
                        <form action="#" className={isLoginFormVisible ? "login" : "login hide"}>
                            <div className="field">
                                <input id="loginEmail" type="text" placeholder="nickname" required/>
                            </div>
                            <div className="field">
                                <input id="loginPassword" type="password" placeholder="Password" required/>
                            </div>
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="button" id="loginButton" value="Login" onClick={signin}/>
                            </div>
                            <div className="signup-link">Not a member? <a href="#" onClick={toggleToSignup}>Signup now</a></div>
                        </form>
                        <form action="#" className={isLoginFormVisible ? "signup hide" : "signup"}>
                            <div className="field">
                                <input id="signupName" type="text" placeholder="Name" required/>
                            </div>
                            <div className="field">
                                <input id="signupNickName" type="text" placeholder="Nick name" required/>
                            </div>
                            <div className="field">
                                <input id="signupEmail" type="text" placeholder="Email Address" required/>
                            </div>
                            <div className="field">
                                <input id="signupPassword" type="password" placeholder="Password" required/>
                            </div>
                            <div className="field">
                                <input id="signupConfirmPassword" type="password" placeholder="Confirm password" required/>
                            </div>
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="button" id="registerButton" value="Register" onClick={signup}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
    );
}

export default IntroPage;

