import React, { useState,useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { myhouse, metamong } from './models/models';
import { Player } from './Player';
import { House } from './House';
import { useNavigate } from 'react-router-dom';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { KeyController } from './KeyController';
// import MoveModal from '././components/modal_move.jsx'
import Swal from 'sweetalert2';

import gsap from 'gsap';
import {px,nx,py,ny,pz,nz} from './textures/textures'
import IntroPage from './components/Intro.jsx';


import { useRecoilValue } from 'recoil';
import { houseState } from './state/atoms.js';


export default function ThreeCanvas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenRoom, setIsModalOpenRoom]=useState(false);
  const [selectedHouse,setIsSelectedHouse]=useState(false);
  const [houseOwner,setHouseOwner]=useState("test");
  const navigate = useNavigate();
  //1/7 수정함 임시저장(이름)
	// const houses_test = useRecoilValue(houseState);
	// console.log("house_test"+houses_test[0] +"DURLDUDL")
	const name="seojin"

  //여기 추가함1/1
	const [mouseStart,setMouseStart]=useState({ x: 0, y: 0 });
	const [dx,setDx]=useState(0);
	const [dy,setDy]=useState(0);

	//여기 추가함 1/6 - 클릭한 위치에 집 생성 
	const [destinationPoint, setDestinationPoint] = useState({ x: 0, y: 0, z: 0 });
	const [scene, setScene] = useState(null);
    const [gltfLoader, setGltfLoader] = useState(null);


	
  useEffect(() => {
    //texture 
	
    const textureLoader = new THREE.TextureLoader(); 
    const floorTexture = textureLoader.load(ny);
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
	new THREE.PlaneGeometry(200, 200),
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
console.log(meshes)
//여기 수정함 1/6 클릭하면 집 생성하는 메시 크기 수정
const pointerMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(3, 3),
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
// scene.add(spotMesh);
setScene(scene);

//여기서부터 수정함
const gltfLoader = new GLTFLoader();
setGltfLoader(gltfLoader);


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
const keyController = new KeyController(player);


//와 성공했다 1/5 -이제 캐릭터가 키보드 컨트롤로 움직임
function walk() {


	if (keyController.keys['KeyW'] || keyController.keys['ArrowUp']) {
		//너무 느려서 속도 조절함 1/7 수정
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

const clock = new THREE.Clock();
//⭐OrbitControls는 카메라 이후 등장필요
const controls = new OrbitControls(camera, renderer.domElement)
controls.update()
//그리기
function draw() {
	walk();

	//여기까지 저장
	const delta = clock.getDelta();

	if (player.mixer) player.mixer.update(delta);

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
const houses=[]
function handleOk(){
	console.log(destinationPoint,"seojin");
	// const housereal = new House({
	// 	x: destinationPoint.x,
	// 	y: destinationPoint.y,
	// 	z: destinationPoint.z,
	// 	scene: scene,
	// 	gltfLoader: gltfLoader,
	// 	modelSrc: myhouse,
	// 	name: "seojin"
	// });
	// meshes.push(housereal);

	const housereal=gltfLoader.load(
		myhouse,
	    (glb) => {
			glb.scene.position.set(destinationPoint.x, destinationPoint.y, destinationPoint.z);
			glb.scene.name = name;
			scene.add(glb.scene);
			houses.push(glb.scene);
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
	houses.forEach(house => {
		console.log("순서대로 찍힘"+house.name);
	});
	console.log(houses.length)

}
const showMoveHouseAlert = (hello) => {
	Swal.fire({
	  title: `${hello}님 집을 방문하시겠습니까?`,
	  text: 'OK를 클릭하면 집으로 이동합니다',
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
		  navigate(`/room/${hello}`);
	  } else if (result.dismiss === Swal.DismissReason.cancel) {
		// 'Close' 버튼을 클릭했을 때 할 동작, 여기서는 아무것도 하지 않음
	  }
	});
}
const showMakeHouseAlert = () => {
		Swal.fire({
		  title: '집만들기',
		  text: 'OK를 클릭하면 집이 생성됩니다',
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
			handleOk();
		  } else if (result.dismiss === Swal.DismissReason.cancel) {
			// 'Close' 버튼을 클릭했을 때 할 동작, 여기서는 아무것도 하지 않음
		  }
		});
  }
  
//여기 모달창 수정함 1/8 
function checkIntersects() {
	// raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(meshes);
	for (const item of intersects) {
		if (item.object.name === 'floor') {
			
			destinationPoint.x = item.point.x;
			destinationPoint.y = item.point.y+1.3;
			destinationPoint.z = item.point.z;
			console.log(item.point)
			pointerMesh.position.x = destinationPoint.x;
			pointerMesh.position.z = destinationPoint.z;
			// setIsModalOpen(true);
			console.log("x좌표"+item.point.x);
			console.log("y좌표"+item.point.y);
			console.log("z좌표"+item.point.z);
			setDestinationPoint({ x: item.point.x, y: item.point.y, z: item.point.z });
			showMakeHouseAlert()
		}

	}
	const intersectshi = raycaster.intersectObjects(houses);
	for (const item of intersectshi) {
			console.log(item.object.parent.name) //seojin 잘찍힘 1/8
			const hello=item.object.parent.name
			console.log("집 클릭함"+houseOwner+"ahfsadfasdf");
			showMoveHouseAlert(hello);
			break;

	}
	// const intersectHouse = raycaster.intersectObjects(houses);
	// for (const item of intersectHouse) {
	// 		console.log("집 클릭함 드디어 성공??"+item)

	// }
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

        setMouseStart({
            x: e.clientX,
            y: e.clientY
        });
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
// canvas.addEventListener('mousemove', e => {
// 	if (isPressed) {
// 		console.log("move 왼쪽마우스")
// 		calculateMousePosition(e);

// 	}
// 	else if (isDragging) {
// 		setDx(e.clientX - mouseStart.x);
//         setDy(e.clientY - mouseStart.y);

// 		console.log("moving까지 들어옴");
// 		     const rotationSpeed = 0.05;
//         const cameraRotationX = camera.rotation.x - dy * rotationSpeed;
//         const cameraRotationY = camera.rotation.y - dx * rotationSpeed;
// 		console.log("ss");
// 		//여기까지 문제 없는데


//         // Apply rotation to camera
//         camera.rotation.x+=cameraRotationX;
// 		camera.rotation.y+=cameraRotationY;
// 		console.log(camera.rotation.x,camera.rotation.y, camera.rotation.z);

//     }
// });
// canvas.addEventListener('mousemove', e => {
//     if (isDragging) {
//         const deltaX = e.clientX - mouseStart.x;
//         const deltaY = e.clientY - mouseStart.y;

//         const rotationSpeed = 0.05;
//         const newRotationX = camera.rotation.x - deltaY * rotationSpeed;
//         const newRotationY = camera.rotation.y - deltaX * rotationSpeed;

//         camera.rotation.x = newRotationX;
//         camera.rotation.y = newRotationY;

//         // Update starting mouse position for next movement
//         mouseStart.x = e.clientX;
//         mouseStart.y = e.clientY;

//         console.log(camera.rotation.x, camera.rotation.y, camera.rotation.z);
//     }
// });
canvas.addEventListener('mousemove', e => {
    if (isDragging) {
        const deltaX = e.clientX - mouseStart.x;
        const deltaY = e.clientY - mouseStart.y;

        const rotationSpeed = 0.05;

        // player.rotation.set= newRotationX;
        // player.rotation.y = newRotationY;

        mouseStart.x = e.clientX;
        mouseStart.y = e.clientY;

        console.log(camera.rotation.x, camera.rotation.y, camera.rotation.z);
    }
});

//여기 추가함 - 마우스키로 줌인/줌아웃
// canvas.addEventListener( 'mousewheel', (event) => {
//     camera.position.z +=event.deltaY/500;
// });


draw();
    // cleanup
    return () => {
      window.removeEventListener('resize', setSize);
    }
  }, []);

  return (
	<div>
  		<canvas id="three-canvas" />
		  {/* {<IntroPage isOpen={true}  onRequestClose={() => setIsModalOpen(false)} />} */}
		 
				{/* {selectedHouse && <MoveModal product={selectedHouse} isOpen={isModalOpenRoom}  onRequestClose={() => setIsModalOpenRoom(false)} />} */}
	</div>
  );

}
