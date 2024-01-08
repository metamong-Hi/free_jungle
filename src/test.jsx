import React, { useState,useEffect } from 'react';
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { myhouse,metamong } from './models/models';
import { Player } from './Player';
import { House } from './House';
import MyModal from '././components/modal.jsx'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { KeyController } from './KeyController';


import gsap from 'gsap';
import {px,nx,py,ny,pz,nz} from './textures/textures'

export default function Test() {
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    //texture 
	
    const textureLoader = new THREE.TextureLoader(); 
    const floorTexture = textureLoader.load(nx);
    console.log(floorTexture)
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.x = 1;
    floorTexture.repeat.y = 1;

    // 배경 이미지 로드
	const cubeTextureLoader = new THREE.CubeTextureLoader();
	const cubeTexture = cubeTextureLoader
		.load([
			// + - 순서
			px, nx,
			py, ny,
			pz, nz
		]);
	console.log(cubeTexture);

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

	//초기 설정값
    // const cameraPosition = new THREE.Vector3(1, 5, 5);

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
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		map: floorTexture
	})
);
//여기수정함 - 배경
scene.background=cubeTexture;
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

const spotMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3),
	new THREE.MeshStandardMaterial({
		color: 'crimson',
		transparent: true,
		opacity: 0.5
	})
);
spotMesh.position.set(5, 0.005, 5);
spotMesh.rotation.x = -Math.PI/2;
spotMesh.receiveShadow = true;
scene.add(spotMesh);

//여기서부터 수정함
const gltfLoader = new GLTFLoader();


const house = new House({
	scene,
	meshes,
	gltfLoader,
	modelSrc: myhouse
});

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
let previousMousePosition = {
    x: 0,
    y: 0
};
const clock = new THREE.Clock();
//⭐OrbitControls는 카메라 이후 등장필요
const controls = new OrbitControls(camera, renderer.domElement)
controls.update()



	// 키보드 컨트롤
	const keyController = new KeyController();

	function walk() {
        
		if (keyController.keys['KeyW'] || keyController.keys['ArrowUp']) {
			player.modelMesh.position.z -= Math.cos(angle) * 0.05;
		}
		if (keyController.keys['KeyS'] || keyController.keys['ArrowDown']) {
			player.modelMesh.position.z += Math.cos(angle) * 0.05;
		}
		if (keyController.keys['KeyA'] || keyController.keys['ArrowLeft']) {
			player.modelMesh.position.x += Math.cos(angle) * 0.05;
		}
		if (keyController.keys['KeyD'] || keyController.keys['ArrowRight']) {
			player.modelMesh.position.x -= Math.cos(angle) * 0.05;
		}
        // camera.position.setx = cameraPosition.x + player.modelMesh.position.x;
		// 	camera.position.z = cameraPosition.z + player.modelMesh.position.z;
			
			// player.actions[0].stop();
			// player.actions[1].play();
        
	}
  
//그리기
function draw() {


	walk();

	// //여기까지 저장
	// const delta = clock.getDelta();

	// if (player.mixer) player.mixer.update(delta);

	// if (player.modelMesh) {
	// 	camera.lookAt(player.modelMesh.position);
	// }

	// if (player.modelMesh) {

	
	// renderer.render(scene, camera);
	// renderer.setAnimationLoop(draw);
}


function checkIntersects() {
	// raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(meshes);
	for (const item of intersects) {
		if (item.object.name === 'floor') {
			destinationPoint.x = item.point.x;
			destinationPoint.y = 0.1;
			destinationPoint.z = item.point.z;
			player.modelMesh.lookAt(destinationPoint);
			console.log(item.point)
			player.moving = true;
			pointerMesh.position.x = destinationPoint.x;
			pointerMesh.position.z = destinationPoint.z;
		}
		else if(item.object.name==='house'){
			console.log("찍혔음")
		}
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

// 마우스 좌표를 three.js에 맞게 변환
// 마우스 좌표를 three.js에 맞게 변환
function calculateMousePosition(e) {
	mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
	mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);
}

// 변환된 마우스 좌표를 이용해 래이캐스팅
function raycasting() {
	raycaster.setFromCamera(mouse, camera);
	checkIntersects();
}
function clickHouse(){
	console.log("왼쪽마우스 클릭했음");

}
// 마우스 이벤트
//오른쪽이랑 왼쪽 구분해서 오른쪽은 이동, 왼쪽은 클릭으로 수정함 -12/31
canvas.addEventListener('mousedown', e => {
	if(e.button===0) { //왼쪽마우스
		isPressed = true;
		calculateMousePosition(e);
	}
	else if(e.button===2){ //오른쪽마우스
		console.log("오른쪽마우스")
		// isDragging=true;

      
		isDragging=true;

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

draw();
    // cleanup
    return () => {
      window.removeEventListener('resize', setSize);
    }
  }, []);

  return (
	<div>
  		<canvas id="three-canvas" />
		  <MyModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
	</div>
  );

}
