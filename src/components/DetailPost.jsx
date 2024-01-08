import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DetailPost.css';
import Modal from 'react-modal';
function DetailPostModal({ isOpen,product,onRequestClose }) {
  const [productDetails, setProductDetails] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
// 댓글 데이터를 상태로 관리
  const [comments, setComments] = useState([
    { id: 1, name: 'John Doe', timestamp: '2023-10-02 14:30', content: 'This is a sample comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', avatar: 'https://randomuser.me/api/portraits/men/43.jpg' },
    { id: 2, name: 'Jane Smith', timestamp: '2023-10-02 15:15', content: 'Another sample comment. Sed quis velit auctor, bibendum dolor in, accumsan tellus.', avatar: 'https://randomuser.me/api/portraits/women/43.jpg' }
    ,{ id: 3, name: 'Jane Smith', timestamp: '2023-10-02 15:15', content: 'Another sample comment. Sed quis velit auctor, bibendum dolor in, accumsan tellus.', avatar: 'https://randomuser.me/api/portraits/women/43.jpg' }
    ,{ id: 3, name: 'Jane Smith', timestamp: '2023-10-02 15:15', content: 'Another sample comment. Sed quis velit auctor, bibendum dolor in, accumsan tellus.', avatar: 'https://randomuser.me/api/portraits/women/43.jpg' }
   


  ]);
  const customStyles = {
    overlay: {
        backgroundColor: 'transparent'
    },
    content: {


        height: 'auto', // 모달의 높이를 콘텐츠에 맞춤
      
    }
};
  const postComments=()=>{
      return (
        <div className="relative w-[32rem]">
          <div className="relative w-full min-w-[200px]">
            <textarea
              rows="8"
              className="peer h-full min-h-[100px] w-full !resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
            ></textarea>
            <label className="before:content-[' '] after:content-[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Your Comment
            </label>
          </div>
          <div className="flex gap-2">
   
            <button
              className="select-none rounded-md bg-gray-900 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Post Comment
            </button>
          </div>
        </div>
      );

    
  }
  // 댓글을 렌더링하는 함수
  const renderComments = () => {
    return comments.map(comment => (
      <div key={comment.id} className="flex mt-4 items-start">
        <div className="w-14 h-14 rounded-full bg-purple-400/50 flex-shrink-0 flex items-center justify-center">
          <img className="h-12 w-12 rounded-full object-cover" src={comment.avatar} alt={comment.name} />
        </div>

        <div className="ml-3 flex-grow">
          <div className="flex justify-between">
            <div>
              <div className="font-medium text-purple-800">{comment.name}</div>
              <div className="text-gray-600">Posted on {comment.timestamp}</div>
            </div>
            <button className="text-red-500 hover:text-red-700 font-medium">Delete</button>
          </div>
          <div className="mt-2 text-purple-800">
            {comment.content}
          </div>
        </div>
      </div>
    ));
  };

  // useEffect(() => {
    console.log("여기까지 들어옴 디테일페이지"+product); //newjeans6 잘찍힘
    // const fetchProductDetails = async () => {
    //   setIsLoading(true);
    //   setError(null);

      // try {
      //   const response = await axios.get(`/api/products/${product.id}`);
      //   setProductDetails(response.data);
      // } catch (error) {
      //   setError('Error fetching product details');
      //   console.error('Error fetching product details', error);
      // }

      // try {
      //   const commentsResponse = await axios.get(`/api/products/${product.id}/comments`);
      //   setComments(commentsResponse.data);
      // } catch (error) {
      //   setError('Error fetching comments');
      //   console.error('Error fetching comments', error);
      // }
   

    // fetchProductDetails();
  // }, [product]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} product={product}style={customStyles}>

  <div className="container">

<div className="comment-box">
  {renderComments()}
</div>
<div className="comment-box">
  {postComments()}

  {renderComments()}
  <button className="button edit-button">수정</button>
        <button className="button close-button" onClick={onRequestClose}>닫기</button>
</div>

</div>

    </Modal>  
    );
}

export default DetailPostModal;
/* <div className="modal-container">
<button className="close-button" onClick={onClose}>Close</button>
{isLoading ? (
  <p>Loading...</p>
) : error ? (
  <p>{error}</p>
) : (
  <div className="product-details">
    {productDetails && (
      <>
        <h2>{productDetails.name}</h2>
        <p>{productDetails.description}</p>
      </>
    )}
    <div className="comments-section">
      <h3>Comments</h3>
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <p>{comment.text}</p>
          {/* 댓글에 대한 추가 정보 (작성자, 날짜 등) 표시 */
        //</div>
    //  ))}
   // </div>
//  </div>
//)}
//</div> */}