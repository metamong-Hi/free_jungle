
import React, { useState,useEffect } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { myhouse,metamong,jiyeong } from './models/models';
import { Player } from './Player';
import { House } from './House';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {white_wall,wood_floor,navy_wall,door_texture} from './textures/textures'
import{postData} from './postData.js'
import UploadPage from '././components/UploadPage.jsx'
import DetailPostModal from '././components/DetailPost.jsx'
import gsap from 'gsap';
import {px,nx,py,ny,pz,nz} from './textures/textures'
import Swal from 'sweetalert2';

import {KeyController} from './KeyController'

export default function ThreeCanvas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWritingOpen, setIsWritingOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
    //texture 
	
    const textureLoader = new THREE.TextureLoader(); 
    const floorTexture = textureLoader.load(wood_floor);
    console.log(floorTexture)
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.x = 10;
    floorTexture.repeat.y = 10;

 

    // Renderer
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    // Scene
    const scene = new THREE.Scene();
    scene.background=new THREE.Color('white');


    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

	

	const cameraPosition = new THREE.Vector3(0, 5, -10);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    camera.zoom = 0.8;
    camera.updateProjectionMatrix();
    scene.add(camera);
	// Light
    const ambientLight = new THREE.AmbientLight('white', 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('white', 0.5);
    const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
    directionalLight.position.x = directionalLightOriginPosition.x;
    directionalLight.position.y = directionalLightOriginPosition.y;
    directionalLight.position.z = directionalLightOriginPosition.z;
    directionalLight.castShadow = true;

    // mapSize 세팅으로 그림자 퀄리티 설정
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    // 그림자 범위
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.near = -100;
    directionalLight.shadow.camera.far = 100;
    scene.add(directionalLight);

// 바닥 메쉬 설정
const meshes = [];
const floorMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(50, 50),
	new THREE.MeshStandardMaterial({
		map: floorTexture
	})
);
//여기수정함 - 배경
// scene.background=cubeTexture;
floorMesh.name = 'floor';
floorMesh.rotation.x = -Math.PI/2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);
meshes.push(floorMesh);

const pointerMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(1, 1),
	new THREE.MeshBasicMaterial({
		color: 'black',
		transparent: true,
		opacity: 0.5
	})
);
pointerMesh.rotation.x = -Math.PI/2;
pointerMesh.position.y = 0.01;
pointerMesh.receiveShadow = true;
scene.add(pointerMesh);


//여기서부터 수정함
const gltfLoader = new GLTFLoader();

const jiyeong_kiosk="jiyeong_kiosk"
const kiosks=[];
//키오스크 클릭하면 글 작성할 수 있게 수정함(feat 천지영)
const kiosk=gltfLoader.load(
	jiyeong,
	(glb) => {
		glb.scene.position.set(10, 0.1,0);
		glb.scene.name = jiyeong_kiosk;
		scene.add(glb.scene);
		kiosks.push(glb.scene);
	},
	(xhr) => {
		// This function can be used to report the progress of the loading
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	(error) => {
		// This function is called if an error occurs
		console.error('An error happened', error);
	}
);



const player = new Player({
	scene,
	meshes,
	gltfLoader,
	modelSrc: metamong
});

const raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let destinationPoint = new THREE.Vector3();
let angle = 0;
let isPressed = false; // 마우스를 누르고 있는 상태
let isDragging= false;

const clock = new THREE.Clock();
//OrbitControls는 카메라 이후 등장필요
const controls = new OrbitControls(camera, renderer.domElement)
controls.update()


let wallGroup = new THREE.Group();
  const normalTexture = textureLoader.load(navy_wall);
  const roughnessTexture = textureLoader.load(navy_wall);

  normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping;
  roughnessTexture.wrapS = roughnessTexture.wrapT = THREE.RepeatWrapping;

  const wallMaterial = new THREE.MeshStandardMaterial({
	color:'navy',
	map:normalTexture,
    side: THREE.DoubleSide,
  });
  // Front Wall
  const frontWall = new THREE.Mesh( 
    new THREE.BoxGeometry(80, 50, 0.001), 
    wallMaterial 
  );

  frontWall.position.z = -20; 

  // Left Wall
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 50, 0.001), 
    wallMaterial
  );

  leftWall.rotation.y = Math.PI / 2; 
  leftWall.position.x = -20; 

  // Right Wall
  const rightWall = new THREE.Mesh( 
    new THREE.BoxGeometry(80, 50, 0.001), 
    wallMaterial
  );

  rightWall.position.x = 20;
  rightWall.rotation.y = Math.PI / 2; 

  // Back Wall
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 50, 0.001),
    wallMaterial 
  );
  backWall.position.z = 20;

  wallGroup.add(frontWall, backWall, leftWall, rightWall);
	scene.add(wallGroup);

//1/8 문 만들어래 -from 천지영
const showMoveAlert = () => {
	Swal.fire({
	  title: `밖으로 나가시겠습니까?`,
	  text: 'OK를 클릭하면 밖으로 나갑니다',
	  icon: 'question', // 물음표 아이콘
	  showCancelButton: true, // 'Close' 버튼 표시
	  confirmButtonText: 'OK',
	  cancelButtonText: 'Close',
	}).then((result) => {
	  if (result.value) {
		// 'OK' 버튼을 클릭했을 때 실행할 함수
		Swal.fire({
			title: '완료!',
			text: '성공적으로 완료되었습니다.',
			icon: 'success', // 체크 표시 아이콘
		  });
		  navigate(`/ground`);
	  } else if (result.dismiss === Swal.DismissReason.cancel) {
		// 'Close' 버튼을 클릭했을 때 할 동작, 여기서는 아무것도 하지 않음
	  }
	});
}
const doors=[]
const doorTexture = textureLoader.load(door_texture);
const doorMaterial =new THREE.MeshStandardMaterial( {
	color:'white',
	map:doorTexture ,
    side: THREE.DoubleSide});

 const door=new THREE.Mesh(
	new THREE.PlaneGeometry(7,15), 
    doorMaterial
 )
  door.position.set(19.5, 7, 13); 
  door.castShadow = true; 
  door.receiveShadow = true; 
  door.rotation.y= -Math.PI / 2;
  scene.add(door);
  doors.push(door);
  console.log(door.position)
	

	//포스트들
	let posts= [];
	
	postData.forEach((data) => {

		var textureLoader = new THREE.TextureLoader();


//해결함
const imagePath = process.env.PUBLIC_URL + '/images/' + `${data.imgSrc}`+'.jpeg';
console.log(imagePath);


const realTexture = textureLoader.load(imagePath);
		const posting = new THREE.Mesh( 
			new THREE.PlaneGeometry(data.width, data.height),
			new THREE.MeshLambertMaterial({map:realTexture})
		  );
		  console.log(posting.Mesh);
		//   console.log(data.position)
		posting.position.set(data.position.x, data.position.y, data.position.z); 
		posting.rotation.y = data.rotationY; 
	   
		posting.userData = {
			type: 'posting', 
			info: data.info, 
		  };
	  
		  posting.castShadow = true; 
		  posting.receiveShadow = true; 

		  scene.add(posting);
		  posts.push(posting); 
		  console.log(posting.userData);

		});
	// scene.add(posts);
const keyController = new KeyController(player);



//와 성공했다 1/5 -이제 캐릭터가 키보드 컨트롤로 움직임
function walk() {


	if (keyController.keys['KeyW'] || keyController.keys['ArrowUp']) {
		player.modelMesh.position.z += Math.cos(angle) * 0.3;
		player.modelMesh.rotation.z = Math.PI;


	}
	if (keyController.keys['KeyS'] || keyController.keys['ArrowDown']) {
		player.modelMesh.position.z -= Math.cos(angle) * 0.3;
		player.modelMesh.rotation.z =0;
		

	}
	if (keyController.keys['KeyA'] || keyController.keys['ArrowLeft']) {
		player.modelMesh.position.x += Math.cos(angle) * 0.3;
		player.modelMesh.rotation.z = -Math.PI / 2;

	}
	if (keyController.keys['KeyD'] || keyController.keys['ArrowRight']) {
		player.modelMesh.position.x -= Math.cos(angle) * 0.3;
		player.modelMesh.rotation.z = Math.PI / 2; 
	
	}

	
}
//걸어가기

var speed=0.5;
//그리기
function draw() {
	walk();
	//여기까지 저장
	const delta = clock.getDelta();
	if (player.mixer) player.mixer.update(delta);
	
		// Other update code...
	if (player.modelMesh) {
		camera.lookAt(player.modelMesh.position);
	}

	if (player.modelMesh) {

		if (isPressed) {
			raycasting();
		}
	
		if (player.moving) {
			// 걸어가는 상태
			camera.position.x = cameraPosition.x + player.modelMesh.position.x;
			camera.position.z = cameraPosition.z + player.modelMesh.position.z;
			//camera.position.x = cameraPosition.x + player.modelMesh.position.x;
			//camera.position.z = cameraPosition.z + player.modelMesh.position.z;
			camera.lookAt(player.modelMesh.position);
			player.actions[0].stop();
			player.actions[1].play();
		
			
		} else {
			camera.lookAt(player.modelMesh.position);
			// 서 있는 상태
			// console.log("서있는상태")
			player.actions[1].stop();
			player.actions[0].play();
		}

	
	}
	
	renderer.render(scene, camera);
	renderer.setAnimationLoop(draw);
}


function checkIntersects() {
	console.log(posts+"여기까지 들어옴");

	const intersectsPost=raycaster.intersectObjects(posts);
	for(const post of intersectsPost){
		console.log("포스트 클릭함 성공"+JSON.stringify(post.object.userData.info.title, null, 2));

		//여기 수정함 1/7
		setSelectedPost(post.object.userData.info.title);
		setIsModalOpen(true);
		break;

	}
	const intersectsDoor=raycaster.intersectObjects(doors);
	for(const door of intersectsDoor){
		showMoveAlert();

		break;
	}
	const intersectsKiosk=raycaster.intersectObjects(kiosks);
	for(const hi of intersectsKiosk){
		setIsWritingOpen(true);

		break;
	}
}




function setSize() {
	camera.left = -(window.innerWidth / window.innerHeight);
	camera.right = window.innerWidth / window.innerHeight;
	camera.top = 1;
	camera.bottom = -1;

	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}

    // 이벤트
    window.addEventListener('resize', setSize);


function calculateMousePosition(e) {
	mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
	mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
}

// 변환된 마우스 좌표를 이용해 래이캐스팅
function raycasting() {
	raycaster.setFromCamera(mouse, camera);
	checkIntersects();
}

// 마우스 이벤트
//오른쪽이랑 왼쪽 구분해서 오른쪽은 이동, 왼쪽은 클릭으로 수정함 -12/31
canvas.addEventListener('mousedown', e => {
	if(e.button===0) { //왼쪽마우스
		isPressed = true;
		console.log(e.mouseX,e.mouseY);
		calculateMousePosition(e);
	}
	else if(e.button===2){ //오른쪽마우스
		console.log("오른쪽마우스");

	}
});
//오른쪽 도구모음 동작 막음
canvas.addEventListener('contextmenu', e => {
    e.preventDefault(); // 기본 오른쪽 클릭 동작을 막음
});
canvas.addEventListener('mouseup', e => {
	if (e.button === 2) {
        // setIsDragging(false);
		isDragging=false;
		
    }
	else if (e.button === 0) {
		console.log("왼쪽마우스 땜")
        isPressed = false;
    }
	
});
//여기서부터 수정함 1/5 (키보드 입력으로 바꿈)


// // Key down handler
// function keyDownHandler(e) {
//     keysPressed[e.key] = true;
//     console.log("Key pressed:", e.key);
// }

// // Key up handler
// function keyUpHandler(e) {
//     keysPressed[e.key] = false;
// }
// canvas.addEventListener('keydown', keyDownHandler);
// canvas.addEventListener('keyup', keyUpHandler);

draw();
    // cleanup
    return () => {
      window.removeEventListener('resize', setSize);
    }
  }, []);

  return (
	<div>
  		<canvas id="three-canvas" />
		{/* <DetailPostModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} /> */}
		
		{selectedPost && <DetailPostModal product={selectedPost} isOpen={isModalOpen}  onRequestClose={() => setIsModalOpen(false)} />}
		 <UploadPage  isOpen={isWritingOpen}  onRequestClose={() => setIsWritingOpen(false)} />
	</div>
  );

}
