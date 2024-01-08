import React, { useState, useEffect,useMemo,useRef } from 'react'
import { Typography, Button, Form, Input } from 'antd';
import axios from "axios";
import Modal from 'react-modal';
import './UploadPage.css';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
const { TextArea } = Input;

function UploadPage({isOpen,onRequestClose}) {
    const [User,setUser]=useState([])
    // const myUid = props.user.nickname;
    // console.log(props)
    const [Title, setTitle] = useState("")
    const userId=localStorage.getItem('userId');
    const images=[];
    const token=localStorage.getItem('jwt')
            const formData = new FormData();
    // const extractAndHandleImages = (htmlContent) => {
    //     const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    //     const images = doc.querySelectorAll('img');
    //     images.forEach(img => {
    //         const imgSrc = img.getAttribute('src');
    //         formData.append('image', imgSrc); 
    
    //         console.log('이미지만 따로 저장', imgSrc);

    //     });
    // function imageHandler(image)
    // {
    //     const formData=new FormData();
    //     formData.append('image',image)
    //     axios.post('http://192.168.0.30:8080/image', image)
    //     .then(response => {
    //         if (null !== response) {
    //             alert('이미지 업로드에 성공했습니다')
    //             // props.history.push('/')
    //         } else {
    //             alert('글 업로드에 실패 했습니다.')
    //         }
    //     })
    // }
    const reactQuillRef = useRef(null);
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('image', file);

            // 서버에 이미지를 전송하고 이미지 URL을 받습니다.
            try {
                const response = axios.post('http://192.168.0.30:8080/image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const quill = reactQuillRef.current.getEditor();
                const range = quill.getSelection(true);

                // 받은 이미지 URL로 이미지를 삽입합니다.
                quill.insertEmbed(range.index, 'image', response.data.imageUrl);
                quill.setSelection(range.index + 1);
            } catch (error) {
                console.error('Error uploading image: ', error);
            }
        };
    };
    //react-quill적용 1/6
    const modules = useMemo(() => {
        return {
          toolbar: {
            container: [
              ['image'],
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            ],
            handlers: {
              // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
              image: imageHandler,
            },
          },
        };
      }, []);
      

    const [Description, setDescription] = useState("");

    const onEditorChangeHandler = (value) => {
        setDescription(value);
        // imageHandler(value); // 에디터 내용이 변경될 때 이미지 추출 함수 호출
    }


    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }
  
    const submitHandler = (event) => {
        event.preventDefault();

        if (!Title || !Description ) {
            return alert(" 모든 값을 넣어주셔야 합니다.")
            console.log("모든값")
        }


        //서버에 채운 값들을 request로 보낸다.

        const body = {
            userId: userId,
            title:Title,
            content:Description,
            token:token,
        }
        onRequestClose(true);
        axios.post('http://192.168.0.30:8080/post/', body)
            .then(response => {
                if (null !== response) {
                    alert('글 업로드에 성공 했습니다.')
                    // props.history.push('/')
                } else {
                    alert('글 업로드에 실패 했습니다.')
                }
            })
    }


    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2> post please</h2>
            </div>

            <Form>
                {/* DropZone */}
                {/* <FileUpload refreshFunction={updateImages} /> */}
                <br />
                <br />
                <label>Title</label>
                <Input onChange={titleChangeHandler} value={Title} />
             
                <br />
                <br />
                
                <br />

                <ReactQuill onChange={onEditorChangeHandler}
                style={{ width: "800px", height: "600px" }}
                 modules={modules}/>
                <br />
                <br/>
                <br/>
   
                <button className="button edit-button" onClick={onRequestClose}>닫기</button>
        <button className="button close-button" onClick={submitHandler}>확인</button>
            </Form>


        </div>
        </Modal>
    )
}

export default UploadPage;